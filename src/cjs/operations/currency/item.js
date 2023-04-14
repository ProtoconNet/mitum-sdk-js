const { Amount } = require("./amount.js");

const { Item } = require("../item.js");

const { MAX_AMOUNTS_IN_ITEM } = require("../../mitum.config.js");
const {
	assert,
	error,
	EC_INVALID_AMOUNT,
	EC_INVALID_AMOUNTS,
	EC_INVALID_ITEM,
} = require("../../base/error.js");

exports.CurrencyItem = class CurrencyItem extends Item {
	constructor(hint, amounts) {
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
};