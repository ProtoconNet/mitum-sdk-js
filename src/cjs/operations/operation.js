const fs = require("fs");
const bs58 = require("bs58");
const axios = require("axios");

const { Fact } = require("./fact.js");
const {
	FactSign,
	M1FactSign,
	M2FactSign,
	M2NodeFactSign,
} = require("./factsign.js");

const {
	assert,
	error,
	EC_FACTSIGN_CREATION_FAILED,
	EC_INVALID_FACT,
	EC_INVALID_FACTSIGN,
	EC_INVALID_MEMO,
	EC_FILE_CREATION_FAILED,
	EC_INVALID_SIG_TYPE,
	EC_INVALID_OPERATION,
	EC_INVALID_PRIVATE_KEY,
	EC_INVALID_NETWORK_ID,
	EC_INVALID_KEY_TYPE,
} = require("../base/error.js");
const { ID } = require("../base/ID.js");
const { Hint } = require("../base/hint.js");
const { IBytesDict } = require("../base/interface.js");

const { sum256 } = require("../utils/hash.js");
const { sortBuf } = require("../utils/string.js");
const { TimeStamp } = require("../utils/time.js");
const { id, SIG_TYPE } = require("../utils/config.js");
const { exist, findKeyPair } = require("../utils/tools.js");

const { Address } = require("../key/address.js");

const { CreateAccountsFact } = require("./currency/create-accounts.js");
const { CreateContractAccountsFact } = require("../../cjs/operations/currency/create-contract-accounts.js");

