import { HINT_AMOUNT } from "../../alias/currency.js";

import { Hint } from "../../base/hint.js";
import { CurrencyID } from "../../base/ID.js";
import { IBytesDict } from "../../base/interface.js";
import { assert, error, EC_INVALID_AMOUNT } from "../../base/error.js";

import { Big } from "../../utils/number.js";

export class Amount extends IBytesDict {
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
