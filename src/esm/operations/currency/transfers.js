import { CurrencyItem } from "./item.js";

import {
	HINT_TRANSFERS_ITEM_MUL_AMOUNTS,
	HINT_TRANSFERS_ITEM_SIN_AMOUNT,
	HINT_TRANSFERS_OPERATION,
	HINT_TRANSFERS_OPERATION_FACT,
} from "../../alias/currency.js";

import {
	assert,
	error,
	EC_INVALID_ITEM,
} from "../../base/error.js";

import { Address } from "../../key/address.js";

import { sortBuf } from "../../utils/string.js";
import { OperationFact } from "../fact.js";

export class TransfersItem extends CurrencyItem {
	constructor(receiver, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_TRANSFERS_ITEM_MUL_AMOUNTS
				: HINT_TRANSFERS_ITEM_SIN_AMOUNT,
			amounts
		);
		this.receiver = new Address(receiver);
	}

	bytes() {
		return Buffer.concat([
			this.receiver.bytes(),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			receiver: this.receiver.toString(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}

	toString() {
		return this.receiver.toString();
	}
}

export class TransfersFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_TRANSFERS_OPERATION_FACT, token, sender, items);

		items.forEach((item) =>
			assert(
				item instanceof TransfersItem,
				error.instance(EC_INVALID_ITEM, "not TransfersItem instance")
			)
		);
	}

	get opHint() {
		return HINT_TRANSFERS_OPERATION;
	}
}