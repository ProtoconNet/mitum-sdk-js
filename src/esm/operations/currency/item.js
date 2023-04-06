import { Amount } from "./amount.js";

import { Item } from "../item.js";

import { MAX_AMOUNTS_IN_ITEM } from "../../mitum.config.js";
import {
	assert,
	error,
	EC_INVALID_AMOUNT,
	EC_INVALID_AMOUNTS,
	EC_INVALID_ITEM,
} from "../../base/error.js";

export class CurrencyItem extends Item {
	constructor(hint, amounts, addressType) {
		super(hint);

		assert(
			Array.isArray(amounts),
			error.type(EC_INVALID_ITEM, "not Array")
		);
		assert(
			amounts.length > 0 && amounts.length <= MAX_AMOUNTS_IN_ITEM,
			error.range(EC_INVALID_AMOUNTS, "array size out of range")
		);

		const carr = amounts.map((amount) => {
			assert(
				amount instanceof Amount,
				error.instance(EC_INVALID_AMOUNT, "not Amount instance")
			);

			return amount.currency.toString();
		});
		const cset = new Set(carr);

		assert(
			carr.length === cset.size,
			error.duplicate(
				EC_INVALID_ITEM,
				"duplicate amounts in currency item"
			)
		);

		this.amounts = amounts;
	}
}
