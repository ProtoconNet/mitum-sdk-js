import { Keys, PubKey } from "./pub"
import { KeyPair, M1KeyPair, M2KeyPair } from "./keypairs"

import { Assert } from "../error"
import { MitumConfig } from "../config"

function getRandomKeys(n: number, f: () => KeyPair): { keys: Keys, keypairs: KeyPair[] } {
    Assert.get(MitumConfig.KEYS_IN_ACCOUNT.satisfy(n)).excute()

    n = Math.floor(n)

    let weight = Math.floor(MitumConfig.THRESHOLD.max / n)
    if (MitumConfig.THRESHOLD.max % n) {
        weight += 1
    }

    const ks = []
    const kps = []
    for (let i = 0; i < n; i++) {
        kps.push(f())
        ks.push(new PubKey(kps[i].publicKey, weight))
    }

    return {
        keys: new Keys(ks, MitumConfig.THRESHOLD.max),
        keypairs: kps,
    }
}

export const M1RandomN = (n: number) => {
    return getRandomKeys(n, () => M1KeyPair.random())
}

export const M2RandomN = (n: number) => {
    return getRandomKeys(n, () =>  M2KeyPair.random())
}

export const M2EtherRandomN = (n: number) => {
    return getRandomKeys(n, () => M2KeyPair.random("ether"))
}