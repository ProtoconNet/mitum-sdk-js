import {
	error,
	EC_NOT_IMPLEMENTED_BYTES,
	EC_NOT_IMPLEMENTED_DICT,
} from "./error.js";

export class IBytes {
	bytes() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_BYTES,
			"unimplemented method bytes()"
		);
	}
}

export class IDict {
	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()"
		);
	}
}

export class IBytesDict {
	bytes() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_BYTES,
			"unimplemented method bytes()"
		);
	}

	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()"
		);
	}
}
