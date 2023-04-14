import bs58 from "bs58";

import {
	CurrencyPolicy,
	FixedFeeer,
	NilFeeer,
	RatioFeeer,
} from "./currency-design";
import { CurrencyPolicyUpdaterFact } from "./currency-policy-updater";
import { Operation } from "../operation";

import { TEST_GENESIS, TEST_NODE } from "../../mitum.config";

describe("test: currency-policy-updater", () => {
	it("case: m1; nil feeer", () => {
		const feeer = new NilFeeer();
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			"2022-11-16T06:46:44.06812Z",
			"PEN",
			policy
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m1, null);

		expect(bs58.encode(fact.hash)).toBe(
			"5Mhz2DfpQ51G3SyNLcLgmCbp8yx5o53ykwre7DidT3Rr"
		);
	});

	it("case: m1; fixed feeer", () => {
		const feeer = new FixedFeeer(TEST_GENESIS.m1.address, "999");
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			"2022-11-16T06:48:54.046555Z",
			"PEN",
			policy
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m1, null);

		expect(bs58.encode(fact.hash)).toBe(
			"4n6AxV17j2oMmQhk1qMqTWzd3dUuEW45v88aLmisoCgy"
		);
	});

	it("case: m1; ratio feeer", () => {
		const feeer = new RatioFeeer(
			TEST_GENESIS.m1.address,
			0.5,
			"1",
			"99"
		);
		const policy = new CurrencyPolicy("33", feeer);

		const fact = new CurrencyPolicyUpdaterFact(
			"2022-11-16T06:51:18.841996Z",
			"PEN",
			policy
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m1, null);

		expect(bs58.encode(fact.hash)).toBe(
			"4h8RXMBj9qpEiWe3JrdnazhasuwVcBnyvVVNj8G3usrp"
		);
	});

	// it("case: m2; nil feeer", () => {});

	// it("case: m2; fixed feeer", () => {});

	// it("case: m2; ratio feeer", () => {});
});
