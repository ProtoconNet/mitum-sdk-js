import bs58 from "bs58";

import { Address } from "./address.js";
import { isM2EtherKeySuffix, isMitumKeySuffix, parseKey } from "./validation.js";

import {
	MAX_KEYS_IN_ADDRESS,
	MAX_THRESHOLD,
	MAX_WEIGHT,
	MIN_THRESHOLD,
	MIN_WEIGHT,
} from "../mitum.config.js";
import { HINT_KEY, HINT_KEYS, SUFFIX_ACCOUNT_ADDRESS, SUFFIX_ETHER_ACCOUNT_ADDRESS } from "../alias/key.js";

import { Hint } from "../base/hint.js";
import { IBytes, IBytesDict } from "../base/interface.js";
import {
	assert,
	error,
	EC_INVALID_KEYS,
	EC_INVALID_THRESHOLD,
	EC_INVALID_WEIGHT,
	EC_INVALID_KEY,
} from "../base/error.js";

import { Big } from "../utils/number.js";
import { keccak256, sum256 } from "../utils/hash.js";
import { sortStringAsBuf } from "../utils/string.js";

const TYPE_MITUM = "btc";
const TYPE_ETHER = "ether";

export class Key extends IBytes {
	constructor(s) {
		super();
		const { key, suffix } = parseKey(s);
		this.key = key;
		this.suffix = suffix;
		this.keyType = null;

		if (isMitumKeySuffix(suffix)) {
			this.keyType = TYPE_MITUM;
		} else if (isM2EtherKeySuffix(suffix)) {
			this.keyType = TYPE_ETHER;
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

export class PublicKey extends Key {
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

export class Keys extends IBytesDict {
	constructor(keys, threshold, addressType) {
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
		this.addressType = addressType;
	}

	get address() {
		if (this.addressType === TYPE_ETHER) {
			return new Address(keccak256(this.bytes()).subarray(12).toString('hex') + SUFFIX_ETHER_ACCOUNT_ADDRESS);
		}

		return new Address(bs58.encode(sum256(this.bytes())) + SUFFIX_ACCOUNT_ADDRESS);
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
		let hash = null;

		if (this.addressType === TYPE_ETHER) {
			hash = keccak256(this.bytes()).toString('hex');
		} else {
			hash = bs58.encode(sum256(this.bytes()));
		}

		return {
			_hint: this.hint.toString(),
			hash,
			keys: this.keys.map((k) => k.dict()),
			threshold: this.threshold.v,
		};
	}
}
