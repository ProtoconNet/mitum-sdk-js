import bs58 from "bs58";

import { Fact } from "../fact.js";

import { SUFFIX_ACCOUNT_ADDRESS, SUFFIX_ETHER_ACCOUNT_ADDRESS } from "../../alias/key.js";
import {
	HINT_KEY_UPDATER_OPERATION,
	HINT_KEY_UPDATER_OPERATION_FACT,
} from "../../alias/currency.js";

import { assert, error, EC_INVALID_KEYS, EC_INVALID_ADDRESS_TYPE } from "../../base/error.js";
import { CurrencyID } from "../../base/ID.js";

import { Keys } from "../../key/key.js";
import { Address, ADDRESS_TYPE } from "../../key/address.js";

class KeyUpdaterFact extends Fact {
	constructor(token, target, keys, currency) {
		super(HINT_KEY_UPDATER_OPERATION_FACT, token);
		this.target = new Address(target);

		assert(
			keys instanceof Keys,
			error.instance(EC_INVALID_KEYS, "not Keys instance")
		);
		this.keys = keys;
		this.currency = new CurrencyID(currency);
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

export class M1KeyUpdaterFact extends KeyUpdaterFact {
	constructor(token, target, keys, currency) {
		super(token, target, keys, currency);
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
}

export class M2KeyUpdaterFact extends KeyUpdaterFact {
	constructor(token, target, keys, currency, addressType) {
		super(token, target, keys, currency);

		if (!addressType) {
			addressType = ADDRESS_TYPE.btc;
		}

		assert(
			addressType === ADDRESS_TYPE.ether || addressType === ADDRESS_TYPE.btc,
			error.format(EC_INVALID_ADDRESS_TYPE, "invalid address type"),
		)

		switch(addressType) {
			case ADDRESS_TYPE.ether:
				this.addressType = SUFFIX_ETHER_ACCOUNT_ADDRESS;
				break
			case ADDRESS_TYPE.btc:
			default:
				this.addressType = SUFFIX_ACCOUNT_ADDRESS;
		}

		this.hash = this.hashing()
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.target.bytes(),
			this.keys.bytes(),
			Buffer.from(this.addressType),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			...super.dict(),
			addrtype: this.addressType,
		};
	}
}