exports.EC_INVALID_SEED = "EC_INVALID_SEED";

exports.EC_INVALID_KEY = "EC_INVALID_KEY";
exports.EC_INVALID_KEYS = "EC_INVALID_KEYS";
exports.EC_INVALID_KEY_PAIR = "EC_INVALID_KEY_PAIR";

exports.EC_INVALID_KEY_TYPE = "EC_INVALID_KEY_TYPE";
exports.EC_INVALID_ADDRESS_TYPE = "EC_INVALID_ADDRESS_TYPE";

exports.EC_INVALID_PRIVATE_KEY = "EC_INVALID_PRIVATE_KEY";
exports.EC_INVALID_PUBLIC_KEY = "EC_INVALID_PUBLIC_KEY";

exports.EC_INVALID_ADDRESS = "EC_INVALID_ADDRESS";
exports.EC_INVALID_WEIGHT = "EC_INVALID_WEIGHT";
exports.EC_INVALID_THRESHOLD = "EC_INVALID_THRESHOLD";

exports.EC_INVALID_HINT = "EC_INVALID_HINT";
exports.EC_INVALID_TOKEN = "EC_INVALID_TOKEN";
exports.EC_INVALID_BIG_INTEGER = "EC_INVALID_BIG_INTERGER";
exports.EC_INVALID_FLOAT = "EC_INVALID_FLOAT";

exports.EC_INVALID_CURRENCY_ID = "EC_INVALID_CURRENCY_ID";
exports.EC_INVALID_CONTRACT_ID = "EC_INVALID_CONTRACT_ID";

exports.EC_INVALID_MEMO = "EC_INVALID_MEMO";
exports.EC_INVALID_NETWORK_ID = "EC_INVALID_NETWORK_ID";
exports.EC_INVALID_VERSION = "EC_INVALID_VERSION";

exports.EC_INVALID_ITEM = "EC_INVALID_ITEM";
exports.EC_INVALID_ITEMS = "EC_INVALID_ITEMS";

exports.EC_INVALID_FACTSIGN = "EC_INVALID_FACTSIGN";
exports.EC_INVALID_SIG_TYPE = "EC_INVALID_SIG_TYPE";

exports.EC_INVALID_FACT = "EC_INVALID_FACT";
exports.EC_INVALID_OPERATION = "EC_INVALID_OPERATION";
exports.EC_INVALID_OPERATIONS = "EC_INVALID_OPERATIONS";
exports.EC_INVALID_SEAL = "EC_INVALID_SEAL";

exports.EC_INVALID_AMOUNT = "EC_INVALID_AMOUNT";
exports.EC_INVALID_AMOUNTS = "EC_INVALID_AMOUNTS";

exports.EC_INVALID_RATIO = "EC_INVALID_RATIO";
exports.EC_INVALID_CURRENCY_FEEER = "EC_INVALID_CURRENCY_FEEER";
exports.EC_INVALID_CURRENCY_POLICY = "EC_INVALID_CURRENCY_POLICY";
exports.EC_INVALID_CURRENCY_DESIGN = "EC_INVALID_CURRENCY_DESIGN";

exports.EC_NOT_IMPLEMENTED_BYTES = "EC_NOT_IMPLEMENTED_BYTES";
exports.EC_NOT_IMPLEMENTED_DICT = "EC_NOT_IMPLEMENTED_DICT";
exports.EC_NOT_IMPLEMENTED_METHOD = "EC_NOT_IMPLEMENTED_METHOD";

exports.EC_FILE_CREATION_FAILED = "EC_FILE_CREATION_FAILED";
exports.EC_FACTSIGN_CREATION_FAILED = "EC_FACTSIGN_CREATION_FAILED";

class CustomError extends Error {
	constructor(msg, code) {
		super(msg);
		this.code = code || "";
		this.name = this.constructor.name;
	}
}

class RuntimeError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const runtime = (code, msg) => {
	return new RuntimeError(msg, code);
};

class SuffixError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const suffix = (code, msg) => {
	return new SuffixError(msg, code);
};

class DuplicateItemsError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const duplicate = (code, msg) => {
	return new DuplicateItemsError(msg, code);
};

class InvalidFormatError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const format = (code, msg) => {
	return new InvalidFormatError(msg, code);
};

class InvalidRangeError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const range = (code, msg) => {
	return new InvalidRangeError(msg, code);
};

class InvalidTypeError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const type = (code, msg) => {
	return new InvalidTypeError(msg, code);
};

class InvalidInstanceError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const instance = (code, msg) => {
	return new InvalidInstanceError(msg, code);
};

class NotImplementedError extends CustomError {
	constructor(msg, code) {
		super(msg, code);
	}
}
const nimplement = (code, msg) => {
	return new NotImplementedError(msg, code);
};

exports.error = {
	runtime,
	suffix,
    duplicate,
	format,
	range,
	type,
	instance,
	nimplement,
};

exports.assert = (bool, error) => {
	if (!bool) {
		throw error;
	}
};
