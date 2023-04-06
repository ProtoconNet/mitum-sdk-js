const Int64 = require("int64-buffer");
const bigInt = require("big-integer");

const { IBytes } = require("../base/interface.js");
const {
	assert,
	error,
	EC_INVALID_BIG_INTEGER,
	EC_INVALID_FLOAT,
} = require("../base/error.js");

const toBig = (n) => {
	const big = [];

	Uint8Array.from(n).forEach((b) => {
		b = b.toString(16);
		b.length % 2 ? big.push("0" + b) : big.push(b);
	});

	return BigInt("0x" + big.join(""));
};

exports.Big = class Big extends IBytes {
	constructor(n) {
		super();
		if (typeof n === "bigint") {
			this.big = n;
		} else if (typeof n === "number" || typeof n === "string") {
			this.big = BigInt(n);
		} else {
			try {
				this.big = toBig(n);
			} catch (e) {
				throw error.type(EC_INVALID_BIG_INTEGER, "not Array");
			}
		}
	}

	fillBytes() {
		const size = this.byteLen();

		assert(
			size <= 8,
			error.range(EC_INVALID_BIG_INTEGER, "big out of range")
		);

		return Buffer.from(new Int64.Uint64LE(Number(this.big)).toBuffer());
	}

	bytes() {
		const size = this.byteLen();
		const buf = new Uint8Array(size);

		let n = bigInt(this.big);
		for (let i = size - 1; i >= 0; i--) {
			buf[i] = n.mod(256);
			n = n.divide(256);
		}

		return Buffer.from(buf);
	}

	byteLen() {
		const bitLen = bigInt(this.big.valueOf()).bitLength();
		const quotient = bigInt(bitLen).divide(8);

		if (bitLen - quotient.valueOf() * 8 > 0) {
			return quotient.valueOf() + 1;
		} else {
			return quotient.valueOf();
		}
	}

	get v() {
		return parseInt(this.toString());
	}

	toString() {
		return this.big.toString();
	}
}

exports.Float = class Float extends IBytes {
	constructor(n) {
		super();
		assert(
			typeof n === "number",
			error.type(EC_INVALID_FLOAT, "not number")
		);
		this.n = n;
	}

	bytes() {
		const b = Buffer.allocUnsafe(8);
		b.writeDoubleBE(this.n);
		return b;
	}

	toString() {
		return `${this.n}`;
	}
}
