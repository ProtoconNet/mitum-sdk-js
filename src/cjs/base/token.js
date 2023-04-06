const { IBytes } = require("./interface.js");
const { assert, error, EC_INVALID_TOKEN } = require("./error.js");

class Token extends IBytes {
	constructor(s) {
		super();
		assert(
			typeof s === "string",
			error.type(EC_INVALID_TOKEN, "not string")
		);
		this.s = s;
	}

	bytes() {
		return Buffer.from(this.s);
	}

	toString() {
		return Buffer.from(this.s, "utf8").toString("base64");
	}
}
exports.Token = Token