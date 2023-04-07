import bs58 from "bs58";

import { HINT_FACT_SIGN } from "../alias/sign.js";

import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";
import { assert, error, EC_INVALID_PUBLIC_KEY } from "../base/error.js";

import { Key } from "../key/key.js";
import { Address } from "../key/address.js";
import { isM2EtherPublicKey, isMitumPublicKey } from "../key/validation.js";

import { FullTimeStamp } from "../utils/time.js";

export class FactSign extends IBytesDict {
	constructor(signer, sign, signedAt) {
		super();
		this.sign = sign;
		this.signedAt = new FullTimeStamp(signedAt);

		assert(
			isMitumPublicKey(signer) || isM2EtherPublicKey(signer),
			error.format(EC_INVALID_PUBLIC_KEY, "not public key")
		);
		this.signer = new Key(signer);
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

export class M1FactSign extends FactSign {
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

export class M2FactSign extends FactSign {
	constructor(signer, sign, signedAt) {
		super(signer, sign, signedAt);
	}
}

export class M2NodeFactSign extends FactSign {
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
