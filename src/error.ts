import { RangeConfig } from './config'

export type ErrorCode = typeof ECODE[keyof typeof ECODE] | typeof ECODE.CURRENCY[keyof typeof ECODE.CURRENCY]

export const ECODE = {
    UNKNOWN: "EC_UNKNOWN",
    INVALID_SEED: "EC_INVALID_SEED",
    INVALID_KEY: "EC_INVALID_KEY",
    INVALID_KEYS: "EC_INVALID_KEYS",
    INVALID_KEY_PAIR: "EC_INVALID_KEY_PAIR",
    INVALID_PRIVATE_KEY: "EC_INVALID_PRIVATE_KEY",
    INVALID_PUBLIC_KEY: "EC_INVALID_PUBLIC_KEY",
    INVALID_WEIGHT: "EC_INVALID_WEIGHT",
    INVALID_THRESHOLD: "EC_INVALID_THRESHOLD",
    INVALID_ADDRESS: "EC_INVALID_ADDRESS",
    INVALID_ADDRESS_TYPE: "EC_INVALID_ADDRESS_TYPE",
    INVALID_BIG_INTEGER: "EC_INVALID_BIG_INTERGER",
    INVALID_FLOAT: "EC_INVALID_FLOAT",
    INVALID_HINT: "EC_INVALID_HINT",
    INVALID_TOKEN: "EC_INVALID_TOKEN",
    INVALID_CURRENCY_ID: "EC_INVALID_CURRENCY_ID",
    INVALID_CONTRACT_ID: "EC_INVALID_CONTRACT_ID",
    INVALID_NETWORK_ID: "EC_INVALID_NETWORK_ID",
    INVALID_VERSION: "EC_INVALID_VERSION",
    INVALID_ITEM: "EC_INVALID_ITEM",
    INVALID_ITEMS: "EC_INVALID_ITEMS",
    INVALID_FACTSIGN: "EC_INVALID_FACTSIGN",
    INVALID_FACTSIGNS: "EC_INVALID_FACTSIGNS",
    INVALID_SIG_TYPE: "EC_INVALID_SIG_TYPE",
    INVALID_FACT: "EC_INVALID_FACT",
    INVALID_OPERATION: "EC_INVALID_OPERATION",
    INVALID_OPERATIONS: "EC_INVALID_OPERATIONS",
    INVALID_SEAL: "EC_INVALID_SEAL",
    INVALID_AMOUNT: "EC_INVALID_AMOUNT",
    INVALID_AMOUNTS: "EC_INVALID_AMOUNTS",
    INVALID_RATIO: "EC_INVALID_RATIO",
    NOT_IMPLEMENTED_BUFFER: "EC_NOT_IMPLEMENTED_BUFFER",
    NOT_IMPLEMENTED_HINTED_OBJECT: "EC_NOT_IMPLEMENTED_HINTED_OBJECT",
    NOT_IMPLEMENTED_METHOD: "EC_NOT_IMPLEMENTED_METHOD",
    FAIL_FILE_CREATION: "EC_FAIL_FILE_CREATION",
    FAIL_SIGN: "EC_FAIL_SIGN",
    CURRENCY: {
        INVALID_CURRENCY_FEEER: "EC_INVALID_CURRENCY_FEEER",
        INVALID_CURRENCY_POLICY: "EC_INVALID_CURRENCY_POLICY",
        INVALID_CURRENCY_DESIGN: "EC_INVALID_CURRENCY_DESIGN",
    },
} as const

export class MitumError extends Error {
    private code: ErrorCode
    
    private constructor(code: ErrorCode, msg?: string) {
        super(msg)
        this.code = code
    }

    static new() {
        return new MitumError(ECODE.UNKNOWN)
    }

    static detail(code?: ErrorCode, msg?: string) {
        return new MitumError(code ?? ECODE.UNKNOWN, msg)
    }
}

export class Assert {
    private condition: boolean
    private error: MitumError

    private constructor(condition: boolean, error: MitumError) {
        this.condition = condition
        this.error = error
    }

    static get(condition: boolean, error?: MitumError) {
        return new Assert(condition, error ?? MitumError.new())
    }

    static check(condition: boolean, error?: MitumError) {
        Assert.get(condition, error).excute()
    }

    not() {
        this.condition = !this.condition
        return this
    }

    true() {
        return this
    }

    false() {
        return this.not()
    }

    excute() {
        if (!this.condition) {
            throw this.error
        }
    }
}

export class StringAssert {
    private readonly s: string
    private condition: boolean | undefined
    private error: MitumError

    private constructor(s: string,  error: MitumError) {
        this.s = s
        this.error = error
        this.condition = undefined
    }

    static with(s: string, error?:MitumError) {
        return new StringAssert(s, error ?? MitumError.new())
    }

    private union(condition: boolean) {
        if (this.condition !== undefined) {
            this.condition = this.condition && condition
        } else {
            this.condition = condition
        }
    }

    not() {
        if (this.condition !== undefined) {
            this.condition = !this.condition
        }
        return this
    }

    empty() {
        this.union(this.s === "")
        return this
    }

    equal(s: string) {
        this.union(this.s === s)
        return this
    }

    startsWith(...pre: string[]) {
        this.union(pre.reduce((prev, curr) => prev || this.s.startsWith(curr), false))
        return this
    }

    endsWith(...suf: string[]) {
        this.union(suf.reduce((prev, curr) => prev || this.s.endsWith(curr), false))
        return this
    }

    satisfyConfig(config: RangeConfig) {
        this.union(config.satisfy(this.s.length))
        return this
    }

    chainAnd(...conditions: boolean[]) {
        this.union(conditions.reduce((prev, curr) => prev && curr, true))
        return this
    }

    chainOr(...conditions: boolean[]) {
        this.union(conditions.reduce((prev, curr) => prev || curr, false))
        return this
    }

    excute() {
        if (!this.condition) {
            throw this.error
        }
    }
}