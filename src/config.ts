export type Setting<T> = {
    get: () => T
    set: (val: T) => T
}

export const Version: Setting<string> = (() => {
    let v = "v0.0.1"
    return {
        get: () => v,
        set: (val: string) => {
            v = val
            return v
        }
    }
})()

export const NetworkID: Setting<string> = (() => {
    let id = "mitum"
    return {
        get: () => id,
        set: (val: string) => {
            id = val
            return id
        }
    }
})()

export type RangeConfig = {
    value?: number
    min: number
    max: number
    satisfy: (target: number) => boolean
}

const getRangeConfig = (min: number, max?: number): RangeConfig => {    
    return {
        value: min == (max ?? min) ? min : undefined,
        min,
        max: max ?? min,
        satisfy: (target: number) => min <= target && target <= (max ?? min),
    }
}

export const MitumConfig = {
    SUFFIX: {
        DEFAULT: getRangeConfig(3),
        ZERO_ADDRESS: getRangeConfig(5)
    },
    CURRENCY_ID: getRangeConfig(3, 10),
    CONTRACT_ID: getRangeConfig(3, 10),
    SEED: getRangeConfig(36, Number.MAX_SAFE_INTEGER),
    THRESHOLD: getRangeConfig(1, 100),
    WEIGHT: getRangeConfig(1, 100),
    ADDRESS: {
        DEFAULT: getRangeConfig(43, 47),
        ZERO: getRangeConfig(8, 15),
        NODE: getRangeConfig(4, Number.MAX_SAFE_INTEGER),
    },
    KEYS_IN_ACCOUNT: getRangeConfig(1, 10),
    AMOUNTS_IN_ITEM: getRangeConfig(1, 10),
    ITEMS_IN_FACT: getRangeConfig(1, 10),
    OPERATIONS_IN_SEAL: getRangeConfig(1, 10),
    KEY: {
        M1: {
            PRIVATE: getRangeConfig(55),
            PUBLIC: getRangeConfig(46, 48),
        },
        M2: {
            PRIVATE: getRangeConfig(46, 48),
            PUBLIC: getRangeConfig(46, 48),
        },
        M2ETHER: {
            PRIVATE: getRangeConfig(67),
            PUBLIC: getRangeConfig(133),
        }
    }
}