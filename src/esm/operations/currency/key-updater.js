import bs58 from "bs58";

import { Fact } from "../fact.js";

import {
	HINT_KEY_UPDATER_OPERATION,
	HINT_KEY_UPDATER_OPERATION_FACT,
} from "../../alias/currency.js";

import { assert, error, EC_INVALID_KEYS } from "../../base/error.js";
import { CurrencyID } from "../../base/ID.js";

import { Keys } from "../../key/key.js";
import { Address } from "../../key/address.js";

export class KeyUpdaterFact extends Fact {
	constructor(token, target, keys, currency) {
		super(HINT_KEY_UPDATER_OPERATION_FACT, token);
		this.target = new Address(target);

		assert(
			keys instanceof Keys,
			error.instance(EC_INVALID_KEYS, "not Keys instance")
		);
		this.keys = keys;
		this.currency = new CurrencyID(currency);

		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.target.bytes(),
			this.keys.bytes(),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			target: this.target.toString(),
			keys: this.keys.dict(),
			currency: this.currency.toString(),
		};
	}

	get opHint() {
		return HINT_KEY_UPDATER_OPERATION;
	}
}
