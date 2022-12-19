import fs from "fs";
import axios from "axios";
import bs58 from "bs58";

import { ID } from "../base/ID.js";
import { Hint } from "../base/hint.js";
import { IBytesDict } from "../base/interface.js";
import { HINT_BASE_SEAL } from "../alias/sign.js";
import {
	assert,
	error,
	EC_FILE_CREATION_FAILED,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_SIG_TYPE,
	EC_INVALID_OPERATION,
	EC_INVALID_OPERATIONS,
} from "../base/error.js";

import { Key } from "../key/key.js";
import { ecdsa } from "../key/ecdsa-keypair.js";
import { isECDSAPrivateKey } from "../key/validation.js";

import { sum256 } from "../utils/hash.js";
import { TimeStamp } from "../utils/time.js";
import { id, SIG_TYPE } from "../utils/config.js";

import { Operation } from "./operation.js";
import { MAX_OPERATIONS_IN_SEAL } from "../mitum.config.js";

export class Seal extends IBytesDict {
	constructor(operations) {
		super();
		this.hint = new Hint(HINT_BASE_SEAL);
		this.id = new ID(id());

		assert(
			Array.isArray(operations),
			error.type(EC_INVALID_OPERATIONS, "not Array")
		);

		assert(
			operations.length <= MAX_OPERATIONS_IN_SEAL,
			error.range(EC_INVALID_OPERATIONS, "array size out of range")
		);

		this.operations = operations.map((op) => {
			if (op instanceof Operation) {
				assert(
					[SIG_TYPE.DEFAULT, SIG_TYPE.M1].includes(op.sigType),
					error.runtime(
						EC_INVALID_SIG_TYPE,
						"not m1 sig-type; seal is only available on mitum1"
					)
				);
				return op.dict();
			} else {
				const exist = (v) =>
					Object.prototype.hasOwnProperty.call(op, v);
				assert(
					typeof op === "object" &&
						exist("hash") &&
						exist("_hint") &&
						exist("memo") &&
						exist("fact") &&
						exist("fact_signs"),
					error.format(
						EC_INVALID_OPERATION,
						"invalid operation; or, node-operation cannot be included in seal"
					)
				);

				return op;
			}
		});

		this.signer = null;
		this.signature = null;
		this.signedAt = null;

		this.hash = null;
		this.bodyHash = null;
	}

	bytes() {
		return Buffer.concat([this.bodyHash, this.signature]);
	}

	hashing() {
		return sum256(this.bytes());
	}

	sign(privateKey) {
		assert(
			typeof privateKey === "string",
			error.type(EC_INVALID_PRIVATE_KEY, "not string")
		);

		const kp = isECDSAPrivateKey(privateKey)
			? ecdsa.fromPrivateKey(privateKey)
			: null;

		assert(
			kp !== null,
			error.format(
				EC_INVALID_PRIVATE_KEY,
				"wrong private key; only m1 key avaliable"
			)
		);

		const signer = new Key(privateKey);
		const signedAt = new TimeStamp();

		const bodyHash = sum256(
			Buffer.concat([
				signer.bytes(),
				signedAt.bytes(),
				Buffer.concat(
					this.operations.map((op) => bs58.decode(op.hash))
				),
			])
		);

		const signature = kp.sign(Buffer.concat([bodyHash, this.id.bytes()]));

		this.signer = signer;
		this.signedAt = signedAt;
		this.signature = signature;
		this.bodyHash = bodyHash;
		this.hash = this.hashing();
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			body_hash: bs58.encode(this.bodyHash),
			signer: this.signer.toString(),
			signature: bs58.encode(this.signature),
			signed_at: this.signedAt.toString(),
			operations: this.operations,
		};
	}

	export(fp) {
		fs.writeFile(fp, JSON.stringify(this.dict(), null, 4), (e) => {
			if (e) {
				throw error.runtime(
					EC_FILE_CREATION_FAILED,
					"write-file failed; seal"
				);
			}
		});
	}

	request(url, headers) {
		if (headers) {
			return axios.post(url, this.dict(), { headers });
		}
		return axios.post(url, this.dict());
	}
}
