const { SUFFIX_LENGTH } = require("../mitum.config.js");
const {
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_NODE_ADDRESS,
} = require("../alias/key.js");

const { assert, error, EC_INVALID_KEY } = require("../base/error.js");

exports.isPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PRIVATE;
};

exports.isPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PUBLIC;
};

exports.isKeySuffix = (s) => {
	return (
		typeof s === "string" && (exports.isPrivateKeySuffix(s) || exports.isPublicKeySuffix(s))
	);
};

isAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ACCOUNT_ADDRESS;
};
exports.isAddressSuffix = isAddressSuffix

exports.isNodeAddressSuffix = (s) => {
	return s === SUFFIX_NODE_ADDRESS;
};

exports.isM2PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return exports.isPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

exports.isM1PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 55) {
		return false;
	}

	if (!["L", "K"].includes(s.charAt(0))) {
		return false;
	}

	return exports.isPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

exports.isPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return exports.isPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

exports.isM2Key = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return exports.isKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

exports.isM1Key = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (exports.isPublicKey(s) && (s.length < 46 || s.length > 48)) {
		return false;
	}

	if (!exports.isM1PrivateKey(s)) {
		return false;
	}

	return true;
};

exports.isKey = function(s) {
	return exports.isM2Key(s) || exports.isM1Key(s);
};

exports.isAddress = function(s) {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 45 || s.length > 47) {
		return false;
	}

	return isAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
};

exports.isNodeAddress = (s) => {
	if (typeof s !== "string" || s.length < 3) {
		return false;
	}

	return exports.isNodeAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
}

exports.parseKey = (s) => {
	assert(
		exports.isKey(s),
		error.format(EC_INVALID_KEY, "invalid type, length or key suffix")
	);

	const key = s.substring(0, s.length - SUFFIX_LENGTH);
	const suffix = s.substring(s.length - SUFFIX_LENGTH);

	return {
		key,
		suffix,
	};
};
