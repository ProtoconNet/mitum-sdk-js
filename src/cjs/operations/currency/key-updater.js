const bs58 = require("bs58");

const { Fact } = require("../fact.js");

const {
	HINT_KEY_UPDATER_OPERATION,
	HINT_KEY_UPDATER_OPERATION_FACT,
} = require("../../alias/currency.js");

const { assert, error, EC_INVALID_KEYS } = require("../../base/error.js");
const { CurrencyID } = require("../../base/ID.js");

const { Keys } = require("../../key/key.js");
const { Address } = require("../../key/address.js");

class KeyUpdaterFact extends Fact {
	constructor(token, target, keys, currency) {
		super(HINT_KEY_UPDATER_OPERATION_FACT, token);
		this.target = new Address(target);

		assert(
			keys instanceof Keys,
			error.instance(EC_INVALID_KEYS, "not Keys instance")
		);
		this.keys = keys;
		this.currency = new CurrencyID(currency);

		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.target.bytes(),
			this.keys.bytes(),
			this.currency.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			target: this.target.toString(),
			keys: this.keys.dict(),
			currency: this.currency.toString(),
		};
	}

	get opHint() {
		return HINT_KEY_UPDATER_OPERATION;
	}
}
exports.KeyUpdaterFact = KeyUpdaterFact