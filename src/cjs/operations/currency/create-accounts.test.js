const bs58 = require("bs58");

const { Amount } = require("../../common/amount/amount");
const { CreateAccountsFact, CreateAccountsItem } = require("./create-accounts");

const { Operation } = require("../operation");

const { TEST_GENESIS, TEST_ACCOUNT, TEST_ACCOUNT_R, TEST_ACCOUNT_ETHER } = require("../../mitum.config");

const { ADDRESS_TYPE } = require("../../common/key/address");
const { Keys, PublicKey } = require("../../common/key/key");

const { TimeStamp } = require("../../utils/time");

describe("test: create-account", () => {
	it("case: m1; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);
		const fact = new CreateAccountsFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m1.address,
			[new CreateAccountsItem(keys, amounts)]
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		expect(bs58.encode(fact.hash)).toBe(
			"3YQ6tUgKBKq6HdjREeFTVBYrTDWiTQEYARv6HX8wyQZP"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT.address);
	});

	it("case: m2; operation", () => {
		const amounts = [new Amount("MCC", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT_R.public, 100)], 100);
		const fact = new CreateAccountsFact(
			"2022-10-25 03:52:32.461515 +0000 UTC",
			TEST_GENESIS.m2.address,
			[new CreateAccountsItem(keys, amounts, ADDRESS_TYPE.btc)]
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m2.private);

		expect(bs58.encode(fact.hash)).toBe(
			"4hQnx3YTV4YGNXfoDYDUdx5Q1inFgzNAc8wy6dVoaDAd"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT_R.address);
	});

	it("case: m2 - ether; operation", () => {
		const amounts = [new Amount("MCC", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT_ETHER.public, 100)], 100);
		const fact = new CreateAccountsFact(
			"2022-10-25 03:52:32.461515 +0000 UTC",
			TEST_GENESIS.m2ether.address,
			[new CreateAccountsItem(keys, amounts, ADDRESS_TYPE.ether)]
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m2ether.private);

		expect(bs58.encode(fact.hash)).toBe(
			"7QBsdU2pRXc4vTZAdHKtPi4Ct7NyHiEudyGiErZnHNRj"
		);
		expect(keys.etherAddress.toString()).toBe(TEST_ACCOUNT_ETHER.address);
	});

	it("case: duplicate items", () => {
		const amounts = [new Amount("MCC", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT_R.public, 100)], 100);

		const items = [
			new CreateAccountsItem(keys, amounts),
			new CreateAccountsItem(keys, amounts),
		];

		expect(
			() =>
				new CreateAccountsFact(
					new TimeStamp().UTC(),
					TEST_GENESIS.m2.address,
					items
				)
		).toThrow(Error);
	});
});
