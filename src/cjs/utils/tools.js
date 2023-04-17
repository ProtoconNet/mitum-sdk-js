const { error, assert, EC_INVALID_PRIVATE_KEY } = require("../base/error.js");

const m1 = require("../key/m1-keypair.js");
const m2 = require("../key/m2-keypair.js");
const m2ether = require("../key/m2-ether-keypair.js");

const { isM1PrivateKey, isM2EtherPrivateKey, isM2PrivateKey } = require("../key/validation.js");

exports.exist = (dic, k) => Object.prototype.hasOwnProperty.call(dic, k);

exports.findKeyPair = (privateKey) => {
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
		exports.exist(kp, "keypair") && exports.exist(kp, "type"),
		error.format(EC_INVALID_PRIVATE_KEY, "wrong private key")
	);

	return kp;
};