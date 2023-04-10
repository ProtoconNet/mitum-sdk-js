import bs58 from "bs58";
import * as secp256k1 from "@noble/secp256k1";
import { getPublicCompressed } from "eccrypto-js";

import { Key } from "./key.js";

import { SUFFIX_KEY_ETHER_PUBLIC, SUFFIX_KEY_PUBLIC } from "../alias/key.js";
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

		if (privateKey.keyType === "ether") {
			this.publicKey = new Key(
				'04' + this.signer.getPublicKeyString().substring(2) + SUFFIX_KEY_ETHER_PUBLIC
			);
		} else {
			this.publicKey = new Key(
				bs58.encode(getPublicCompressed(this.signer)) + SUFFIX_KEY_PUBLIC
			);
		}
	}

	sign(_) {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method sign(msg)"
		);
	}

	verify(_) {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method verify(msg)"
		);
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
