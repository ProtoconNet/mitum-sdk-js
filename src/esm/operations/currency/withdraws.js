import { CurrencyItem } from "./item.js";
import { OperationFact } from "../fact.js";

import {
	HINT_WITHDRAWS_ITEM_MUL_AMOUNTS,
	HINT_WITHDRAWS_ITEM_SIN_AMOUNT,
	HINT_WITHDRAWS_OPERATION,
	HINT_WITHDRAWS_OPERATION_FACT,
} from "../../alias/currency-extension.js";

import {
	assert,
	error,
	EC_INVALID_ITEM,
} from "../../base/error.js";

import { Address } from "../../key/address.js";

import { sortBuf } from "../../utils/string.js";

export class WithdrawsItem extends CurrencyItem {
	constructor(target, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_WITHDRAWS_ITEM_MUL_AMOUNTS
				: HINT_WITHDRAWS_ITEM_SIN_AMOUNT,
			amounts
		);
		this.target = new Address(target);
	}

	bytes() {
		return Buffer.concat([
			this.target.bytes(),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			target: this.target.toString(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}

	toString() {
		return this.target.toString();
	}
}

export class WithdrawsFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_WITHDRAWS_OPERATION_FACT, token, sender, items);

		items.forEach((item) =>
			assert(
				item instanceof WithdrawsItem,
				error.instance(EC_INVALID_ITEM, "not WithdrawsItem instance")
			)
		);
	}

	get opHint() {
		return HINT_WITHDRAWS_OPERATION;
	}
}
