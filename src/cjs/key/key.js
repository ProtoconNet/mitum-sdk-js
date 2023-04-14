const bs58 = require("bs58");

const addrJ = require("./address.js");
const { parseKey } = require("./validation.js");

const {
	MAX_KEYS_IN_ADDRESS,
	MAX_THRESHOLD,
	MAX_WEIGHT,
	MIN_THRESHOLD,
	MIN_WEIGHT,
} = require("../mitum.config.js");
const { HINT_KEY, HINT_KEYS, SUFFIX_ACCOUNT_ADDRESS } = require("../alias/key.js");

const { Hint } = require("../base/hint.js");
const { IBytes, IBytesDict } = require("../base/interface.js");
const {
	assert,
	error,
	EC_INVALID_KEYS,
	EC_INVALID_THRESHOLD,
	EC_INVALID_WEIGHT,
} = require("../base/error.js");

const { Big } = require("../utils/number.js");
const { sum256 } = require("../utils/hash.js");
const { sortStringAsBuf } = require("../utils/string.js");

exports.Key = class Key extends IBytes {
	constructor(s) {
		super();
		const { key, suffix } = parseKey(s);
		this.key = key;
		this.suffix = suffix;
	}

	toString() {
		return this.key + this.suffix;
	}

	bytes() {
		return Buffer.from(this.toString());
	}
};

exports.PublicKey = class PublicKey extends exports.Key {
	constructor(s, weight) {
		super(s);
		assert(
			typeof weight === "number",
			error.type(EC_INVALID_WEIGHT, "not number")
		);
		assert(
			weight >= MIN_WEIGHT && weight <= MAX_WEIGHT,
			error.range(EC_INVALID_WEIGHT, "weight out of range")
		);
		this.hint = new Hint(HINT_KEY);
		this.weight = new Big(weight);
	}

	bytes() {
		return Buffer.concat([super.bytes(), this.weight.fillBytes()]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			weight: this.weight.v,
			key: this.toString(),
		};
	}
};

exports.Keys = class Keys extends IBytesDict {
	constructor(keys, threshold) {
		super();
		assert(
			typeof threshold === "number",
			error.type(EC_INVALID_THRESHOLD, "not number")
		);
		assert(
			threshold >= MIN_THRESHOLD && threshold <= MAX_THRESHOLD,
			error.range(EC_INVALID_THRESHOLD, "threshold out of range")
		);
		assert(Array.isArray(keys), error.type(EC_INVALID_KEYS, "not Array"));
		assert(
			keys.length > 0 && keys.length <= MAX_KEYS_IN_ADDRESS,
			error.range(EC_INVALID_KEYS, "array size out of range")
		);

		const karr = keys.map((key) => {
			assert(
				key instanceof exports.PublicKey,
				error.instance(EC_INVALID_KEYS, "not PublicKey instance")
			);

			return key.toString();
		});
		const kset = new Set(karr);
		assert(
			karr.length === kset.size,
			error.duplicate(EC_INVALID_KEYS, "duplicate public keys in keys")
		);

		const sum = keys.reduce((s, k) => s + k.weight.big, BigInt(0));
		assert(
			sum >= threshold,
			error.range(EC_INVALID_THRESHOLD, "threshold < sum(weights)")
		);

		this.hint = new Hint(HINT_KEYS);
		this.keys = keys;
		this.threshold = new Big(threshold);
		this.hash = sum256(this.bytes());
	}

	get address() {
		return new addrJ.Address(bs58.encode(this.hash) + SUFFIX_ACCOUNT_ADDRESS);
	}

	bytes() {
		return Buffer.concat([
			Buffer.concat(
				this.keys.sort(sortStringAsBuf).map((k) => k.bytes())
			),
			this.threshold.fillBytes(),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			keys: this.keys.map((k) => k.dict()),
			threshold: this.threshold.v,
		};
	}
};
