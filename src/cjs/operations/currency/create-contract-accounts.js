const bs58 = require("bs58");

const { CurrencyItem } = require("./item.js");
const { OperationFact } = require("../fact.js");

const { SUFFIX_ACCOUNT_ADDRESS, SUFFIX_ETHER_ACCOUNT_ADDRESS } = require("../../alias/key.js");
const {
	HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_MUL_AMOUNTS,
	HINT_CREATE_CONTRACT_ACCOUNTS_ITEM_SIN_AMOUNT,
	HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION,
	HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT,
} = require("../../alias/currency-extension.js");

const {
	assert,
	error,
	EC_INVALID_ITEM,
	EC_INVALID_KEYS,
	EC_INVALID_ADDRESS_TYPE,
	EC_INVALID_ITEMS,
} = require("../../base/error.js");

const { Keys } = require("../../key/key.js");
const { ADDRESS_TYPE } = require("../../key/address.js");

const { sortBuf } = require("../../utils/string.js");

class CreateContractAccountsItem extends CurrencyItem {
	constructor(keys, amounts, addressType) {
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
	}

	bytes() {
		return Buffer.concat([
			this.keys.bytes(),
			Buffer.from(this.addressType),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}

	dict() {
		const item = {
			_hint: this.hint.toString(),
			keys: this.keys.dict(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};

		if (this.addressType) {
			item.addrtype = this.addressType;
		}

		return item;
	}

	toString() {
		return bs58.encode(this.keys.bytes());
	}
}

class CreateContractAccountsFact extends OperationFact {
	constructor(token, sender, items) {
		super(HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION_FACT, token, sender, items);

		const ats = new Set(items.map((item) => {
			assert(
				item instanceof CreateContractAccountsItem,
				error.instance(
					EC_INVALID_ITEM,
					"not CreateContractAccountsItem instance"
				)
			);

			return item.addressType !== '';
		}));

		assert(
			ats.size === 1,
			error.runtime(
				EC_INVALID_ITEMS,
				"not unified mitum versions of items"
			)
		);

		this.isMitum1 = items[0].addressType === '';
	}

	get opHint() {
		return HINT_CREATE_CONTRACT_ACCOUNTS_OPERATION;
	}
}

module.exports = {
	CreateContractAccountsItem,
	CreateContractAccountsFact,
};