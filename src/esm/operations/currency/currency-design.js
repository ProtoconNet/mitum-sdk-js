import { Amount } from "./amount.js";

import {
	HINT_CURRENCY_DESIGN,
	HINT_CURRENCY_FEEER_FIXED,
	HINT_CURRENCY_FEEER_NIL,
	HINT_CURRENCY_FEEER_RATIO,
	HINT_CURRENCY_POLICY,
} from "../../alias/currency.js";

import {
	assert,
	error,
	EC_INVALID_AMOUNT,
	EC_INVALID_CURRENCY_FEEER,
	EC_INVALID_CURRENCY_POLICY,
	EC_INVALID_RATIO,
} from "../../base/error.js";
import { Hint } from "../../base/hint.js";
import { IBytesDict } from "../../base/interface.js";

import { Address } from "../../key/address.js";
import { Big, Float } from "../../utils/number.js";

export class CurrencyDesign extends IBytesDict {
	constructor(amount, genesis, policy) {
		super();
		this.hint = new Hint(HINT_CURRENCY_DESIGN);
		assert(
			amount instanceof Amount,
			error.instance(EC_INVALID_AMOUNT, "not Amount instance")
		);
		this.amount = amount;

		assert(
			policy instanceof CurrencyPolicy,
			error.instance(
				EC_INVALID_CURRENCY_POLICY,
				"not CurrencyPolicy instance"
			)
		);
		this.policy = policy;

		this.genesis = new Address(genesis);
		this.aggregate = this.amount.big;
	}

	bytes() {
		return Buffer.concat([
			this.amount.bytes(),
			this.genesis.bytes(),
			this.policy.bytes(),
			this.aggregate.bytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			amount: this.amount.dict(),
			genesis_account: this.genesis.toString(),
			policy: this.policy.dict(),
			aggregate: this.aggregate.toString(),
		};
	}
}

export class CurrencyPolicy extends IBytesDict {
	constructor(newAccountMinBalance, feeer) {
		super();
		this.hint = new Hint(HINT_CURRENCY_POLICY);
		this.min = new Big(newAccountMinBalance);

		assert(
			feeer instanceof CurrencyFeeer,
			error.instance(
				EC_INVALID_CURRENCY_FEEER,
				"not CurrencyFeeer instance"
			)
		);
		this.feeer = feeer;
	}

	bytes() {
		return Buffer.concat([this.min.bytes(), this.feeer.bytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			new_account_min_balance: this.min.toString(),
			feeer: this.feeer.dict(),
		};
	}
}

class CurrencyFeeer extends IBytesDict {
	constructor(ht) {
		super();
		this.hint = new Hint(ht);
		this.exchangeMinAmount = null;
	}

	setExchangeMinAmount(n) {
		this.exchangeMinAmount = new Big(n);
	}
}

export class NilFeeer extends CurrencyFeeer {
	constructor() {
		super(HINT_CURRENCY_FEEER_NIL);
	}

	setExchangeMinAmount(_) {
		this.exchangeMinAmount = null;
	}

	bytes() {
		return Buffer.from([]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
		};
	}
}

export class FixedFeeer extends CurrencyFeeer {
	constructor(receiver, amount) {
		super(HINT_CURRENCY_FEEER_FIXED);
		this.receiver = new Address(receiver);
		this.amount = new Big(amount);
	}

	bytes() {
		const b = Buffer.concat([this.receiver.bytes(), this.amount.bytes()]);

		if (this.exchangeMinAmount) {
			return Buffer.concat([b, this.exchangeMinAmount.bytes()]);
		}

		return b;
	}

	dict() {
		const feeer = {
			_hint: this.hint.toString(),
			receiver: this.receiver.toString(),
			amount: this.amount.toString(),
		};

		if (this.exchangeMinAmount) {
			feeer["exchange_min_amount"] = this.exchangeMinAmount.toString();
		}

		return feeer;
	}
}

export class RatioFeeer extends CurrencyFeeer {
	constructor(receiver, ratio, min, max) {
		super(HINT_CURRENCY_FEEER_RATIO);

		this.ratio = new Float(ratio);
		assert(
			0 <= ratio && ratio <= 1,
			error.range(EC_INVALID_RATIO, "ratio out of range")
		);

		this.receiver = new Address(receiver);
		this.min = new Big(min);
		this.max = new Big(max);
	}

	bytes() {
		const b = Buffer.concat([
			this.receiver.bytes(),
			this.ratio.bytes(),
			this.min.bytes(),
			this.max.bytes(),
		]);

		if (this.exchangeMinAmount) {
			return Buffer.concat([b, this.exchangeMinAmount.bytes()]);
		}

		return b;
	}

	dict() {
		const feeer = {
			_hint: this.hint.toString(),
			receiver: this.receiver.toString(),
			ratio: this.ratio.n,
			min: this.min.toString(),
			max: this.max.toString(),
		};

		if (this.exchangeMinAmount) {
			feeer["exchange_min_amount"] = this.exchangeMinAmount.toString();
		}

		return feeer;
	}
}
