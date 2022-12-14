import bs58 from "bs58";
import bs58check from "bs58check";
import secureRandom from "secure-random";

import { Key } from "./key.js";
import { K, KeyPair } from "./keypair.js";

import { MIN_SEED_LENGTH } from "../mitum.config.js";

import { SUFFIX_KEY_PRIVATE } from "../alias/key.js";
import {
	assert,
	error,
	EC_INVALID_SEED,
	EC_INVALID_PRIVATE_KEY,
} from "../base/error.js";

import { sha256 } from "../utils/hash.js";

import { isM1PrivateKey } from "./validation.js";

class M1KeyPair extends KeyPair {
	constructor(privateKey) {
		super(privateKey);
	}

	_generateSigner() {
		let dk = bs58check.decode(this.privateKey.key);
		dk = Buffer.from(dk.subarray(1, dk.length - 1));
		return dk;
	}
}

const random = () => {
	return fromPrivateKey(
		encK(K(secureRandom(32, { type: "Uint8Array" }))) + SUFFIX_KEY_PRIVATE
	);
};

const fromPrivateKey = (privateKey) => {
	assert(
		typeof privateKey === "string",
		error.type(EC_INVALID_PRIVATE_KEY, "not string")
	);
	assert(
		isM1PrivateKey(privateKey),
		error.format(EC_INVALID_PRIVATE_KEY, "invalid length or key suffix")
	);
	return new M1KeyPair(new Key(privateKey));
};

const fromSeed = (seed) => {
	assert(typeof seed === "string", error.type(EC_INVALID_SEED, "not string"));
	assert(
		seed.length >= MIN_SEED_LENGTH,
		error.range(EC_INVALID_SEED, "seed length out of range")
	);

	return new M1KeyPair(new Key(encK(K(seed)) + SUFFIX_KEY_PRIVATE));
};

const encK = (k) => {
	const priv = Buffer.from("80" + Buffer.from(k.toString(16)) + "01", "hex");
	const hashedPriv = sha256(sha256(priv));
	const checksum = Buffer.from(hashedPriv.subarray(0, 4));

	return bs58.encode(Buffer.concat([priv, checksum]));
};

export const m1 = {
	random,
	fromPrivateKey,
	fromSeed,
};
