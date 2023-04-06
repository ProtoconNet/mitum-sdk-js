import { SUFFIX_LENGTH } from "../mitum.config.js";
import {
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_NODE_ADDRESS,
} from "../alias/key.js";

import { assert, error, EC_INVALID_KEY } from "../base/error.js";

export const isPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PRIVATE;
};

export const isPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PUBLIC;
};

export const isKeySuffix = (s) => {
	return (
		typeof s === "string" && (isPrivateKeySuffix(s) || isPublicKeySuffix(s))
	);
};

export const isAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ACCOUNT_ADDRESS;
};

export const isNodeAddressSuffix = (s) => {
	return s === SUFFIX_NODE_ADDRESS;
};

export const isM2PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM1PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 55) {
		return false;
	}

	if (!["L", "K"].includes(s.charAt(0))) {
		return false;
	}

	return isPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM2Key = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM1Key = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (isPublicKey(s) && (s.length < 46 || s.length > 48)) {
		return false;
	}

	if (!isM1PrivateKey(s)) {
		return false;
	}

	return true;
};

export const isKey = (s) => {
	return isM2Key(s) || isM1Key(s);
};

export const isAddress = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 45 || s.length > 47) {
		return false;
	}

	return isAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isNodeAddress = (s) => {
	if (typeof s !== "string" || s.length < 3) {
		return false;
	}

	return isNodeAddressSuffix(s.substring(s.length - SUFFIX_LENGTH));
}

export const parseKey = (s) => {
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
