const { SUFFIX_LENGTH, SUFFIX_ZERO_ADDRESS_LENGTH  } = require("../mitum.config.js");
const {
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_ETHER_ACCOUNT_ADDRESS,
	SUFFIX_KEY_ETHER_PRIVATE,
	SUFFIX_KEY_ETHER_PUBLIC,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_NODE_ADDRESS,
	SUFFIX_ZERO_ADDRESS,
} = require("../alias/key.js");

const { assert, error, EC_INVALID_KEY } = require("../base/error.js");

const isPrivateKeySuffix = (s) => {
	return typeof s === "string" && (s === SUFFIX_KEY_PRIVATE || s === SUFFIX_KEY_ETHER_PRIVATE);
};

const isPublicKeySuffix = (s) => {
	return typeof s === "string" && (s === SUFFIX_KEY_PUBLIC || s === SUFFIX_KEY_ETHER_PUBLIC);
};

const isMitumPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PRIVATE;
};

const isMitumPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PUBLIC;
};

const isM2EtherPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_ETHER_PRIVATE;
};

const isM2EtherPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_ETHER_PUBLIC;
};

const isMitumKeySuffix = (s) => {
	return isMitumPrivateKeySuffix(s) || isMitumPublicKeySuffix(s);
};

const isM2EtherKeySuffix = (s) => {
	return isM2EtherPrivateKeySuffix(s) || isM2EtherPublicKeySuffix(s);
};

const isKeySuffix = (s) => {
	return isPrivateKeySuffix(s) || isPublicKeySuffix(s);
};

const isMitumAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ACCOUNT_ADDRESS;
};

const isM2EtherAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ETHER_ACCOUNT_ADDRESS;
};

const isZeroAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ZERO_ADDRESS;
}

const isAddressSuffix = (s) => {
	return isMitumAddressSuffix(s) || isM2EtherAddressSuffix(s);
};

const isNodeAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_NODE_ADDRESS;
};

const isM1PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 55) {
		return false;
	}

	if (!["L", "K"].includes(s.charAt(0))) {
		return false;
	}

	return isMitumPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isM2PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isMitumPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isM2EtherPrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 67) {
		return false;
	}

	return isM2EtherPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isMitumPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isMitumPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isM2EtherPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 133) {
		return false;
	}

	return isM2EtherPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isM1Key = (s) => {
	return isM1PrivateKey(s) || isMitumPublicKey(s);
};

const isM2Key = (s) => {
	return isM2PrivateKey(s) || isMitumPublicKey(s);
};

const isM2EtherKey = (s) => {
	return isM2EtherPrivateKey(s) || isM2EtherPublicKey(s);
};

const isKey = (s) => {
	return isM2Key(s) || isM1Key(s) || isM2EtherKey(s);
};

const isAddress = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (47 < s.length || s.length < 43) {
		return false;
	}

	return isAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isNodeAddress = (s) => {
	if (typeof s !== "string" || s.length < 3) {
		return false;
	}

	return isNodeAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
};

const isZeroAddress = (s) => {
	if (typeof s !== "string" || s.length < 8 || s.length > 15) {
		return false;
	}

	return isZeroAddressSuffix(s.substring(s.length - SUFFIX_ZERO_ADDRESS_LENGTH));
};

const parseKey = (s) => {
	assert(
		isKey(s),
		error.format(EC_INVALID_KEY, "invalid type, length or key suffix")
	);

	const key = s.substring(0, s.length - SUFFIX_LENGTH);
	const suffix = s.substring(s.length - SUFFIX_LENGTH);

	return {
		key,
		suffix,
	};
};

module.exports = {
	isPrivateKeySuffix,
	isPublicKeySuffix,
	isMitumPrivateKeySuffix,
	isMitumPublicKeySuffix,
	isM2EtherPrivateKeySuffix,
	isM2EtherPublicKeySuffix,
	isMitumKeySuffix,
	isM2EtherKeySuffix,
	isKeySuffix,
	isMitumAddressSuffix,
	isM2EtherAddressSuffix,
	isZeroAddressSuffix,
	isAddressSuffix,
	isNodeAddressSuffix,
	isM1PrivateKey,
	isM2PrivateKey,
	isM2EtherPrivateKey,
	isMitumPublicKey,
	isM2EtherPublicKey,
	isM1Key,
	isM2Key,
	isM2EtherKey,
	isKey,
	isAddress,
	isNodeAddress,
	isZeroAddress,
	parseKey,
};