exports.Operation = class Operation extends IBytesDict {
	constructor(fact, memo) {
		super();
		this.id = new ID(id(), EC_INVALID_NETWORK_ID);

		assert(
			fact instanceof Fact,
			error.instance(EC_INVALID_FACT, "not Fact instance")
		);
		this.hint = new Hint(fact.opHint);
		this.fact = fact;

		if (!memo) {
			memo = '';
		}

		assert(
			typeof memo === "string",
			error.type(EC_INVALID_MEMO, "not string")
		);
		this.memo = memo;

		this.factSigns = [];
		this.hash = null;
	}

	setFactSigns(factSigns) {
		if (!factSigns) {
			return;
		}

		assert(
			Array.isArray(factSigns),
			error.type(EC_INVALID_FACTSIGN, "not Array")
		);

		const farr = factSigns.map((fs) => {
			assert(
				fs instanceof FactSign,
				error.instance(EC_INVALID_FACTSIGN, "not FactSign instance")
			);
			return fs.signer.toString();
		});

		const fset = new Set(farr);
		assert(
			farr.length === fset.size,
			error.duplicate(EC_INVALID_FACTSIGN, "duplicate fact signs")
		);

		const sigType = this._findSigType(factSigns);
		if (this.fact instanceof CreateAccountsFact || this.fact instanceof CreateContractAccountsFact) {
			switch (sigType) {
				case SIG_TYPE.M1:
					assert(this.fact.isMitum1, error.runtime(EC_INVALID_FACTSIGN, "m1 fact sign for m2 fact"));
					break
				case SIG_TYPE.M2:
				case SIG_TYPE.M2_NODE:
					assert(!this.fact.isMitum1, error.runtime(EC_INVALID_FACTSIGN, "m2 fact sign for m1 fact"));
					break
				default:
					throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type in fact signs");
			}
		}

		this.factSigns = factSigns;

		this.hash = this.hashing();
	}

	_findSigType(factSigns) {
		if (!factSigns) {
			factSigns = this.factSigns;
		}

		if (!factSigns || factSigns.length < 1) {
			return null;
		}

		const fsTypes = factSigns.map(
			(fs) => Object.getPrototypeOf(fs).constructor.name
		);
		const fsSet = new Set(fsTypes);
		assert(
			fsSet.size === 1,
			error.duplicate(
				EC_INVALID_OPERATION,
				"multiple sig-type in operation"
			)
		);

		return Array.from(fsSet)[0];
	}

	hashing() {
		const sigType = this._findSigType(this.factSigns);

		if (!sigType) {
			throw error.runtime(EC_INVALID_SIG_TYPE, "empty fact signs");
		}

		switch (sigType) {
			case SIG_TYPE.M1:
				return sum256(
					Buffer.concat([this.bytes(), Buffer.from(this.memo)])
				);
			case SIG_TYPE.M2:
			case SIG_TYPE.M2_NODE:
				return sum256(this.bytes());
			default:
				throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type in fact signs");
		}
	}

	forceHashing(sigType) {
		switch (sigType) {
			case SIG_TYPE.M1:
				this.hash = sum256(
					Buffer.concat([this.bytes(), Buffer.from(this.memo)])
				);
				break;
			case SIG_TYPE.M2:
			case SIG_TYPE.M2_NODE:
				this.hash = sum256(this.bytes());
				break;
			default:
				throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type in fact signs");
		}
	}

	sign(privateKey, option) {
		const kp = findKeyPair(privateKey);

		const sigType = this._findSigType();

		let node =
			option && exist(option, "node") ? new Address(option.node) : null;

		if (sigType === SIG_TYPE.M2_NODE) {
			assert(
				node,
				error.runtime(
					EC_INVALID_FACTSIGN,
					"no node address in sig option"
				)
			);
		}

		if (!sigType && (this.fact instanceof CreateAccountsFact || this.fact instanceof CreateContractAccountsFact)) {
			switch (kp.type) {
				case 'm1':
					assert(this.fact.isMitum1, error.runtime(EC_INVALID_FACTSIGN, "trying to sign m2 fact with m1 keypair"));
					break
				case 'm2':
				case 'm2ether':
					assert(!this.fact.isMitum1, error.runtime(EC_INVALID_FACTSIGN, "trying to sign m1 fact with m2 keypair"));
					break
				default:
					throw error.runtime(EC_INVALID_KEY_TYPE, "wrong key-type of signing key");
			}
		}

		let factSign = null;

		if (sigType) {
			switch (sigType) {
				case SIG_TYPE.M1:
					assert(kp.type === "m1", error.runtime(EC_INVALID_PRIVATE_KEY, "not m1 keypair"));
					factSign = getM1FactSign(kp.keypair, this.fact.hash, this.id);
					break;
				case SIG_TYPE.M2:
					assert(["m2", "m2ether"].includes(kp.type), error.runtime(EC_INVALID_PRIVATE_KEY, "not m2 keypair"));
					factSign = getM2FactSign(kp.keypair, this.fact.hash, this.id);
					break;
				case SIG_TYPE.M2_NODE:
					assert(["m2", "m2ether"].includes(kp.type), error.runtime(EC_INVALID_PRIVATE_KEY, "not m2 keypair"));
					factSign = getM2NodeFactSign(node, kp.keypair, this.fact.hash, this.id);
					break;
				default:
					throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type in fact signs");
			}
		} else {
			switch (kp.type) {
				case "m1":
					factSign = getM1FactSign(kp.keypair, this.fact.hash, this.id);
					break;
				case "m2":
				case "m2ether":
					if (node) {
						factSign = getM2NodeFactSign(node, kp.keypair, this.fact.hash, this.id);
					} else {
						factSign = getM2FactSign(kp.keypair, this.fact.hash, this.id);
					}
					break;
				default:
					throw error.runtime(EC_INVALID_KEY_TYPE, "invalid key-type of signing key");

			}
		}

		assert(
			factSign !== null,
			error.runtime(
				EC_FACTSIGN_CREATION_FAILED,
				"factsign creation failed; null factsign"
			)
		);

		const idx = this.factSigns
			.map((fs) => fs.signer.toString())
			.indexOf(kp.keypair.publicKey.toString());

		if (idx < 0) {
			this.factSigns.push(factSign);
		} else {
			this.factSigns[idx] = factSign;
		}
		this.hash = this.hashing();
	}

	bytes() {
		if (!this.factSigns) {
			return this.fact.hash;
		}

		this.factSigns.sort(sortBuf);

		return Buffer.concat([
			this.fact.hash,
			Buffer.concat(this.factSigns.map((fs) => fs.bytes())),
		]);
	}

	dict() {
		const op = {
			_hint: this.hint.toString(),
			fact: this.fact.dict(),
			hash: this.hash ? bs58.encode(this.hash) : "",
		};

		if (this.factSigns.length < 1) {
			return op;
		}

		this.factSigns.sort(sortBuf);
		const signs = this.factSigns.map((fs) => fs.dict());

		switch (this._findSigType()) {
			case SIG_TYPE.DEFAULT:
				op.memo = this.memo;
				op.fact_signs = signs;
				break;
			case SIG_TYPE.M2:
			case SIG_TYPE.M2_NODE:
				if (this.memo != "") {
					op.memo = this.memo;
				}
				op.signs = signs
					? signs.map((fs) => {
						delete fs["_hint"];
						return fs;
					})
					: [];
				break;
			default:
				throw error.runtime(EC_INVALID_SIG_TYPE, "invalid sig-type in fact signs");
		}

		return op;
	}

	export(fp) {
		fs.writeFile(fp, JSON.stringify(this.dict(), null, 4), (e) => {
			if (e) {
				throw error.runtime(
					EC_FILE_CREATION_FAILED,
					"write-file failed; operation"
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

const getM1FactSign = (kp, hash, id) => {
	try {
		return new M1FactSign(
			kp.publicKey.toString(),
			kp.sign(Buffer.concat([hash, id.bytes()])),
			new TimeStamp().toString(),
		)
	} catch (e) {
		return null;
	}
};

const getM2FactSign = (kp, hash, id) => {
	const now = new TimeStamp();

	try {
		return new M2FactSign(
			kp.publicKey.toString(),
			kp.sign(
				Buffer.concat([id.bytes(), hash, now.bytes()])
			),
			now.toString()
		)
	} catch (e) {
		return null;
	}
};

const getM2NodeFactSign = (node, kp, hash, id) => {
	const now = new TimeStamp();

	try {
		return new M2NodeFactSign(
			node.toString(),
			kp.publicKey.toString(),
			kp.sign(
				Buffer.concat([
					id.bytes(),
					node ? node.bytes() : Buffer.from([]),
					hash,
					now.bytes(),
				])
			),
			now.toString()
		)
	} catch (e) {
		return null;
	}
};