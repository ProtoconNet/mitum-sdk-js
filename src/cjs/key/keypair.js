const bs58 = require("bs58");

const { hmac } = require("@noble/hashes/hmac");
const { sha256 } = require("@noble/hashes/sha256");
const secp256k1 = require("@noble/secp256k1");

const { getPublicCompressed } = require("eccrypto-js");

const Key = require("./key.js");

const { SUFFIX_KEY_PUBLIC } = require("../alias/key.js");
const {
	assert,
	error,
	EC_INVALID_KEY_PAIR,
	EC_NOT_IMPLEMENTED_METHOD,
	EC_INVALID_SEED,
} = require("../base/error.js");

const { Big } = require("../utils/number.js");
const { sum256 } = require("../utils/hash.js");

class KeyPair {
	constructor(privateKey) {
		assert(
			privateKey instanceof Key.Key,
			error.instance(EC_INVALID_KEY_PAIR, "not Key instance")
		);

		this.privateKey = privateKey;
		this.signer = this._generateSigner();
		this.publicKey = new Key.Key(
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
exports.KeyPair = KeyPair

exports.K = (seed) => {
	seed = Buffer.from(bs58.encode(sum256(Buffer.from(seed))));
	
	assert(seed.length >= 40, error.format(EC_INVALID_SEED, "invalid length"))
	
	seed = seed.subarray(0, 40);

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = new Big(seed).big;
	k %= N;
	k += BigInt(1);

	return k;
};
