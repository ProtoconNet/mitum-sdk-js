const {
	error,
	EC_NOT_IMPLEMENTED_BYTES,
	EC_NOT_IMPLEMENTED_DICT,
} = require("./error.js");

class IBytes {
	bytes() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_BYTES,
			"unimplemented method bytes()"
		);
	}
}

class IDict {
	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()"
		);
	}
}

class IBytesDict {
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

module.exports = {
	IBytes,
	IDict,
	IBytesDict,
};