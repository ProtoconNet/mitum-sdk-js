import { SortFunc } from "../utils"
import { MitumConfig } from "../config"
import { KeyPairType } from "../key"
import { Amount, Hint } from "../common"
import { Assert, ECODE, MitumError } from "../error"
import { HintedObject, IBuffer, IHintedObject, IString } from "../interfaces"

export abstract class Item implements IBuffer, IString, IHintedObject {
    private hint: Hint
    
    constructor(hint: string) {
        this.hint = new Hint(hint)
    }

    abstract toBuffer(): Buffer
    abstract toString(): string
    
    toHintedObject(): HintedObject {
        return {
            _hint: this.hint.toString()
        }
    }
}

export abstract class CurrencyItem extends Item {
    readonly amounts: Amount[]
    readonly addressType: KeyPairType | ""

    constructor(hint: string, amounts: Amount[], addressType?: KeyPairType) {
        super(hint)
        
        Assert.check(
            MitumConfig.AMOUNTS_IN_ITEM.satisfy(amounts.length),
            MitumError.detail(ECODE.INVALID_AMOUNTS, "amounts length out of range")    
        )
        Assert.check(
            new Set(amounts.map(am => am.currency.toString())).size === amounts.length,
            MitumError.detail(ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts")
        )

        this.amounts = amounts
        this.addressType = addressType ?? ""
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            amounts: this.amounts.sort(SortFunc).map(am => am.toHintedObject()),
        }
    }
}