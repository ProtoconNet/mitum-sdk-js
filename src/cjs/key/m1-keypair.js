const bs58 = require("bs58");
const bs58check = require("bs58check");
const secureRandom = require("secure-random");

const { hmac } = require("@noble/hashes/hmac");
const nobleSha256 = require("@noble/hashes/sha256").sha256;
const secp256k1 = require("@noble/secp256k1");

const { Key } = require("./key.js");
const { K, KeyPair } = require("./keypair.js");

const { MIN_SEED_LENGTH } = require("../mitum.config.js");

const { SUFFIX_KEY_PRIVATE } = require("../alias/key.js");
const {
	assert,
	error,
	EC_INVALID_SEED,
	EC_INVALID_PRIVATE_KEY,
} = require("../base/error.js");

const { sha256 } = require("../utils/hash.js");

const { isM1PrivateKey } = require("./validation.js");

class M1KeyPair extends KeyPair {
	constructor(privateKey) {
		super(privateKey);
	}

	sign(msg) {
		secp256k1.utils.hmacSha256Sync = (key, ...msgs) =>
			hmac(nobleSha256, key, secp256k1.utils.concatBytes(...msgs));
		secp256k1.utils.sha256Sync = (...msgs) =>
			nobleSha256(secp256k1.utils.concatBytes(...msgs));
		return secp256k1.signSync(sha256(sha256(msg)), this.signer);
	}

	verify(sig, msg) {
		if (typeof sig === "string") {
            sig = bs58.decode(sig);
        }

		return secp256k1.verify(sig, sha256(sha256(msg)), secp256k1.getPublicKey(this.signer));
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

module.exports = {
	random,
	fromPrivateKey,
	fromSeed,
};
