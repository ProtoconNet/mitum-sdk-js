import bs58 from "bs58";

import { Amount } from "./amount";
import {
	CreateContractAccountsFact,
	CreateContractAccountsItem,
} from "./create-contract-accounts";
import { Operation } from "../operation";

import { TEST_ACCOUNT, TEST_GENESIS } from "../../mitum.config";

import { Keys, PublicKey } from "../../key/key";
import { TimeStamp } from "../../utils/time";

describe("test: create-contract-account", () => {
	it("case: m1; operation", () => {
		const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);
		const item = new CreateContractAccountsItem(keys, amounts);
		const fact = new CreateContractAccountsFact(
			"2022-11-16T06:59:44.986806Z",
			TEST_GENESIS.m1.address,
			[item]
		);
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		expect(bs58.encode(fact.hash)).toBe(
			"79MQkuRZW26k4YXT7xhADF2JwJW4geMfFCVmwNcLsp4Q"
		);
		expect(keys.address.toString()).toBe(TEST_ACCOUNT.address);
	});

	// it("case: m2; operation", () => {});

	it("case: duplicate items", () => {
		const amounts = [new Amount("MCC", "1000")];
		const keys = new Keys([new PublicKey(TEST_ACCOUNT.public, 100)], 100);

		const items = [
			new CreateContractAccountsItem(keys, amounts),
			new CreateContractAccountsItem(keys, amounts),
		];

		expect(
			() =>
				new CreateContractAccountsFact(
					new TimeStamp().UTC(),
					TEST_GENESIS.m1.address,
					items
				)
		).toThrow(Error);
	});
});
