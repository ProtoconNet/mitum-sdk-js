import { Seal } from "./seal";
import { Operation } from "./operation";

import { Amount } from "./currency/amount";
import { TransfersFact, TransfersItem } from "./currency/transfers";
import { TEST_ACCOUNT, TEST_GENESIS, TEST_NODE } from "../mitum.config";

import { SIG_TYPE } from "../utils/config";
import { TimeStamp } from "../utils/time";

describe("test: seal", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
	const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
	const fact = new TransfersFact(
		new TimeStamp().UTC(),
		TEST_GENESIS.m1.address,
		[item]
	);

	it("case: m1; M1", () => {
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m1.private, null);

		const seal = new Seal([operation]);
		expect(() => seal.sign(TEST_NODE.m1)).not.toThrow(Error);
	});

	it("case: m1; M2", () => {
		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2;
		operation.sign(TEST_GENESIS.m1.private, null);

		expect(() => new Seal([operation])).toThrow(Error);
	});

	it("case: m2; M1", () => {
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m2.private, null);

		const seal = new Seal([operation]);
		expect(() => seal.sign(TEST_NODE.m2)).toThrow(Error);
	});

	it("case: m2; M2", () => {
		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2;
		operation.sign(TEST_GENESIS.m2.private, null);

		expect(() => new Seal([operation])).toThrow(Error);
	});

	it("case: m2; M2_NODE", () => {
		const operation = new Operation(fact, "");
		operation.sigType = SIG_TYPE.M2_NODE;
		operation.sign(TEST_NODE.m2, { node: "node0sas" });

		expect(() => new Seal([operation.dict()])).toThrow(Error);
	});

	it("case: m1; not-signed", () => {
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m1.private, null);

		const seal = new Seal([operation]);
		expect(() => seal.dict()).toThrow(Error);
	});

	it("case: duplicate facts", () => {
		const operation = new Operation(fact, "");
		operation.sign(TEST_GENESIS.m1.private, null);

		expect(() => new Seal([operation, operation])).toThrow(Error);
	});
});
