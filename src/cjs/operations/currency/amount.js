const { HINT_AMOUNT } = require("../../alias/currency.js");

const { Hint } = require("../../base/hint.js");
const { CurrencyID } = require("../../base/ID.js");
const { IBytesDict } = require("../../base/interface.js");
const { assert, error, EC_INVALID_AMOUNT } = require("../../base/error.js");

const { Big } = require("../../utils/number.js");

class Amount extends IBytesDict {
	constructor(currency, big) {
		super();
		this.hint = new Hint(HINT_AMOUNT);
		this.currency = new CurrencyID(currency);
		this.big = new Big(big);
		assert(this.big.big > 0, error.range(EC_INVALID_AMOUNT, "zero amount"));
	}

	bytes() {
		return Buffer.concat([this.big.bytes(), this.currency.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			currency: this.currency.toString(),
			amount: this.big.toString(),
		};
	}
}
exports.Amount = Amount