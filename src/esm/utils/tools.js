import { error, assert, EC_INVALID_PRIVATE_KEY } from "../base/error.js";

import { m1 } from "../key/m1-keypair.js";
import { m2 } from "../key/m2-keypair.js";
import { m2ether } from "../key/m2-ether-keypair.js";

import { isM1PrivateKey, isM2EtherPrivateKey, isM2PrivateKey } from "../key/validation.js";

export const exist = (dic, k) => Object.prototype.hasOwnProperty.call(dic, k);

export const findKeyPair = (privateKey) => {
	assert(
		typeof privateKey === "string",
		error.type(EC_INVALID_PRIVATE_KEY, "not string")
	);

	const kp = {};
	if (isM1PrivateKey(privateKey)) {
		kp["type"] = "m1";
		kp["keypair"] = m1.fromPrivateKey(privateKey);
	} else if (isM2PrivateKey(privateKey)) {
		kp["type"] = "m2";
		kp["keypair"] = m2.fromPrivateKey(privateKey);
	} else if (isM2EtherPrivateKey(privateKey)) {
		kp["type"] = "m2ether";
		kp["keypair"] = m2ether.fromPrivateKey(privateKey);
	}

	assert(
		exist(kp, "keypair") && exist(kp, "type"),
		error.format(EC_INVALID_PRIVATE_KEY, "wrong private key")
	);

	return kp;
};