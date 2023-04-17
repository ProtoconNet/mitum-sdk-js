const bs58 = require("bs58");

const { Address } = require("./address.js");
const { isM2EtherKeySuffix, isMitumKeySuffix, parseKey } = require("./validation.js");

const {
	MAX_KEYS_IN_ADDRESS,
	MAX_THRESHOLD,
	MAX_WEIGHT,
	MIN_THRESHOLD,
	MIN_WEIGHT,
} = require("../mitum.config.js");
const { HINT_KEY, HINT_KEYS, SUFFIX_ACCOUNT_ADDRESS, SUFFIX_ETHER_ACCOUNT_ADDRESS } = require("../alias/key.js");

const { Hint } = require("../base/hint.js");
const { IBytes, IBytesDict } = require("../base/interface.js");
const {
	assert,
	error,
	EC_INVALID_KEYS,
	EC_INVALID_THRESHOLD,
	EC_INVALID_WEIGHT,
	EC_INVALID_KEY,
} = require("../base/error.js");

const { Big } = require("../utils/number.js");
const { keccak256, sum256 } = require("../utils/hash.js");
const { sortStringAsBuf } = require("../utils/string.js");

const KEY_TYPE = {
	btc: "key/btc",
	ether: "key/ether",
};

class Key extends IBytes {
	constructor(s) {
		super();
		const { key, suffix } = parseKey(s);
		this.key = key;
		this.suffix = suffix;

		if (isMitumKeySuffix(suffix)) {
			this.keyType = KEY_TYPE.btc;
		} else if (isM2EtherKeySuffix(suffix)) {
			this.keyType = KEY_TYPE.ether;
		} else {
			throw error.format(EC_INVALID_KEY, "invalid key");
		}
	}

	toString() {
		return this.key + this.suffix;
	}

	bytes() {
		return Buffer.from(this.toString());
	}
}

class PublicKey extends Key {
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
}

class Keys extends IBytesDict {
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
				key instanceof PublicKey,
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
	}

	get address() {
		return new Address(bs58.encode(sum256(this.bytes())) + SUFFIX_ACCOUNT_ADDRESS);
	}

	get etherAddress() {
		return new Address(keccak256(this.bytes()).subarray(12).toString('hex') + SUFFIX_ETHER_ACCOUNT_ADDRESS);
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
			hash: bs58.encode(sum256(this.bytes())),
			keys: this.keys.map((k) => k.dict()),
			threshold: this.threshold.v,
		};
	}
}

module.exports = {
	KEY_TYPE,
	Key,
	PublicKey,
	Keys,
};