import bs58 from "bs58";
import secureRandom from "secure-random";
import * as secp256k1 from "@noble/secp256k1";

import { MIN_SEED_LENGTH } from "../mitum.config.js";

import { SUFFIX_KEY_PRIVATE } from "../alias/key.js";
import {
	assert,
	error,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_SEED,
} from "../base/error.js";

import { Key } from "./key.js";
import { K, KeyPair } from "./keypair.js";
import { isM2PrivateKey } from "./validation.js";

class M2KeyPair extends KeyPair {
	constructor(privateKey) {
		super(privateKey);
	}

	_generateSigner() {
		return Buffer.from(bs58.decode(this.privateKey.key));
	}
}

const random = () => {
	return new M2KeyPair(
		new Key(
			bs58.encode(Buffer.from(secureRandom(32, { type: "Uint8Array" }))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};

const fromPrivateKey = (privateKey) => {
	assert(
		typeof privateKey === "string",
		error.type(EC_INVALID_PRIVATE_KEY, "not string")
	);
	assert(
		isM2PrivateKey(privateKey),
		error.format(EC_INVALID_PRIVATE_KEY, "invalid length or key suffix")
	);

	return new M2KeyPair(new Key(privateKey));
};

const fromSeed = (seed) => {
	assert(typeof seed === "string", error.type(EC_INVALID_SEED, "not string"));
	assert(
		seed.length >= MIN_SEED_LENGTH,
		error.range(EC_INVALID_SEED, "seed length out of range")
	);

	return new M2KeyPair(
		new Key(
			bs58.encode(secp256k1.utils.hexToBytes(K(seed).toString(16))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};

export const m2 = {
	random,
	fromPrivateKey,
	fromSeed,
};
