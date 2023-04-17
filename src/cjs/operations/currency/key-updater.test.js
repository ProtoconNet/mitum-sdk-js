const bs58 = require("bs58");

const { KeyUpdaterFact } = require("./key-updater");
const { Operation } = require("../operation");

const { TEST_GENESIS, TEST_ACCOUNT } = require("../../mitum.config");

const { Keys, PublicKey } = require("../../key/key");

describe("test: key-updater", () => {
	it("case: m1; operation", () => {
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);

		const fact = new KeyUpdaterFact(
			"2022-11-16T06:16:51.97284Z",
			TEST_GENESIS.m1.address,
			keys,
			"MCC"
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		expect(bs58.encode(fact.hash)).toBe(
			"8o6KNp9rvbmed783f38mnVPb3ss1Q2sZFYj9MpRy9Axa"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT.address);
	});

	it("case: m2; operation", () => {
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);

		const fact = new KeyUpdaterFact(
			"2022-12-13 02:40:48.520067 +0000 UTC",
			TEST_GENESIS.m2.address,
			keys,
			"MCC"
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m2.private);

		expect(bs58.encode(fact.hash)).toBe(
			"6U99URNut8rLxBU5d9taQwP6Dd9LaDUpxq83zffdNAWX"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT.address);
	});
});
