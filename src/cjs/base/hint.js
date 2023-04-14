const { assert, error, EC_INVALID_HINT } = require("./error.js");
const { v } = require("../utils/config.js");

exports.Hint = class Hint {
	constructor(hint) {
		assert(
			typeof hint === "string",
			error.type(EC_INVALID_HINT, "not string")
		);
		this.s = hint;
	}

	toString() {
		return this.s + "-" + v();
	}
};