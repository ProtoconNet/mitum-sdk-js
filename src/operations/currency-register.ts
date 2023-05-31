import { NodeFact } from "./facts"
import { FactJson } from "./types"
import { CurrencyDesign } from "./currency-design"

import { HINT } from "../ailas"

export class CurrencyRegisterFact extends NodeFact {
    readonly design: CurrencyDesign
    
    constructor(token: string,  design: CurrencyDesign) {
        super(HINT.CURRENCY_REGISTER_OPERATION_FACT, token)
        this.design = design
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.token.toBuffer(),
            this.design.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            currency: this.design.toHintedObject(),
        }
    }

    get operationHint() {
        return HINT.CURRENCY_REGISTER_OPERATION
    }
}