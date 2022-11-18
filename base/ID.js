import {
	assert,
	error,
	EC_INVALID_CONTRACT_ID,
	EC_INVALID_CURRENCY_ID,
} from "./error.js";
import { IBytes } from "./interface.js";

import {
	MAX_CONTRACT_ID_LENGTH,
	MAX_CURRENCY_ID_LENGTH,
	MIN_CONTRACT_ID_LENGTH,
	MIN_CURRENCY_ID_LENGTH,
} from "../mitum.config.js";

export class ID extends IBytes {
	constructor(s, ec) {
		super();
		assert(
			typeof s === "string",
			error.type("not string", ec, typeof s)
		);
		this.s = s;
	}

	bytes() {
		return Buffer.from(this.s);
	}

	toString() {
		return this.s;
	}
}

export class CurrencyID extends ID {
	constructor(s) {
		super(s, EC_INVALID_CURRENCY_ID);
		assert(
			s.length >= MIN_CURRENCY_ID_LENGTH &&
				s.length <= MAX_CURRENCY_ID_LENGTH,
			error.range(
				"currency id length out of range",
				EC_INVALID_CURRENCY_ID,
				s.length
			)
		);
	}
}

export class ContractID extends ID {
	constructor(s) {
		super(s, EC_INVALID_CONTRACT_ID);
		assert(
			s.length >= MIN_CONTRACT_ID_LENGTH &&
				s.length <= MAX_CONTRACT_ID_LENGTH,
			error.range(
				"contract id length out of range",
				EC_INVALID_CONTRACT_ID,
				s.length
			)
		);
	}
}
