const { Amount } = require("./amount");
const { CurrencyItem } = require("./item");

describe("test: currency item", () => {
	it("case: duplicate amounts", () => {
		const am1 = new Amount("MCC", "1");
		const am2 = new Amount("MCC", "10");
		const am3 = new Amount("PEN", "1000");

		expect(() => new CurrencyItem("test hint", [am1, am2, am3])).toThrow(
			Error
		);
	});
});
