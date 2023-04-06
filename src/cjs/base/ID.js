const {
	assert,
	error,
	EC_INVALID_CONTRACT_ID,
	EC_INVALID_CURRENCY_ID,
} = require("./error.js");
const { IBytes } = require("./interface.js");

const {
	MAX_CONTRACT_ID_LENGTH,
	MAX_CURRENCY_ID_LENGTH,
	MIN_CONTRACT_ID_LENGTH,
	MIN_CURRENCY_ID_LENGTH,
} = require("../mitum.config.js");

class ID extends IBytes {
	constructor(s, ec) {
		super();
		assert(typeof s === "string", error.type(ec, "not string"));
		this.s = s;
	}

	bytes() {
		return Buffer.from(this.s);
	}

	toString() {
		return this.s;
	}
}

exports.ID = ID
class CurrencyID extends ID {
	constructor(s) {
		super(s, EC_INVALID_CURRENCY_ID);
		assert(
			s.length >= MIN_CURRENCY_ID_LENGTH &&
				s.length <= MAX_CURRENCY_ID_LENGTH,
			error.range(
				EC_INVALID_CURRENCY_ID,
				"currency id length out of range"
			)
		);
	}
}
exports.CurrencyID = CurrencyID

class ContractID extends ID {
	constructor(s) {
		super(s, EC_INVALID_CONTRACT_ID);
		assert(
			s.length >= MIN_CONTRACT_ID_LENGTH &&
				s.length <= MAX_CONTRACT_ID_LENGTH,
			error.range(
				EC_INVALID_CONTRACT_ID,
				"contract id length out of range"
			)
		);
	}
}
exports.ContractID = ContractID
