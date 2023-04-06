import bs58 from "bs58";

import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import * as secp256k1 from "@noble/secp256k1";

import { getPublicCompressed } from "eccrypto-js";

import { Key } from "./key.js";

import { SUFFIX_KEY_PUBLIC } from "../alias/key.js";
import {
	assert,
	error,
	EC_INVALID_KEY_PAIR,
	EC_NOT_IMPLEMENTED_METHOD,
	EC_INVALID_SEED,
} from "../base/error.js";

import { Big } from "../utils/number.js";
import { sum256 } from "../utils/hash.js";

export class KeyPair {
	constructor(privateKey) {
		assert(
			privateKey instanceof Key,
			error.instance(EC_INVALID_KEY_PAIR, "not Key instance")
		);

		this.privateKey = privateKey;
		this.signer = this._generateSigner();
		this.publicKey = new Key(
			bs58.encode(getPublicCompressed(this.signer)) + SUFFIX_KEY_PUBLIC
		);
	}

	sign(msg) {
		secp256k1.utils.hmacSha256Sync = (key, ...msgs) =>
			hmac(sha256, key, secp256k1.utils.concatBytes(...msgs));
		secp256k1.utils.sha256Sync = (...msgs) =>
			sha256(secp256k1.utils.concatBytes(...msgs));
		return secp256k1.signSync(sha256(sha256(msg)), this.signer);
	}

	_generateSigner() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method _generateSigner()"
		);
	}
}

export const K = (seed) => {
	seed = Buffer.from(bs58.encode(sum256(Buffer.from(seed))));
	
	assert(seed.length >= 40, error.format(EC_INVALID_SEED, "invalid length"))
	
	seed = seed.subarray(0, 40);

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = new Big(seed).big;
	k %= N;
	k += BigInt(1);

	return k;
};
