const { Seal } = require("./seal");
const { Operation } = require("./operation");

const { Amount } = require("./currency/amount");
const { TransfersFact, TransfersItem } = require("./currency/transfers");
const { TEST_ACCOUNT, TEST_GENESIS, TEST_NODE } = require("../mitum.config");

const { TimeStamp } = require("../utils/time");

describe("test: seal", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
	const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
	const fact = new TransfersFact(
		new TimeStamp().UTC(),
		TEST_GENESIS.m1.address,
		[item]
	);

	it("case: operation m1 - seal signed m1", () => {
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		const seal = new Seal([operation]);
		expect(() => seal.sign(TEST_NODE.m1)).not.toThrow(Error);
	});

	it("case: operation m2", () => {
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m2.private);

		expect(() => new Seal([operation])).toThrow(Error);
	});

	it("case: operation m2-node", () => {
		const operation = new Operation(fact);
		operation.sign(TEST_NODE.m2, { node: "node0sas" });

		expect(() => new Seal([operation])).toThrow(Error);
	});

	it("case: operation m1 - unsigned seal dict", () => {
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		const seal = new Seal([operation]);
		expect(() => seal.dict()).toThrow(Error);
	});

	it("case: duplicate m1 facts", () => {
		const operation = new Operation(fact);
		operation.sign(TEST_GENESIS.m1.private);

		expect(() => new Seal([operation, operation])).toThrow(Error);
	});
});
