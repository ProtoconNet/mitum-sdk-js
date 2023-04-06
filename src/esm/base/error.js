export const EC_INVALID_SEED = "EC_INVALID_SEED";

export const EC_INVALID_KEY = "EC_INVALID_KEY";
export const EC_INVALID_KEYS = "EC_INVALID_KEYS";
export const EC_INVALID_KEY_PAIR = "EC_INVALID_KEY_PAIR";

export const EC_INVALID_PRIVATE_KEY = "EC_INVALID_PRIVATE_KEY";
export const EC_INVALID_PUBLIC_KEY = "EC_INVALID_PUBLIC_KEY";

export const EC_INVALID_ADDRESS = "EC_INVALID_ADDRESS";
export const EC_INVALID_WEIGHT = "EC_INVALID_WEIGHT";
export const EC_INVALID_THRESHOLD = "EC_INVALID_THRESHOLD";

export const EC_INVALID_HINT = "EC_INVALID_HINT";
export const EC_INVALID_TOKEN = "EC_INVALID_TOKEN";
export const EC_INVALID_BIG_INTEGER = "EC_INVALID_BIG_INTERGER";
export const EC_INVALID_FLOAT = "EC_INVALID_FLOAT";

export const EC_INVALID_CURRENCY_ID = "EC_INVALID_CURRENCY_ID";
export const EC_INVALID_CONTRACT_ID = "EC_INVALID_CONTRACT_ID";

export const EC_INVALID_MEMO = "EC_INVALID_MEMO";
export const EC_INVALID_NETWORK_ID = "EC_INVALID_NETWORK_ID";
export const EC_INVALID_VERSION = "EC_INVALID_VERSION";

export const EC_INVALID_ITEM = "EC_INVALID_ITEM";
export const EC_INVALID_ITEMS = "EC_INVALID_ITEMS";

export const EC_INVALID_FACTSIGN = "EC_INVALID_FACTSIGN";
export const EC_INVALID_SIG_TYPE = "EC_INVALID_SIG_TYPE";

export const EC_INVALID_FACT = "EC_INVALID_FACT";
export const EC_INVALID_OPERATION = "EC_INVALID_OPERATION";
export const EC_INVALID_OPERATIONS = "EC_INVALID_OPERATIONS";
export const EC_INVALID_SEAL = "EC_INVALID_SEAL";

export const EC_INVALID_AMOUNT = "EC_INVALID_AMOUNT";
export const EC_INVALID_AMOUNTS = "EC_INVALID_AMOUNTS";

export const EC_INVALID_RATIO = "EC_INVALID_RATIO";
export const EC_INVALID_CURRENCY_FEEER = "EC_INVALID_CURRENCY_FEEER";
export const EC_INVALID_CURRENCY_POLICY = "EC_INVALID_CURRENCY_POLICY";
export const EC_INVALID_CURRENCY_DESIGN = "EC_INVALID_CURRENCY_DESIGN";

export const EC_NOT_IMPLEMENTED_BYTES = "EC_NOT_IMPLEMENTED_BYTES";
export const EC_NOT_IMPLEMENTED_DICT = "EC_NOT_IMPLEMENTED_DICT";
export const EC_NOT_IMPLEMENTED_METHOD = "EC_NOT_IMPLEMENTED_METHOD";

export const EC_FILE_CREATION_FAILED = "EC_FILE_CREATION_FAILED";
export const EC_FACTSIGN_CREATION_FAILED = "EC_FACTSIGN_CREATION_FAILED";

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

export const error = {
	runtime,
	suffix,
    duplicate,
	format,
	range,
	type,
	instance,
	nimplement,
};

export const assert = (bool, error) => {
	if (!bool) {
		throw error;
	}
};
