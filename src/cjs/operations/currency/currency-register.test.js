const bs58 = require("bs58");

const { Amount } = require("./amount");
const {
	CurrencyDesign,
	CurrencyPolicy,
	FixedFeeer,
	NilFeeer,
	RatioFeeer,
} = require("./currency-design");
const { CurrencyRegisterFact } = require("./currency-register");

const { Operation } = require("../operation");

const { TEST_GENESIS, TEST_NODE } = require("../../mitum.config");

describe("test: currency-register", () => {
	it("case: m1; nil feeer", () => {
		const feeer = new NilFeeer();
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount("PEN", "99999999999999999999999");
		const design = new CurrencyDesign(
			amount,
			TEST_GENESIS.m1.address,
			policy
		);

		const fact = new CurrencyRegisterFact(
			"2022-11-24T02:17:37.256409Z",
			design
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m1, null);

		expect(bs58.encode(fact.hash)).toBe(
			"3AtsTvXxZ3BYczqAYZAqbV7y76UW4mCEipvV4jWH7B4h"
		);
	});

	it("case: m1; fixed feeer", () => {
		const feeer = new FixedFeeer(TEST_GENESIS.m1.address, "999");
		const policy = new CurrencyPolicy("33", feeer);

		const amount = new Amount("PEN", "99999999999999999999999");
		const design = new CurrencyDesign(
			amount,
			TEST_GENESIS.m1.address,
			policy
		);

		const fact = new CurrencyRegisterFact(
			"2022-11-16T06:35:43.649604Z",
			design
		);
		const operation = new Operation(fact, "");
		operation.sign(TEST_NODE.m1, null);

		expect(bs58.encode(fact.hash)).toBe(
			"6j3PN6oPof46vyoUjDxMnEr5JCdco2b5USapBYLLf1xh"
		);
	});

	it("case: m1; ratio feeer", () => {
		const ratio = (n, token) => {
			const feeer = new RatioFeeer(
				TEST_GENESIS.m1.address,
				n,
				"1",
				"99"
			);
			const policy = new CurrencyPolicy("33", feeer);

			const amount = new Amount("PEN", "99999999999999999999999");
			const design = new CurrencyDesign(
				amount,
				TEST_GENESIS.m1.address,
				policy
			);

			const fact = new CurrencyRegisterFact(token, design);
			const operation = new Operation(fact, "");
			operation.sign(TEST_NODE.m1, null);

			return bs58.encode(fact.hash);
		};

		const r0 = ratio(0, "2022-11-16T06:42:44.505842Z");
		const r1 = ratio(0.5, "2022-11-16T06:38:44.472Z");
		const r2 = ratio(1, "2022-11-16T06:44:19.856767Z");

		expect(r0).toBe("Dai6Wt9kqb8Mztt8uVspZZJYw3QsTmccxKQzqC5hPCCR");
		expect(r1).toBe("8RihHh7jYDcG8fMi1KHnVdm6YVHYiBKN3iVpvPoysPw2");
		expect(r2).toBe("DLsvsfkRGpHXrMXSyxYMGGmT48Jhhuro4bVNSojHJ7DB");
	});

	// it("case: m2; nil feeer", () => {});

	// it("case: m2; fixed feeer", () => {});

	// it("case: m2; ratio feeer", () => {});
});
