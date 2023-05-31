import base58 from "bs58"

import { CurrencyItem } from "./item"
import { OperationFact } from "./facts"

import { Amount } from "../common"
import { SortFunc } from "../utils"
import { HINT, SUFFIX } from "../ailas"
import { HintedObject } from "../interfaces"
import { Assert, ECODE, MitumError } from "../error"
import { Keys, KeyPairType, Address } from "../key"

export class CreateAccountsFact extends OperationFact<CreateAccountsItem> {
    constructor(token: string, sender: string | Address, items: CreateAccountsItem[]) {
        super(HINT.CREATE_ACCOUNTS_OPERATION_FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.addressType !== "")).size === 1,
            MitumError.detail(ECODE.INVALID_ITEMS, "not unified mitum versions of items")
        )

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate key hash found in items")
        )
    }

    get operationHint() {
        return HINT.CREATE_ACCOUNTS_OPERATION
    }
}

export class CreateAccountsItem extends CurrencyItem {
    readonly keys: Keys
    private addressSuffix: string

    constructor(keys: Keys, amounts: Amount[], addressType?: KeyPairType) {
        super(HINT.CREATE_ACCOUNTS_ITEM, amounts, addressType)
        this.keys = keys

        if (addressType === "btc") {
            this.addressSuffix = SUFFIX.ACCOUNT_ADDRESS
        } else if (addressType === "ether") {
            this.addressSuffix = SUFFIX.ETHER_ACCOUNT_ADDRESS
        } else {
            this.addressSuffix = ""
        }
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.from(this.addressSuffix),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        const item = {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
        }

        if (this.addressSuffix) {
            return {
                ...item,
                addrtype: this.addressSuffix
            }
        }

        return item
    }

    toString(): string {
        return base58.encode(this.keys.toBuffer())
    }
}