import { OperationFact } from "./facts"
import { CurrencyItem } from "./item"

import { Amount } from "../common"
import { SortFunc } from "../utils"
import { HintedObject } from "../interfaces"
import { HINT, SUFFIX } from "../ailas"
import { Address, ZeroAddress } from "../key"
import { Assert, ECODE, MitumError } from "../error"

export class TransfersItem extends CurrencyItem {
    readonly receiver: Address | ZeroAddress

    constructor(receiver: string | Address | ZeroAddress, amounts: Amount[]) {
        super(HINT.TRANSFERS_ITEM, amounts)

        if (typeof receiver === "string") {
            if (receiver.endsWith(SUFFIX.ZERO_ADDRESS)) {
                this.receiver = new ZeroAddress(receiver)
            } else {
                this.receiver = new Address(receiver)
            }
        } else {
            this.receiver = receiver
        } 

        if (this.receiver.type === "zero") {
            for (const am of amounts) {
                Assert.check(
                    am.currency.equal((this.receiver as ZeroAddress).currency), 
                    MitumError.detail(ECODE.INVALID_AMOUNT, "invalid amount currency for given zero address"),
                )
            }
        }
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.receiver.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
        }
    }

    toString(): string {
        return this.receiver.toString()
    }
}

export class TransfersFact extends OperationFact<TransfersItem> {
    constructor(token: string, sender: string | Address, items: TransfersItem[]) {
        super(HINT.TRANSFERS_OPERATION_FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver found in items")
        )
    }

    get operationHint() {
        return HINT.TRANSFERS_OPERATION
    }
}