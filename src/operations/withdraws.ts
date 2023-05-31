import { CurrencyItem } from "./item"
import { OperationFact } from "./facts"

import { HINT } from "../ailas"
import { Amount } from "../common"
import { Address } from "../key"
import { SortFunc } from "../utils"
import { HintedObject } from "../interfaces"
import { Assert, ECODE, MitumError } from "../error"

export class WithdrawsItem extends CurrencyItem {
    readonly target: Address

    constructor(target: string | Address, amounts: Amount[]) {
        super(HINT.WITHDRAWS_ITEM, amounts)
        this.target = typeof target === "string" ? new Address(target) : target
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.target.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
        }
    }

    toString(): string {
        return this.target.toString()
    }
}

export class WithdrawsFact extends OperationFact<WithdrawsItem> {
    constructor(token: string, sender: string | Address, items: WithdrawsItem[]) {
        super(HINT.WITHDRAWS_OPERATION_FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate target found in items")
        )
    }

    get operationHint() {
        return HINT.WITHDRAWS_OPERATION
    }
}