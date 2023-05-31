import { Big } from "./utils"
import { HINT } from "./ailas"
import { MitumConfig, Version } from "./config"
import { Assert, ECODE, MitumError } from "./error"
import { HintedObject, IBuffer, IHintedObject, IString } from "./interfaces"

class Hint implements IString {
    private s: string

    constructor(s: string) {
        this.s = s
    }

    toString(): string {
        return `${this.s}-${Version.get()}`
    }
}

class Token implements IBuffer, IString {
    private s: string

    constructor(s: string) {
        Assert.check(s !== "", MitumError.detail(ECODE.INVALID_TOKEN, "empty token"))
        this.s = s
    }

    static from(s: string | Token) {
        return s instanceof Token ? s : new Token(s)
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return Buffer.from(this.s, "utf8").toString("base64")
    }
}

abstract class ID implements IBuffer, IString {
    private s: string

    constructor(s: string) {
        this.s = s
    }

    equal(id: ID): boolean {
        return this.toString() === id.toString()
    }

    toBuffer(): Buffer {
        return Buffer.from(this.s)
    }

    toString(): string {
        return this.s
    }
}

class CurrencyID extends ID {
    constructor(s: string) {
        super(s)
        Assert.check(
            MitumConfig.CURRENCY_ID.satisfy(s.length),
            MitumError.detail(ECODE.INVALID_CURRENCY_ID, "currency id length out of range")
        )
    }

    static from(s: string | CurrencyID): CurrencyID {
        return s instanceof CurrencyID ? s : new CurrencyID(s)
    }
}

class ContractID extends ID {
    constructor(s: string) {
        super(s)
        Assert.check(
            MitumConfig.CONTRACT_ID.satisfy(s.length),
            MitumError.detail(ECODE.INVALID_CONTRACT_ID, "contract id length out of range")
        )
    }

    static from(s: string | ContractID): ContractID {
        return s instanceof ContractID ? s : new ContractID(s)
    }
}

class Amount implements IBuffer, IHintedObject {
    private static hint: Hint = new Hint(HINT.AMOUNT)
    readonly currency: CurrencyID
    readonly big: Big

    constructor(currency: string | CurrencyID, big: string | number | Big) {
        this.currency = CurrencyID.from(currency)
        this.big = Big.from(big)
        Assert.check(0 < this.big.big, MitumError.detail(ECODE.INVALID_AMOUNT, "zero big"))
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.big.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            _hint: Amount.hint.toString(),
            currency: this.currency.toString(),
            amount: this.big.toString(),
        }
    }
}

export {
    Hint,
    Token,
    ID, CurrencyID, ContractID,
    Amount,
}