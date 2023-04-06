import bs58 from "bs58";

import { Amount } from "./amount";
import { CreateAccountsFact, CreateAccountsItem } from "./create-accounts";
import { Operation } from "../operation";

import { TEST_GENESIS, TEST_ACCOUNT, TEST_ACCOUNT_R } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";
import { TimeStamp } from "../../utils/time";

describe("test: create-account", () => {
	it("case: m1; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);
		const fact = new CreateAccountsFact(
			"2022-11-16T06:05:14.889691Z",
			TEST_GENESIS.m1.address,
			[new CreateAccountsItem(keys, amounts)]
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m1.private, null);

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
			[new CreateAccountsItem(keys, amounts)]
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(bs58.encode(fact.hash)).toBe(
			"2NfVhz4yfRJ2ZexQgqcox67v6jzu2X5qYiDbYoeQaPgq"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT_R.address);
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
