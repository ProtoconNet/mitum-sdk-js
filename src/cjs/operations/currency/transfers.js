const { CurrencyItem } = require("./item.js");
const { OperationFact } = require("../fact.js");

const {
	HINT_TRANSFERS_ITEM_MUL_AMOUNTS,
	HINT_TRANSFERS_ITEM_SIN_AMOUNT,
	HINT_TRANSFERS_OPERATION,
	HINT_TRANSFERS_OPERATION_FACT,
} = require("../../alias/currency.js");

const {
	assert,
	error,
	EC_INVALID_ITEM,
	EC_INVALID_AMOUNT,
} = require("../../base/error.js");

const { Address, ZeroAddress } = require("../../key/address.js");
const { isZeroAddress } = require("../../key/validation.js");

const { sortBuf } = require("../../utils/string.js");

class TransfersItem extends CurrencyItem {
	constructor(receiver, amounts) {
		super(
			Array.isArray(amounts) && amounts.length > 1
				? HINT_TRANSFERS_ITEM_MUL_AMOUNTS
				: HINT_TRANSFERS_ITEM_SIN_AMOUNT,
			amounts
		);

		if (isZeroAddress(receiver)) {
			this.receiver = new ZeroAddress(receiver);
			amounts.forEach(am =>
				assert(am.currency.equal(this.receiver.currency),
					error.runtime(EC_INVALID_AMOUNT, "invalid amount currency for giventzero address"))
			);
		} else {
			this.receiver = new Address(receiver);
		}
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

class TransfersFact extends OperationFact {
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

module.exports = {
	TransfersItem,
	TransfersFact,
};