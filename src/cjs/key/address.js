const { isAddress, isNodeAddress, isZeroAddress } = require("./validation.js");

const { SUFFIX_ZERO_ADDRESS_LENGTH } = require("../mitum.config.js");

const { IBytes } = require("../base/interface.js");
const { CurrencyID } = require("../base/ID.js");
const { assert, error, EC_INVALID_ADDRESS } = require("../base/error.js");

const ADDRESS_TYPE = {
	btc: "address/btc",
	ether: "address/ether",
};

class BaseAddress extends IBytes {
	constructor(s) {
		super();
		assert(
			typeof s === "string",
			error.type(EC_INVALID_ADDRESS, "not string")
		);
		assert(
			isAddress(s) || isNodeAddress(s) || isZeroAddress(s),
			error.format(EC_INVALID_ADDRESS, "invalid length or address suffix")
		);

		this.s = s;
	}

	bytes() {
		return Buffer.from(this.toString());
	}

	toString() {
		return this.s;
	}
}

class Address extends BaseAddress {
	constructor(s) {
		super(s);
		assert(
			isAddress(s) || isNodeAddress(s),
			error.format(EC_INVALID_ADDRESS, "invalid length or address suffix")
		);
	}
}

class ZeroAddress extends BaseAddress {
	constructor(s) {
		super(s);

		assert(isZeroAddress(s), error.format(EC_INVALID_ADDRESS, "not zero address"));
		
		this.currency = new CurrencyID(this.s.substring(0, this.s.length - SUFFIX_ZERO_ADDRESS_LENGTH));s
	}
}

module.exports = {
	ADDRESS_TYPE,
	Address,
	ZeroAddress,
};