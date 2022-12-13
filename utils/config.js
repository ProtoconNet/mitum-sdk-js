import {
	assert,
	error,
	EC_INVALID_NETWORK_ID,
	EC_INVALID_VERSION,
} from "../base/error.js";

let version = "v0.0.1";
export const v = () => {
	return version;
};
export const useV = (s) => {
	assert(typeof s === "string", error.type(EC_INVALID_VERSION, "not string"));
	version = s;
};

let networkId = "mitum";
export const id = () => {
	return networkId;
};
export const useId = (s) => {
	assert(
		typeof s === "string",
		error.type(EC_INVALID_NETWORK_ID, "not string")
	);
	networkId = s;
};