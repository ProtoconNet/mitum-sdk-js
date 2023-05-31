import { Keys, M1RandomN, M2EtherRandomN, M2RandomN, PubKey } from "../../key"

test("test: random n; m1", () => {
    for (let n = 1; n <= 10; n++) {
        const { keys, keypairs } = M1RandomN(n)

        const pks = keys.keys.map(
            (k) => new PubKey(k.toString(), k.weight.v)
        )
        const pkeys = new Keys(pks, keys.threshold.v)

        expect(pkeys.address.toString()).toBe(keys.address.toString())

        const pubKeys = keys.keys.map((k) => k.toString())
        const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString())

        pubKeys.forEach((k) => expect(kpPubKeys.includes(k)).toBe(true))
    }
})

test("test: random n; m2", () => {
    for (let n = 1; n <= 10; n++) {
        const { keys, keypairs } = M2RandomN(n)

        const pks = keys.keys.map(
            (k) => new PubKey(k.toString(), k.weight.v)
        )
        const pkeys = new Keys(pks, keys.threshold.v)

        expect(pkeys.address.toString()).toBe(keys.address.toString())

        const pubKeys = keys.keys.map((k) => k.toString())
        const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString())

        pubKeys.forEach((k) => expect(kpPubKeys.includes(k)).toBe(true))
    }
})

test("test: random n; m2 ether", () => {
    for (let n = 1; n <= 10; n++) {
        const { keys, keypairs } = M2EtherRandomN(n)

        const pks = keys.keys.map(
            (k) => new PubKey(k.toString(), k.weight.v)
        )

        const pkeys = new Keys(pks, keys.threshold.v)

        expect(pkeys.etherAddress.toString()).toBe(keys.etherAddress.toString())

        const pubKeys = keys.keys.map((k) => k.toString())
        const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString())

        pubKeys.forEach((k) => expect(kpPubKeys.includes(k)).toBe(true))
    }
})