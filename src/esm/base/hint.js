import { assert, error, EC_INVALID_HINT } from "./error.js";
import { v } from "../utils/config.js";

export class Hint {
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
}
