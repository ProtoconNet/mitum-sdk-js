const bs58 = require("bs58");

const { Amount } = require("../../common/amount/amount.js");
const { NodeFact } = require("../fact.js");

const { MAX_ITEMS_IN_FACT } = require("../../mitum.config.js");
const {
	HINT_SUFFRAGE_INFLATION_OPERATION,
	HINT_SUFFRAGE_INFLATION_OPERATION_FACT,
	HINT_SUFFRAGE_INFLATION_ITEM,
} = require("../../alias/currency.js");

const {
	assert,
	error,
	EC_INVALID_AMOUNT,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
	EC_INVALID_FACT,
} = require("../../base/error.js");
const { Item } = require("../item.js");

const { Address } = require("../../common/key/address.js");
const { sortBuf } = require("../../utils/string.js");

class SuffrageInflationItem extends Item {
	constructor(receiver, amount) {
		super(HINT_SUFFRAGE_INFLATION_ITEM);
		assert(
			amount instanceof Amount,
			error.instance(EC_INVALID_AMOUNT, "not Amount instance")
		);
		this.amount = amount;
		this.receiver = new Address(receiver);
	}

	bytes() {
		return Buffer.concat([this.receiver.bytes(), this.amount.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			receiver: this.receiver.toString(),
			amount: this.amount.dict(),
		};
	}
}

class SuffrageInflationFact extends NodeFact {
	constructor(token, items) {
		super(HINT_SUFFRAGE_INFLATION_OPERATION_FACT, token);

		assert(Array.isArray(items), error.type(EC_INVALID_ITEM, "not Array"));

		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			error.range(EC_INVALID_ITEMS, "array size out of range")
		);

		const iarr = items.map((item) => {
			assert(
				item instanceof SuffrageInflationItem,
				error.instance(
					EC_INVALID_ITEM,
					"not SuffrageInflationItem instance"
				)
			);

			return (
				item.receiver.toString() + "-" + item.amount.currency.toString()
			);
		});
		const iset = new Set(iarr);
		assert(
			iarr.length === iset.size,
			error.duplicate(
				EC_INVALID_FACT,
				"duplicate receiver-currency in items"
			)
		);

		this.items = items;

		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			Buffer.concat(this.items.sort(sortBuf).map((item) => item.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			items: this.items.sort(sortBuf).map((item) => item.dict()),
		};
	}

	get opHint() {
		return HINT_SUFFRAGE_INFLATION_OPERATION;
	}
}

module.exports = {
	SuffrageInflationItem,
	SuffrageInflationFact,
};