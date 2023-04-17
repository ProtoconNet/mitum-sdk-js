import { isAddress, isNodeAddress, isZeroAddress } from "./validation.js";

import { SUFFIX_ZERO_ADDRESS_LENGTH } from "../mitum.config.js";

import { IBytes } from "../base/interface.js";
import { CurrencyID } from "../base/ID.js";
import { assert, error, EC_INVALID_ADDRESS } from "../base/error.js";

export const ADDRESS_TYPE = {
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

export class Address extends BaseAddress {
	constructor(s) {
		super(s);
		assert(
			isAddress(s) || isNodeAddress(s),
			error.format(EC_INVALID_ADDRESS, "invalid length or address suffix")
		);
	}
}

export class ZeroAddress extends BaseAddress {
	constructor(s) {
		super(s);

		assert(isZeroAddress(s), error.format(EC_INVALID_ADDRESS, "not zero address"));
		
		this.currency = new CurrencyID(this.s.substring(0, this.s.length - SUFFIX_ZERO_ADDRESS_LENGTH));s
	}
}