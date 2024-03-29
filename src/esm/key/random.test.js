import { M1RandomN, M2RandomN, M2EtherRandomN } from "./random";
import { Keys, PublicKey } from "./key";

describe("test: keys and keypairs generation", () => {
	it("case: m1; random n", () => {
		for (let n = 1; n <= 10; n++) {
			const { keys, keypairs } = M1RandomN(n);

			const pks = keys.keys.map(
				(k) => new PublicKey(k.toString(), k.weight.v)
			);
			const pkeys = new Keys(pks, keys.threshold.v);

			expect(pkeys.address.toString()).toBe(keys.address.toString());

			const pubKeys = keys.keys.map((k) => k.toString());
			const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString());

			pubKeys.forEach((k) => expect(kpPubKeys.includes(k)).toBe(true));
		}
	});

	it("case: m2; random n", () => {
		for (let n = 1; n <= 10; n++) {
			const { keys, keypairs } = M2RandomN(n);

			const pks = keys.keys.map(
				(k) => new PublicKey(k.toString(), k.weight.v)
			);
			const pkeys = new Keys(pks, keys.threshold.v);

			expect(pkeys.address.toString()).toBe(keys.address.toString());

			const pubKeys = keys.keys.map((k) => k.toString());
			const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString());

			pubKeys.forEach((k) => expect(kpPubKeys.includes(k)).toBe(true));
		}
	});

	it("case: m2 ether; random n", () => {
		for (let n = 1; n <= 10; n++) {
			const { keys, keypairs } = M2EtherRandomN(n);

			const pks = keys.keys.map(
				(k) => new PublicKey(k.toString(), k.weight.v)
			);

			const pkeys = new Keys(pks, keys.threshold.v);

			expect(pkeys.etherAddress.toString()).toBe(keys.etherAddress.toString());

			const pubKeys = keys.keys.map((k) => k.toString());
			const kpPubKeys = keypairs.map((kp) => kp.publicKey.toString());

			pubKeys.forEach((k) => expect(kpPubKeys.includes(k)).toBe(true));
		}
	})
});
