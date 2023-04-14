const bs58 = require("bs58");

const { CurrencyPolicy } = require("./currency-design.js");

const { NodeFact } = require("../fact.js");

const {
	HINT_CURRENCY_POLICY_UPDATER_OPERATION,
	HINT_CURRENCY_POLICY_UPDATER_OPERATION_FACT,
} = require("../../alias/currency.js");

const { assert, error, EC_INVALID_CURRENCY_POLICY } = require("../../base/error.js");
const { CurrencyID } = require("../../base/ID.js");

exports.CurrencyPolicyUpdaterFact = class CurrencyPolicyUpdaterFact extends NodeFact {
	constructor(token, currency, policy) {
		super(HINT_CURRENCY_POLICY_UPDATER_OPERATION_FACT, token);
		this.currency = new CurrencyID(currency);

		assert(
			policy instanceof CurrencyPolicy,
			error.instance(EC_INVALID_CURRENCY_POLICY, "not CurrencyPolicy")
		);
		this.policy = policy;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.currency.bytes(),
			this.policy.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			currency: this.currency.toString(),
			policy: this.policy.dict(),
		};
	}

	get opHint() {
		return HINT_CURRENCY_POLICY_UPDATER_OPERATION;
	}
};