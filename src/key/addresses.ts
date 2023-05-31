import { AddressType } from "./types"

import { SUFFIX } from "../ailas"
import { CurrencyID } from "../common"
import { MitumConfig } from "../config"
import { IBuffer, IString } from "../interfaces"
import { ECODE, MitumError, StringAssert } from "../error"

abstract class BaseAddress implements IBuffer, IString {
    private s: string
    readonly type: AddressType

    constructor(s: string, type?: AddressType) {
        this.s = s

        if (type) {
            this.type = type
        } else if (this.s.endsWith(SUFFIX.ACCOUNT_ADDRESS)) {
            this.type = "btc"
        } else if (this.s.endsWith(SUFFIX.ETHER_ACCOUNT_ADDRESS)) {
            this.type = "ether"
        } else if (this.s.endsWith(SUFFIX.NODE_ADDRESS)) {
            this.type = "node"
        } else if (this.s.endsWith(SUFFIX.ZERO_ADDRESS)) {
            this.type = "zero"
        } else {
            throw MitumError.detail(ECODE.INVALID_ADDRESS, "address type not detected")
        }
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}

export class Address extends BaseAddress {
    constructor(s: string) {
        super(s)
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid address"))
            .empty().not()
            .endsWith(SUFFIX.ACCOUNT_ADDRESS, SUFFIX.ETHER_ACCOUNT_ADDRESS)
            .satisfyConfig(MitumConfig.ADDRESS.DEFAULT)
            .excute()
    }

    static from(s: string | Address): Address {
        return s instanceof Address ? s : new Address(s)
    }
}

export class NodeAddress extends BaseAddress {
    constructor(s: string) {
        super(s, "node")
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid node address"))
            .empty().not()
            .endsWith(SUFFIX.NODE_ADDRESS)
            .satisfyConfig(MitumConfig.ADDRESS.NODE)
            .excute()
    }

    static from(s: string | NodeAddress): NodeAddress {
        return s instanceof NodeAddress ? s : new NodeAddress(s)
    }
}

export class ZeroAddress extends BaseAddress {
    readonly currency: CurrencyID

    constructor(s: string) {
        super(s, "zero")
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid zero address"))
            .empty().not()
            .endsWith(SUFFIX.ZERO_ADDRESS)
            .satisfyConfig(MitumConfig.ADDRESS.ZERO)
            .excute()

        this.currency = new CurrencyID(s.substring(0, s.length - MitumConfig.SUFFIX.ZERO_ADDRESS.value!))
    }

    static from(s: string | ZeroAddress): ZeroAddress {
        return s instanceof ZeroAddress ? s : new ZeroAddress(s)
    }
}