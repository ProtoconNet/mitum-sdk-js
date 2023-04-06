const bs58 = require("bs58");
const secureRandom = require("secure-random");
const secp256k1 = require("@noble/secp256k1");

const { MIN_SEED_LENGTH } = require("../mitum.config.js");

const { SUFFIX_KEY_PRIVATE } = require("../alias/key.js");
const {
	assert,
	error,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_SEED,
} = require("../base/error.js");

const Key = require("./key.js");
const { K, KeyPair } = require("./keypair.js");
const { isM2PrivateKey } = require("./validation.js");

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
		new Key.Key(
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

	return new M2KeyPair(new Key.Key(privateKey));
};

const fromSeed = (seed) => {
	assert(typeof seed === "string", error.type(EC_INVALID_SEED, "not string"));
	assert(
		seed.length >= MIN_SEED_LENGTH,
		error.range(EC_INVALID_SEED, "seed length out of range")
	);

	return new M2KeyPair(
		new Key.Key(
			bs58.encode(secp256k1.utils.hexToBytes(K(seed).toString(16))) +
				SUFFIX_KEY_PRIVATE
		)
	);
};

module.exports = {
	random,
	fromPrivateKey,
	fromSeed,
}
