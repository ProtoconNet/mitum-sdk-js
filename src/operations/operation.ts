import axios from "axios"
import base58 from "bs58"
import { writeFile } from "fs"

import { OperationJson } from "./types"

import { Fact } from "./facts"
import { M1FactSign, M2FactSign, M2NodeFactSign } from "./factsigns"

import { CurrencyItem } from "./item"
import { CreateAccountsFact } from "./create-accounts"
import { CreateContractAccountsFact } from "./create-contract-accounts"

import { Hint } from "../common"
import { NetworkID } from "../config"
import { Assert, ECODE, MitumError } from "../error"
import { SortFunc, TimeStamp, sha3 } from "../utils"
import { Address, Key, M1KeyPair, M2KeyPair, NodeAddress } from "../key"
import { IBuffer, IHintedObject } from "../interfaces"

type FactSignType = M1FactSign | M2FactSign | M2NodeFactSign
type SigType = "M1FactSign" | "M2FactSign" | "M2NodeFactSign" | null
type SignOption = {
    node: string,
}

export class Operation<T extends Fact> implements IBuffer, IHintedObject {
    readonly id: string
    readonly hint: Hint
    readonly memo: string
    readonly fact: T
    private _factSigns: FactSignType[]
    private _hash: Buffer

    constructor(fact: T, memo?: string) {
        this.id = NetworkID.get()
        this.memo = memo ?? ""
        this.fact = fact

        this.hint = new Hint(fact.operationHint)
        this._factSigns = []
        this._hash = Buffer.from([])
    }

    setFactSigns(factSigns: FactSignType[]) {
        if (!factSigns) {
            return
        }

        Assert.check(
            new Set(factSigns.map(fs => fs.signer.toString())).size === factSigns.length,
            MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"),
        )

        const sigType = this.getSigType(factSigns)
        if (this.fact instanceof CreateAccountsFact || this.fact instanceof CreateContractAccountsFact) {
            switch (sigType) {
                case "M1FactSign":
                    Assert.check(
                        this.fact.items !== undefined && (this.fact.items[0] as CurrencyItem).addressType === "",
                        MitumError.detail(ECODE.INVALID_FACTSIGN, "m1 factsign for m2 fact")
                    )
                    break
                case "M2FactSign":
                case "M2NodeFactSign":
                    Assert.check(
                        this.fact.items !== undefined && (this.fact.items[0] as CurrencyItem).addressType !== "",
                        MitumError.detail(ECODE.INVALID_FACTSIGN, "m2 factsign for m1 fact")
                    )
                default:
                    throw MitumError.detail("EC_INVALID_SIG_TYPE", "invalid factsign type in factsigns")
            }
        }

        this._factSigns = factSigns
        this._hash = this.hashing()
    }

    get factSigns() {
        return this._factSigns
    }

    get hash() {
        return this._hash
    }

    get factSignType() {
        return this.getSigType()
    }

    private getSigType(factSigns?: FactSignType[]): SigType {
        if (!factSigns) {
            factSigns = this._factSigns
        }

        if (factSigns.length === 0) {
            return null
        }

        const set = new Set(factSigns.map(fs => Object.getPrototypeOf(fs).constructor.name))
        Assert.check(set.size === 1, MitumError.detail(ECODE.INVALID_FACTSIGNS, "multiple sig-type in operation"))

        return Array.from(set)[0]
    }

    hashing(force?: "force") {
        let b: Buffer
        switch (this.getSigType(this._factSigns)) {
            case "M1FactSign":
                b = sha3(
                    Buffer.concat([
                        this.toBuffer(),
                        Buffer.from(this.memo),
                    ])
                )
            case "M2FactSign":
            case "M2NodeFactSign":
            default:
                b = sha3(this.toBuffer())
        }

        if (force && force === "force") {
            this._hash = b
        }

        return b
    }

