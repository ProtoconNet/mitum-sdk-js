const {
	assert,
	error,
	EC_INVALID_NETWORK_ID,
	EC_INVALID_VERSION,
} = require("../base/error.js");

let version = "v0.0.1";
exports.v = () => {
	return version;
};
exports.useV = (s) => {
	assert(typeof s === "string", error.type(EC_INVALID_VERSION, "not string"));
	version = s;
	return version;
};

let networkId = "mitum";
exports.id = () => {
	return networkId;
};
exports.useId = (s) => {
	assert(
		typeof s === "string",
		error.type(EC_INVALID_NETWORK_ID, "not string")
	);
	networkId = s;
	return networkId;
};

exports.SIG_TYPE = {
	DEFAULT: "M1FactSign",
	M1: "M1FactSign",
	M2: "M2FactSign",
	M2_NODE: "M2NodeFactSign",
};
