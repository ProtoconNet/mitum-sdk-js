import bs58 from "bs58";

import { CurrencyItem } from "./item.js";

import { Fact } from "../fact.js";

import { MAX_ITEMS_IN_FACT } from "../../mitum.config.js";
import {
	HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_MUL_AMOUNTS,
	HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_SIN_AMOUNT,
	HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION,
	HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT,
} from "../../alias/currency-extension.js";

import {
	assert,
	error,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
	EC_INVALID_KEYS,
    EC_INVALID_FACT,
} from "../../base/error.js";

import { Keys } from "../../key/key.js";
import { Address } from "../../key/address.js";

import { sortBuf } from "../../utils/string.js";

export class CreateContractAccountsItem extends CurrencyItem {
	constructor(keys, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_MUL_AMOUNTS
				: HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_SIN_AMOUNT,
			amounts
		);

		assert(
			keys instanceof Keys,
			error.instance(EC_INVALID_KEYS, "not Keys instance")
		);

		this.keys = keys;
	}

	bytes() {
		return Buffer.concat([
			this.keys.bytes(),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			keys: this.keys.dict(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}
}

export class CreateContractAccountsFact extends Fact {
	constructor(token, sender, items) {
		super(HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT, token);
		this.sender = new Address(sender);

		assert(Array.isArray(items), error.type(EC_INVALID_ITEM, "not Array"));

		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			error.range(EC_INVALID_ITEMS, "array size out of range")
		);

		const iarr = items.map((item) => {
			assert(
				item instanceof CreateContractAccountsItem,
				error.instance(
					EC_INVALID_ITEM,
					"not CreateContractAccountsItem instance"
				)
			);

			return item.keys.address.toString();
		});
		const iset = new Set(iarr);
		assert(
			iarr.length === iset.size,
			error.duplicate(EC_INVALID_FACT, "duplicate account addresses in items")
		);

		this.items = items;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			Buffer.concat(this.items.sort(sortBuf).map((item) => item.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			items: this.items.sort(sortBuf).map((item) => item.dict()),
		};
	}

	get opHint() {
		return HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION;
	}
}
