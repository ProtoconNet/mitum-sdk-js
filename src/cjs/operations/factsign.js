const bs58 = require("bs58");

const { HINT_FACT_SIGN } = require("../alias/sign.js");

const { Hint } = require("../base/hint.js");
const { IBytesDict } = require("../base/interface.js");
const { assert, error, EC_INVALID_PUBLIC_KEY } = require("../base/error.js");

const Key = require("../key/key.js");
const { Address } = require("../key/address.js");
const { isPublicKey } = require("../key/validation.js");

const { FullTimeStamp } = require("../utils/time.js");

class FactSign extends IBytesDict {
	constructor(signer, sign, signedAt) {
		super();
		this.sign = sign;
		this.signedAt = new FullTimeStamp(signedAt);

		assert(
			isPublicKey(signer),
			error.format(EC_INVALID_PUBLIC_KEY, "not public key")
		);
		this.signer = new Key.Key(signer);
	}

	bytes() {
		return Buffer.concat([
			this.signer.bytes(),
			this.sign,
			this.signedAt.hashBytes(),
		]);
	}

	dict() {
		const fs = {
			signer: this.signer.toString(),
			signature: bs58.encode(this.sign),
			signed_at: this.signedAt.ISO(),
		};

		return fs;
	}
}
exports.FactSign = FactSign;

class M1FactSign extends FactSign {
	constructor(signer, sign, signedAt) {
		super(signer, sign, signedAt);
		this.hint = new Hint(HINT_FACT_SIGN);
	}

	dict() {
		return {
			...super.dict(),
			_hint: this.hint.toString(),
		};
	}
}
exports.M1FactSign = M1FactSign;

class M2FactSign extends FactSign {
	constructor(signer, sign, signedAt) {
		super(signer, sign, signedAt);
	}
}
exports.M2FactSign = M2FactSign;

class M2NodeFactSign extends FactSign {
	constructor(node, signer, sign, signedAt) {
		super(signer, sign, signedAt);
		this.node = new Address(node);
	}

	bytes() {
		return Buffer.concat([
			this.node.bytes(),
			this.signer.bytes(),
			this.sign,
			this.signedAt.hashBytes(),
		]);
	}

	dict() {
		return {
			...super.dict(),
			node: this.node.toString(),
		};
	}
}
exports.M2NodeFactSign = M2NodeFactSign;