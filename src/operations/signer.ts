import base58 from "bs58"

import { M1FS, OperationJson } from './types';
import { M1FactSign, M2FactSign, M2NodeFactSign } from "./factsigns"

import { NetworkID } from "../config"
import { HintedObject } from "../interfaces"
import { Key, M1KeyPair, M2KeyPair, NodeAddress } from "../key"
import { Assert, ECODE, MitumError } from "../error"
import { FullTimeStamp, TimeStamp, sha3 } from "../utils"

export class Signer {
    readonly keypair: M1KeyPair | M2KeyPair
    readonly id: string

    constructor(privateKey: string | Key) {
        privateKey = Key.from(privateKey)
        this.keypair = (
            privateKey.version === "m1"
                ? M1KeyPair.fromPrivateKey(privateKey)
                : M2KeyPair.fromPrivateKey(privateKey)
        )
        this.id = NetworkID.get()
    }

    sign(json: HintedObject, option?: { node: string }) {
        if (json.fact_signs !== undefined) {
            Assert.check(
                this.keypair.privateKey.version === "m1",
                MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "not m2 operation")
            )
        } else if (json.signs !== undefined) {
            Assert.check(
                this.keypair.privateKey.version === "m2",
                MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "not m1 operation")
            )
        }

        try {
            switch (this.keypair.privateKey.version) {
                case "m1":
                    return this.m1Sign(json as OperationJson)
                case "m2":
                    return option ? this.nodeSign(json as OperationJson, option.node) : this.m2Sign(json as OperationJson)
                default:
                    throw MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "unknown version of private key")
            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw MitumError.detail(ECODE.FAIL_SIGN, "failed to sign; " + e.message)
            } else {
                throw MitumError.detail(ECODE.FAIL_SIGN, "failed to sign; maybe not operation")
            }
        }
    }

    private m1Sign(json: OperationJson) {
        const now = new TimeStamp()

        const fs = new M1FactSign(
            this.keypair.publicKey.toString(),
            this.keypair.sign(
                Buffer.concat([base58.decode(json.fact.hash), Buffer.from(this.id)])
            ),
            now.toString(),
        ).toHintedObject() as M1FS

        if (json.fact_signs !== undefined) {
            json.fact_signs.push(fs)
        } else {
            json.fact_signs = [fs]
        }

        const factSigns = json.fact_signs
            .map(s =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super")
                ])
            )
            .sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
            Buffer.from(json.memo ?? "")
        ])

        json.hash = base58.encode(sha3(msg))

        return json
    }

    private m2Sign(json: OperationJson) {
        const now = new TimeStamp()

        const fs = new M2FactSign(
            this.keypair.publicKey.toString(),
            this.keypair.sign(
                Buffer.concat([
                    Buffer.from(this.id),
                    base58.decode(json.fact.hash),
                    now.toBuffer(),
                ])
            ),
            now.toString(),
        ).toHintedObject()

        if (json.signs !== undefined) {
            json.signs = [...json.signs, fs]
        } else {
            json.signs = [fs]
        }

        const factSigns = json.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super"),
                ])
            )
            .sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ])

        json.hash = base58.encode(sha3(msg))

        return json
    }

    private nodeSign(json: OperationJson, node: string) {
        const nd = new NodeAddress(node)
        const now = new TimeStamp()
        const fs = new M2NodeFactSign(
            node,
            this.keypair.publicKey.toString(),
            this.keypair.sign(
                Buffer.concat([
                    Buffer.from(this.id),
                    nd.toBuffer(),
                    base58.decode(json.fact.hash),
                    now.toBuffer(),
                ])
            ),
            now.toString(),
        ).toHintedObject()

        if (json.signs) {
            json.signs = [...json.signs, fs]
        } else {
            json.signs = [fs]
        }

        const factSigns = json.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    base58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).toBuffer("super"),
                ])
            )
            .sort((a, b) => Buffer.compare(a, b))

        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ])

        json.hash = base58.encode(sha3(msg))

        return json
    }
}