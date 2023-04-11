import { SUFFIX_LENGTH, SUFFIX_ZERO_ADDRESS_LENGTH } from "../mitum.config.js";
import {
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_ETHER_ACCOUNT_ADDRESS,
	SUFFIX_KEY_ETHER_PRIVATE,
	SUFFIX_KEY_ETHER_PUBLIC,
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_NODE_ADDRESS,
	SUFFIX_ZERO_ADDRESS,
} from "../alias/key.js";

import { assert, error, EC_INVALID_KEY } from "../base/error.js";

export const isPrivateKeySuffix = (s) => {
	return typeof s === "string" && (s === SUFFIX_KEY_PRIVATE || s === SUFFIX_KEY_ETHER_PRIVATE);
};

export const isPublicKeySuffix = (s) => {
	return typeof s === "string" && (s === SUFFIX_KEY_PUBLIC || s === SUFFIX_KEY_ETHER_PUBLIC);
};

export const isMitumPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PRIVATE;
};

export const isMitumPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_PUBLIC;
};

export const isM2EtherPrivateKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_ETHER_PRIVATE;
};

export const isM2EtherPublicKeySuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_KEY_ETHER_PUBLIC;
};

export const isMitumKeySuffix = (s) => {
	return isMitumPrivateKeySuffix(s) || isMitumPublicKeySuffix(s);
};

export const isM2EtherKeySuffix = (s) => {
	return isM2EtherPrivateKeySuffix(s) || isM2EtherPublicKeySuffix(s);
};

export const isKeySuffix = (s) => {
	return isPrivateKeySuffix(s) || isPublicKeySuffix(s);
};

export const isMitumAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ACCOUNT_ADDRESS;
};

export const isM2EtherAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ETHER_ACCOUNT_ADDRESS;
};

export const isZeroAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_ZERO_ADDRESS;
}

export const isAddressSuffix = (s) => {
	return isMitumAddressSuffix(s) || isM2EtherAddressSuffix(s);
};

export const isNodeAddressSuffix = (s) => {
	return typeof s === "string" && s === SUFFIX_NODE_ADDRESS;
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

	return isMitumPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM2PrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isMitumPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM2EtherPrivateKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 67) {
		return false;
	}

	return isM2EtherPrivateKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isMitumPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length < 46 || s.length > 48) {
		return false;
	}

	return isMitumPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM2EtherPublicKey = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (s.length !== 133) {
		return false;
	}

	return isM2EtherPublicKeySuffix(s.substring(s.length - SUFFIX_LENGTH));
};

export const isM1Key = (s) => {
	return isM1PrivateKey(s) || isMitumPublicKey(s);
};

export const isM2Key = (s) => {
	return isM2PrivateKey(s) || isMitumPublicKey(s);
};

export const isM2EtherKey = (s) => {
	return isM2EtherPrivateKey(s) || isM2EtherPublicKey(s);
};

export const isKey = (s) => {
	return isM2Key(s) || isM1Key(s) || isM2EtherKey(s);
};

export const isAddress = (s) => {
	if (typeof s !== "string") {
		return false;
	}

	if (47 < s.length || s.length < 43) {
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

export const isZeroAddress = (s) => {
	if (typeof s !== "string" || s.length < 8 || s.length > 15) {
		return false;
	}

	return isZeroAddressSuffix(s.substring(s.length - SUFFIX_ZERO_ADDRESS_LENGTH));
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
