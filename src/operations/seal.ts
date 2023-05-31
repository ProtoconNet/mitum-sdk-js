import axios from "axios"
import base58 from "bs58"
import { writeFile } from "fs"

import { Fact } from "./facts"
import { Operation } from "./operation"

import { HINT } from "../ailas"
import { Hint } from "../common"
import { Key, M1KeyPair } from "../key"
import { sha3, TimeStamp } from "../utils"
import { MitumConfig, NetworkID } from "../config"
import { Assert, ECODE, MitumError } from "../error"
import { HintedObject, IBuffer, IHintedObject } from "../interfaces"

type OperationJson = {
    _hint: string,
    fact: {
        _hint: string,
        token: string,
        hash: string,
        [i: string]: any,
    },
    hash: string,
    memo?: string,
    fact_signs?: {
        _hint: string,
        signer: string,
        signed_at: string,
        signature: string,
    }[],
}

export class Seal implements IBuffer, IHintedObject {
    private static hint: Hint = new Hint(HINT.BASE_SEAL)
    readonly id: string
    readonly operations: OperationJson[]
    private signer: string
    private signature: Buffer
    private signedAt: string
    private _hash: Buffer
    private _bodyHash: Buffer

    constructor(operations: Operation<Fact>[]) {
        this.id = NetworkID.get()
        Assert.check(
            MitumConfig.OPERATIONS_IN_SEAL.satisfy(operations.length),
            MitumError.detail(ECODE.INVALID_OPERATIONS, "operations length out of range")
        )

        this.operations = operations.map(op => {
            if (op instanceof Operation) {
                Assert.check(
                    op.factSignType === "M1FactSign",
                    MitumError.detail(ECODE.INVALID_SIG_TYPE, "m2 operation found in seal operations")
                )
                return op.toHintedObject() as OperationJson
            }

            try {
                return op as OperationJson
            } catch (e) {
                throw MitumError.detail(ECODE.INVALID_OPERATION, "invalid operation, or ")
            }
        })

        Assert.check(
            new Set(this.operations.map(op => op.fact.hash)).size === this.operations.length,
            MitumError.detail(ECODE.INVALID_OPERATIONS, "duplicate facts found in seal operations")
        )

        this.signer = ""
        this.signature = Buffer.from([])
        this.signedAt = ""
        this._hash = Buffer.from([])
        this._bodyHash = Buffer.from([])
    }

    get hash() {
        return this._hash
    }

    get bodyHash() {
        return this._bodyHash
    }

    toBuffer(): Buffer {
        return Buffer.concat([this.bodyHash, this.signature])
    }

    hashing(): Buffer {
        return sha3(this.toBuffer())
    }

    sign(privateKey: string | Key) {
        privateKey = Key.from(privateKey)
        Assert.check(
            privateKey.version === "m1",
            MitumError.detail(ECODE.FAIL_SIGN, "not m1 private key")
        )

        const keypair = M1KeyPair.fromPrivateKey(privateKey)
        const signer = keypair.publicKey
        const signedAt = new TimeStamp()

        const bodyHash = sha3(
            Buffer.concat([
                signer.toBuffer(),
                signedAt.toBuffer(),
                Buffer.concat(
                    this.operations.map(op => base58.decode(op.hash))
                )
            ])
        )

        const signature = keypair.sign(Buffer.concat([
            bodyHash, Buffer.from(NetworkID.get())
        ]))

        this.signer = signer.toString()
        this.signedAt = signedAt.toString()
        this.signature = signature
        this._bodyHash = bodyHash
        this._hash = this.hashing()
    }

    toHintedObject(): HintedObject {
        return {
            _hint: Seal.hint.toString(),
            hash: this.hash.length > 0 ? base58.encode(this.hash) : "",
            body_hash: this.bodyHash.length > 0 ? base58.encode(this.bodyHash) : "",
            signer: this.signer,
            signature: this.signature.length > 0 ? base58.encode(this.signature) : "",
            signed_at: this.signedAt,
            operations: this.operations,
        }
    }

    export(filePath: string) {
        writeFile(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
			if (e) {
				throw MitumError.detail(ECODE.FAIL_FILE_CREATION, "fs write-file failed")
			}
		})
    }

    request(url: string, headers?: {[i:string]: any}) {
        if (headers) {
            return axios.post(url, this.toHintedObject(), { headers })
        }
        return axios.post(url, this.toHintedObject())
    }
}