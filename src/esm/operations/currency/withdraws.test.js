import bs58 from "bs58";

import { Amount } from "./amount";
import { WithdrawsFact, WithdrawsItem } from "./withdraws";
import { Operation } from "../operation";

import { TEST_ACCOUNT, TEST_GENESIS } from "../../mitum.config";
import { TimeStamp } from "../../utils/time";

describe("test: withdraw", () => {
	it("case: m1; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const item = new WithdrawsItem(TEST_ACCOUNT.address, amounts);

		const fact = new WithdrawsFact(
			"2022-11-16T07:03:47.411489Z",
			TEST_GENESIS.m1.address,
			[item]
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		expect(bs58.encode(fact.hash)).toBe(
			"ApAZLELnH8iYHtThDJk5dtr4Ni7TvDfJT4XHU4Z8gHM5"
		);
	});

	// it("case: m2; operation", () => {});

	it("case: duplicate items", () => {
		const item = [
			new WithdrawsItem(TEST_ACCOUNT.address, [
				new Amount("MCC", "1000"),
			]),
			new WithdrawsItem(TEST_ACCOUNT.address, [
				new Amount("PEN", "1000"),
			]),
		];

		expect(
			() =>
				new WithdrawsFact(
					new TimeStamp().UTC(),
					TEST_GENESIS.m1.address,
					[item]
				)
		).toThrow(Error);
	});
});
