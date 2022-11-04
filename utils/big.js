import Int64 from "int64-buffer";
import bigInt from "big-integer";

import { IBytes } from "../base/interface.js";
import {
	assert,
	EC_INVALID_BIG_INTEGER,
	InvalidRangeError,
	InvalidTypeError,
} from "../base/error.js";

import { jsonStringify } from "../utils/json.js";

const toBig = (n) => {
	const big = [];

	Uint8Array.from(n).forEach((b) => {
		b = b.toString(16);
		b.length % 2 ? big.push("0" + b) : big.push(b);
	});

	return BigInt("0x" + big.join(""));
};

class Big extends IBytes {
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
				throw new InvalidTypeError(
					"not Array object",
					EC_INVALID_BIG_INTEGER,
					n
				);
			}
		}
	}

	fillBytes() {
		const size = this.byteLen();

		assert(
			size <= 8,
			new InvalidRangeError(
				"big out of range",
				EC_INVALID_BIG_INTEGER,
				jsonStringify({
					size,
					big: this.big.toString(),
				})
			)
		);

		return Buffer.from(new Int64.Uint64LE(Number(this.big)).toBuffer());
	}

	bytes() {
		const size = this.byteLen();
		const buf = new Uint8Array(size);

		let n = bigInt(this.big);
		for (var i = size - 1; i >= 0; i--) {
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

export default Big;
