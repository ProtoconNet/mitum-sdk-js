import base58 from "bs58"

import dummy from "../dummy"
import { Keys, PubKey } from "../../key"
import { KeyUpdaterFact, Operation } from "../../operations"

test("test: key-updater; m1 operation", () => {
	const keys = new Keys([new PubKey(dummy.account.a.public, 100)], 100)

	const fact = new KeyUpdaterFact(
		"2022-11-16T06:16:51.97284Z",
		dummy.genesis.m1.address,
		keys,
		"MCC"
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	expect(base58.encode(fact.hash)).toBe(
		"8o6KNp9rvbmed783f38mnVPb3ss1Q2sZFYj9MpRy9Axa"
	)
	expect(keys.address.toString()).toBe(dummy.account.a.address)
})

test("test: key-updater; m2 operation", () => {
	const keys = new Keys([new PubKey(dummy.account.a.public, 100)], 100)

	const fact = new KeyUpdaterFact(
		"2022-12-13 02:40:48.520067 +0000 UTC",
		dummy.genesis.m2.address,
		keys,
		"MCC"
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m2.private)

	expect(base58.encode(fact.hash)).toBe(
		"6U99URNut8rLxBU5d9taQwP6Dd9LaDUpxq83zffdNAWX"
	)
	expect(keys.address.toString()).toBe(dummy.account.a.address)
})