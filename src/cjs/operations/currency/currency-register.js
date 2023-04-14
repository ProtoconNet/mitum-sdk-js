const bs58 = require("bs58");

const { CurrencyDesign } = require("./currency-design.js");
const { NodeFact } = require("../fact.js");

const {
	HINT_CURRENCY_REGISTER_OPERATION,
	HINT_CURRENCY_REGISTER_OPERATION_FACT,
} = require("../../alias/currency.js");

const { assert, error, EC_INVALID_CURRENCY_DESIGN } = require("../../base/error.js");

exports.CurrencyRegisterFact = class CurrencyRegisterFact extends NodeFact {
	constructor(token, design) {
		super(HINT_CURRENCY_REGISTER_OPERATION_FACT, token);
		assert(
			design instanceof CurrencyDesign,
			error.instance(
				EC_INVALID_CURRENCY_DESIGN,
				"not CurrencyDesign instance"
			)
		);
		this.design = design;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([this.token.bytes(), this.design.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			currency: this.design.dict(),
		};
	}

	get opHint() {
		return HINT_CURRENCY_REGISTER_OPERATION;
	}
};
