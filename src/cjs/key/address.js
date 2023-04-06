const m1 = require("./m1-keypair.js");
const m2 = require("./m2-keypair.js");
const { isAddress, isNodeAddress } = require("./validation.js");
const Key = require("./key.js");

const { MAX_KEYS_IN_ADDRESS, MAX_THRESHOLD } = require("../mitum.config.js");

const { IBytes } = require("../base/interface.js");
const { assert, error, EC_INVALID_ADDRESS } = require("../base/error.js");

exports.Address = class Address extends IBytes {
	constructor(s) {
		super();
		assert(
			typeof s === "string",
			error.type(EC_INVALID_ADDRESS, "not string")
		);
		assert(
			isAddress(s) || isNodeAddress(s),
			error.format(EC_INVALID_ADDRESS, "invalid length or address suffix")
		);

		this.s = s;
	}

	bytes() {
		return Buffer.from(this.toString());
	}

	toString() {
		return this.s;
	}
}

const randomN = (n, f) => {
	if (typeof n !== "number") {
		return null;
	}

	if (n < 1 || n > MAX_KEYS_IN_ADDRESS) {
		return null;
	}

	let weight = Math.floor(MAX_THRESHOLD / n);
	if (MAX_THRESHOLD % n) {
		weight += 1;
	}

	const ks = [];
	const kps = [];
	for (let i = 0; i < n; i++) {
		kps.push(f());
		ks.push(new Key.PublicKey(kps[i].publicKey.toString(), weight));
	}

	return {
		keys: new Key.Keys(ks, MAX_THRESHOLD),
		keypairs: kps,
	};
};

exports.M1RandomN = (n) => {
	return randomN(n, m1.random);
};

exports.M2RandomN = (n) => {
	return randomN(n, m2.random);
};
