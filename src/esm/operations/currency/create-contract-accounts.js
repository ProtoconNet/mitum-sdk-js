import bs58 from "bs58";

import { CurrencyItem } from "./item.js";
import { OperationFact } from "../fact.js";

import { SUFFIX_ACCOUNT_ADDRESS, SUFFIX_ETHER_ACCOUNT_ADDRESS } from "../../alias/key.js";
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
	EC_INVALID_ADDRESS_TYPE,
} from "../../base/error.js";

import { Keys } from "../../key/key.js";
import { ADDRESS_TYPE } from "../../key/address.js";

import { sortBuf } from "../../utils/string.js";

class CreateContractAccountsItem extends CurrencyItem {
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

	dict() {
		return {
			_hint: this.hint.toString(),
			keys: this.keys.dict(),
			amounts: this.amounts.sort(sortBuf).map((amount) => amount.dict()),
		};
	}

	toString() {
		return bs58.encode(this.keys.bytes());
	}
}

export class M1CreateContractAccountsItem extends CreateContractAccountsItem {
	constructor(keys, amounts) {
		super(keys, amounts);
	}

	bytes() {
		return Buffer.concat([
			this.keys.bytes(),
			Buffer.concat(this.amounts.sort(sortBuf).map((amt) => amt.bytes())),
		]);
	}
}

export class M2CreateContractAccountsItem extends CreateContractAccountsItem {
	constructor(keys, amounts, addressType) {
		super(keys, amounts);

		if (!addressType) {
			addressType = ADDRESS_TYPE.btc;
		}

		assert(
			addressType === ADDRESS_TYPE.ether || addressType === ADDRESS_TYPE.btc,
			error.format(EC_INVALID_ADDRESS_TYPE, "invalid address type"),
		)

		switch(addressType) {
			case ADDRESS_TYPE.ether:
				this.addressType = SUFFIX_ETHER_ACCOUNT_ADDRESS;
				break
			case ADDRESS_TYPE.btc:
			default:
				this.addressType = SUFFIX_ACCOUNT_ADDRESS;
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
		return {
			...super.dict(),
			addrtype: this.addressType,
		};
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
