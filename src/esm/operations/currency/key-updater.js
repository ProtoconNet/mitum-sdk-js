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

export class KeyUpdaterFact extends Fact {
	constructor(token, target, keys, currency, addressType) {
		super(HINT_KEY_UPDATER_OPERATION_FACT, token);
		this.target = new Address(target);

		assert(
			keys instanceof Keys,
			error.instance(EC_INVALID_KEYS, "not Keys instance")
		);

		assert(
			[ADDRESS_TYPE.ether, ADDRESS_TYPE.btc].includes(addressType) || !addressType,
			error.instance(EC_INVALID_ADDRESS_TYPE, "invalid address type"),
		)

		this.keys = keys;

		if (addressType === ADDRESS_TYPE.ether) {
			this.addressType = SUFFIX_ETHER_ACCOUNT_ADDRESS;
		} else if (addressType === ADDRESS_TYPE.btc) {
			this.addressType = SUFFIX_ACCOUNT_ADDRESS;
		} else{
			this.addressType = '';
		}

		this.currency = new CurrencyID(currency);
		this.hash = this.hashing();
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
		const fact = {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			target: this.target.toString(),
			keys: this.keys.dict(),
			currency: this.currency.toString(),
		};

		if (this.addressType) {
			fact.addrtype = this.addressType;
		}

		return fact;
	}

	get opHint() {
		return HINT_KEY_UPDATER_OPERATION;
	}
}