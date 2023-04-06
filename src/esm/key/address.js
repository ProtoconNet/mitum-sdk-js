import { m1 } from "./m1-keypair.js";
import { m2 } from "./m2-keypair.js";
import { isAddress, isNodeAddress } from "./validation.js";
import { Keys, PublicKey } from "./key.js";

import { MAX_KEYS_IN_ADDRESS, MAX_THRESHOLD } from "../mitum.config.js";

import { IBytes } from "../base/interface.js";
import { assert, error, EC_INVALID_ADDRESS } from "../base/error.js";

export class Address extends IBytes {
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
		ks.push(new PublicKey(kps[i].publicKey.toString(), weight));
	}

	return {
		keys: new Keys(ks, MAX_THRESHOLD),
		keypairs: kps,
	};
};

export const M1RandomN = (n) => {
	return randomN(n, m1.random);
};

export const M2RandomN = (n) => {
	return randomN(n, m2.random);
};
