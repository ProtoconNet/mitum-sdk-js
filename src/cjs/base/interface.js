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
exports.IBytes = IBytes

class IDict {
	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()"
		);
	}
}
exports.IDict = IDict

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
exports.IBytesDict = IBytesDict
