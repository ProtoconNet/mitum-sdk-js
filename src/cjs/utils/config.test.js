const bs58 = require("bs58");

const { TimeStamp } = require("./time");
const { useId, useV } = require("./config");

const { TEST_ACCOUNT, TEST_GENESIS } = require("../mitum.config");
const { Keys, PublicKey } = require("../key/key");

const { Amount } = require("../operations/currency/amount");
const {
	CreateAccountsFact,
	CreateAccountsItem,
} = require("../operations/currency/create-accounts");
const { Operation } = require("../operations/operation");

describe("test: config", () => {
	it("case: version", () => {
		const version2 = "v0.0.2";
		const version1 = "v0.0.1";

		useV(version2);
		let amount = new Amount("MCC", "100").hint.toString();
		let key = new PublicKey(TEST_ACCOUNT.public, 100);
		let keys = new Keys([key], 100).hint.toString();
		key = key.hint.toString();
		expect(amount.substring(amount.length - 6)).toBe(version2);
		expect(key.substring(key.length - 6)).toBe(version2);
		expect(keys.substring(keys.length - 6)).toBe(version2);

		useV(version1);
		amount = new Amount("MCC", "100").hint.toString();
		key = new PublicKey(TEST_ACCOUNT.public, 100);
		keys = new Keys([key], 100).hint.toString();
		key = key.hint.toString();
		expect(amount.substring(amount.length - 6)).toBe(version1);
		expect(key.substring(key.length - 6)).toBe(version1);
		expect(keys.substring(keys.length - 6)).toBe(version1);
	});

	it("case: id", () => {
		const id1 = "mitum";
		const id2 = "mainnet";

		const amount = new Amount("MCC", "100");
		const key = new PublicKey(TEST_ACCOUNT.public, 100);
		const keys = new Keys([key], 100);
		const item = new CreateAccountsItem(keys, [amount]);
		const fact = new CreateAccountsFact(
			new TimeStamp().UTC(),
			TEST_GENESIS.m1.address,
			[item]
		);

		useId(id1);
		const operation1 = new Operation(fact);
		operation1.sign(TEST_GENESIS.m1.private);

		useId(id2);
		const operation2 = new Operation(fact);
		operation2.sign(TEST_GENESIS.m1.private);

		useId(id1);
		const operation3 = new Operation(fact);
		operation3.sign(TEST_GENESIS.m1.private);

		expect(operation1.id.toString()).toBe(id1);
		expect(operation2.id.toString()).toBe(id2);
		expect(operation3.id.toString()).toBe(id1);

		expect(bs58.encode(operation1.factSigns[0].sign)).not.toBe(
			bs58.encode(operation2.factSigns[0].sign)
		);
		expect(bs58.encode(operation1.factSigns[0].sign)).toBe(
			bs58.encode(operation3.factSigns[0].sign)
		);
	});
});
