const bs58 = require("bs58");

const { Amount } = require("../../common/amount/amount");
const { TransfersFact, TransfersItem } = require("./transfers");
const { Operation } = require("../operation");

const { TEST_ACCOUNT, TEST_ACCOUNT_R, TEST_CURRENCY, TEST_GENESIS } = require("../../mitum.config");
const { TimeStamp } = require("../../utils/time");

describe("test: transfers", () => {
	it("case: m1; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
		const fact = new TransfersFact(
			"2022-11-16T06:26:07.47499Z",
			TEST_GENESIS.m1.address,
			[item]
		);

		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		expect(bs58.encode(fact.hash)).toBe(
			"GTXjBCvb183KaCtiprpjC4e4XDor6XeBfijZfqwMPsBx"
		);
	});

	it("case: m2; operation", () => {
		const amounts = [new Amount("MCC", "1000")];
		const item = new TransfersItem(TEST_ACCOUNT_R.address, amounts);
		const fact = new TransfersFact(
			"2022-11-19 23:44:30.883651 +0000 UTC",
			TEST_GENESIS.m2.address,
			[item]
		);

		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m2.private);

		expect(bs58.encode(fact.hash)).toBe(
			"k1vnR6xnWBPoehfZGcbnfXBD8yZRmT4jsGfquRUPzjx"
		);
	});

	it("case: transfer to zero address", () => {
		const amounts = [new Amount(TEST_CURRENCY.MCC.currency, "1000")];
		const item = new TransfersItem(TEST_CURRENCY.MCC.zero, amounts);
		const fact = new TransfersFact(
			"2022-11-19 23:44:30.883651 +0000 UTC",
			TEST_GENESIS.m2.address,
			[item]
		);

		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m2.private);

		expect(bs58.encode(fact.hash)).toBe(
			"5F1hhzhi7rtjJmjdbUjDkio8niGiftKJLCxqAmXWvkDv"
		);
	})

	it("case: duplicate items", () => {
		const items = [
			new TransfersItem(TEST_ACCOUNT.address, [
				new Amount("MCC", "1000"),
			]),
			new TransfersItem(TEST_ACCOUNT.address, [
				new Amount("PEN", "1000"),
			]),
		];

		expect(
			() =>
				new TransfersFact(
					new TimeStamp().UTC(),
					TEST_GENESIS.m1.address,
					items
				)
		).toThrow(Error);
	});
});