    sign(privateKey: string | Key, option?: SignOption) {
        privateKey = Key.from(privateKey)
        const keypair = privateKey.version === "m1" ? M1KeyPair.fromPrivateKey<M1KeyPair>(privateKey) : M2KeyPair.fromPrivateKey<M2KeyPair>(privateKey)
        const sigType = this.factSignType

        if (sigType === "M2NodeFactSign") {
            Assert.check(option !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address in sign option"))
        }

        if (!sigType && (this.fact instanceof CreateAccountsFact || this.fact instanceof CreateContractAccountsFact)) {
            if (keypair instanceof M1KeyPair) {
                Assert.check(
                    this.fact.items !== undefined && (this.fact.items[0] as CurrencyItem).addressType === "",
                    MitumError.detail(ECODE.FAIL_SIGN, "trying to sign m2 fact with m1 keypair")
                )
            } else {
                Assert.check(
                    this.fact.items !== undefined && (this.fact.items[0] as CurrencyItem).addressType !== "",
                    MitumError.detail(ECODE.FAIL_SIGN, "trying to sign m1 fact with m2 keypair")
                )
            }
        }

        const factSign = this.signWithSigType(sigType, keypair, option ? new NodeAddress(option.node) : undefined)

        const idx = this._factSigns
            .map((fs) => fs.signer.toString())
            .indexOf(keypair.publicKey.toString())

        if (idx < 0) {
            this._factSigns.push(factSign)
        } else {
            this._factSigns[idx] = factSign
        }

        this._hash = this.hashing()
    }

    private signWithSigType(sigType: SigType, keypair: M1KeyPair | M2KeyPair, node: Address | undefined) {
        const getM1FactSign = (keypair: M1KeyPair, hash: Buffer) =>
            new M1FactSign(
                keypair.publicKey,
                keypair.sign(Buffer.concat([hash, Buffer.from(this.id)])),
                new TimeStamp().toString(),
            )
        const getM2FactSign = (keypair: M2KeyPair, hash: Buffer) => {
            const now = new TimeStamp()

            return new M2FactSign(
                keypair.publicKey,
                keypair.sign(Buffer.concat([Buffer.from(this.id), hash, now.toBuffer()])),
                now.toString(),
            )
        }
        const getM2NodeFactSign = (node: Address, keypair: M2KeyPair, hash: Buffer) => {
            const now = new TimeStamp()

            return new M2NodeFactSign(
                node.toString(),
                keypair.publicKey,
                keypair.sign(Buffer.concat([
                    Buffer.from(this.id),
                    node.toBuffer(),
                    hash,
                    now.toBuffer(),
                ])),
                now.toString(),
            )
        }

        const hash = this._hash ? this._hash : Buffer.from([])

        if (sigType) {
            switch (sigType) {
                case "M1FactSign":
                    Assert.check(keypair.privateKey.version === "m1", MitumError.detail(ECODE.FAIL_SIGN, "not m1 keypair factsign type != keypair type"))
                    return getM1FactSign(keypair as M1KeyPair, hash)
                case "M2FactSign":
                    Assert.check(keypair.privateKey.version === "m2", MitumError.detail(ECODE.FAIL_SIGN, "not m2 keypair factsign type != keypair type"))
                    return getM2FactSign(keypair as M2KeyPair, hash)
                case "M2NodeFactSign":
                    Assert.check(keypair.privateKey.version === "m2", MitumError.detail(ECODE.FAIL_SIGN, "not m2 keypair factsign type != keypair type"))
                    Assert.check(node !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address"))
                    return getM2NodeFactSign(node as Address, keypair as M2KeyPair, hash)
                default:
                    throw MitumError.detail(ECODE.FAIL_SIGN, "invalid factsign type")
            }
        } else {
            switch (keypair.privateKey.version) {
                case "m1":
                    return getM1FactSign(keypair as M1KeyPair, hash)
                case "m2":
                    if (node) {
                        return getM2NodeFactSign(node, keypair as M2KeyPair, hash)
                    } else {
                        return getM2FactSign(keypair as M2KeyPair, hash)
                    }
                default:
                    throw MitumError.detail(ECODE.FAIL_SIGN, "invalid private key")
            }
        }
    }

    toBuffer(): Buffer {
        if (!this._factSigns) {
            return this.fact.hash
        }

        this._factSigns = this._factSigns.sort(SortFunc)

        return Buffer.concat([
            this.fact.hash,
            Buffer.concat(this._factSigns.map((fs) => fs.toBuffer())),
        ])
    }

    toHintedObject(): OperationJson {
        const op = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        }

        const operation = this.memo ? op : { ...op, memo: this.memo }

        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(SortFunc)

        switch (this.factSignType) {
            case "M1FactSign":
                return {
                    ...operation,
                    fact_signs: factSigns.map(fs => new M1FactSign(fs.signer, fs.signature, fs.signedAt.toString()).toHintedObject()),
                }
            case "M2FactSign":
            case "M2NodeFactSign":
                return {
                    ...operation,
                    signs: factSigns.map(fs => fs.toHintedObject())
                }
            default:
                return operation
        }
    }

    export(filePath: string) {
        writeFile(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
            if (e) {
                throw MitumError.detail(ECODE.FAIL_FILE_CREATION, "fs write-file failed")
            }
        })
    }

    request(url: string, headers?: { [i: string]: any }) {
        if (headers) {
            return axios.post(url, this.toHintedObject(), { headers })
        }
        return axios.post(url, this.toHintedObject())
    }
}