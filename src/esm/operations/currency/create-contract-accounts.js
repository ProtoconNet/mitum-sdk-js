import { CurrencyItem } from "./item.js";
import { OperationFact } from "../fact.js";

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
	EC_INVALID_KEYS,
} from "../../base/error.js";

import { Keys } from "../../key/key.js";

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

	toString() {
		return this.keys.address.toString();
	}
}

export class CreateContractAccountsFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT, token, sender, items);

		items.forEach((item) =>
			assert(
				item instanceof CreateContractAccountsItem,
				error.instance(
					EC_INVALID_ITEM,
					"not CreateContractAccountsItem instance"
				)
			)
		);
	}

	get opHint() {
		return HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION;
	}
}