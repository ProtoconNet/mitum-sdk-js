const {
	error,
	EC_NOT_IMPLEMENTED_BYTES,
	EC_NOT_IMPLEMENTED_DICT,
} = require("./error.js");

exports.IBytes = class IBytes {
	bytes() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_BYTES,
			"unimplemented method bytes()"
		);
	}
};

exports.IDict = class IDict {
	dict() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_DICT,
			"unimplemented method dict()"
		);
	}
};

exports.IBytesDict = class IBytesDict {
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
};
