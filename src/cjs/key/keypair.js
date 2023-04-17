const bs58 = require("bs58");
const secp256k1 = require("@noble/secp256k1");
const { getPublicCompressed } = require("eccrypto-js");

const { Key, KEY_TYPE } = require("./key.js");

const { SUFFIX_KEY_ETHER_PUBLIC, SUFFIX_KEY_PUBLIC } = require("../alias/key.js");
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
			privateKey instanceof Key,
			error.instance(EC_INVALID_KEY_PAIR, "not Key instance")
		);

		this.privateKey = privateKey;
		this.signer = this._generateSigner();

		if (privateKey.keyType === KEY_TYPE.ether) {
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

const K = (seed) => {
	seed = Buffer.from(bs58.encode(sum256(Buffer.from(seed))));

	assert(seed.length >= 40, error.format(EC_INVALID_SEED, "invalid length"))

	seed = seed.subarray(0, 40);

	const N = secp256k1.CURVE.n - BigInt(1);
	let k = new Big(seed).big;
	k %= N;
	k += BigInt(1);

	return k;
};

module.exports = {
	KeyPair,
	K,
}