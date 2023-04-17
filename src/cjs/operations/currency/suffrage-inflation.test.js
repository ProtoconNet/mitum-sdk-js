const bs58 = require("bs58");

const { Amount } = require("./amount");

const {
	SuffrageInflationFact,
	SuffrageInflationItem,
} = require("./suffrage-inflation");
const { Operation } = require("../operation");

const { TEST_GENESIS, TEST_NODE } = require("../../mitum.config");
const { TimeStamp } = require("../../utils/time");

describe("test: suffrage-inflation", () => {
	it("case: m1; operation", () => {
		const items = [
			new SuffrageInflationItem(
				TEST_GENESIS.m1.address,
				new Amount("MCC", "9999999999999999999999")
			),
			new SuffrageInflationItem(
				TEST_GENESIS.m1.address,
				new Amount("PEN", "9999999999999999999999")
			),
		];

		const fact = new SuffrageInflationFact(
			"2022-11-16T06:55:02.135231Z",
			items
		);
		const operation = new Operation(fact);
		operation.sign(TEST_NODE.m1);

		expect(bs58.encode(fact.hash)).toBe(
			"FcP5ciHKkhogkskiYiaVCTP4JZ7zr4UH2cMRJqhhzEgV"
		);
	});

	// it("case: m2; operation", () => {});

	it("case: duplicate items", () => {
		const items = [
			new SuffrageInflationItem(
				TEST_GENESIS.m1.address,
				new Amount("MCC", "9999999999999999999999")
			),
			new SuffrageInflationItem(
				TEST_GENESIS.m1.address,
				new Amount("MCC", "9999999999999999999999")
			),
		];

		expect(
			() => new SuffrageInflationFact(new TimeStamp().UTC(), items)
		).toThrow(Error);
	});
});
