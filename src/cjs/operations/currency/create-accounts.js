const { CurrencyItem } = require("./item.js");
const { OperationFact } = require("../fact.js");

const {
	HINT_CREATE_ACCOUNTS_ITEM_MUL_AMOUNTS,
	HINT_CREATE_ACCOUNTS_ITEM_SIN_AMOUNT,
	HINT_CREATE_ACCOUNTS_OPERATION,
	HINT_CREATE_ACCOUNTS_OPERATION_FACT,
} = require("../../alias/currency.js");

const {
	assert,
	error,
	EC_INVALID_ITEM,
	EC_INVALID_KEYS,
} = require("../../base/error.js");

const { Keys } = require("../../key/key.js");
const { Address } = require("../../key/address.js");

const { sortBuf } = require("../../utils/string.js");

class CreateAccountsItem extends CurrencyItem {
	constructor(keys, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_CREATE_ACCOUNTS_ITEM_MUL_AMOUNTS
				: HINT_CREATE_ACCOUNTS_ITEM_SIN_AMOUNT,
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
exports.CreateAccountsItem = CreateAccountsItem;

class CreateAccountsFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_CREATE_ACCOUNTS_OPERATION_FACT, token, sender, items);
		this.sender = new Address(sender);

		items.forEach((item) =>
			assert(
				item instanceof CreateAccountsItem,
				error.instance(
					EC_INVALID_ITEM,
					"not CreateAccountsItem instance"
				)
			)
		);
	}

	get opHint() {
		return HINT_CREATE_ACCOUNTS_OPERATION;
	}
}
exports.CreateAccountsFact = CreateAccountsFact;