const fs = require("fs");
const axios = require("axios");
const bs58 = require("bs58");

const { ID } = require("../base/ID.js");
const { Hint } = require("../base/hint.js");
const { IBytesDict } = require("../base/interface.js");
const { HINT_BASE_SEAL } = require("../alias/sign.js");
const {
	assert,
	error,
	EC_FILE_CREATION_FAILED,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_SIG_TYPE,
	EC_INVALID_OPERATION,
	EC_INVALID_OPERATIONS,
	EC_INVALID_SEAL,
} = require("../base/error.js");

const m1 = require("../key/m1-keypair.js");
const { isM1PrivateKey } = require("../key/validation.js");

const { exist } = require("../utils/tools.js");
const { sum256 } = require("../utils/hash.js");
const { TimeStamp } = require("../utils/time.js");
const { id, SIG_TYPE } = require("../utils/config.js");

const { Operation } = require("./operation.js");
const { MAX_OPERATIONS_IN_SEAL } = require("../mitum.config.js");

class Seal extends IBytesDict {
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
					[SIG_TYPE.DEFAULT, SIG_TYPE.M1].includes(op._findSigType()),
					error.runtime(
						EC_INVALID_SIG_TYPE,
						"not m1 sig-type; seal is only available on mitum1"
					)
				);
				return op.dict();
			} else {
				assert(
					typeof op === "object" &&
						exist(op, "hash") &&
						exist(op, "_hint") &&
						exist(op, "memo") &&
						exist(op, "fact") &&
						exist(op, "fact_signs"),
					error.format(
						EC_INVALID_OPERATION,
						"invalid operation; or, node-operation cannot be included in seal"
					)
				);

				return op;
			}
		});

		const oarr = this.operations.map((op) => op.fact.hash);
		const oset = new Set(oarr);
		assert(
			oarr.length === oset.size,
			error.duplicate(EC_INVALID_SEAL, "duplicate facts")
		);

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

		const kp = isM1PrivateKey(privateKey)
			? m1.fromPrivateKey(privateKey)
			: null;

		assert(
			kp !== null,
			error.format(
				EC_INVALID_PRIVATE_KEY,
				"wrong private key; only m1 key avaliable"
			)
		);

		const signer = kp.publicKey;
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
		assert(
			this.hash && this.bodyHash && this.signature,
			error.runtime(EC_INVALID_SEAL, "not yet signed")
		);

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
exports.Seal = Seal