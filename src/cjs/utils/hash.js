const jsSHA3 = require("js-sha3");
const nobleSha256 = require("@noble/hashes/sha256");

exports.sha256 = (msg) => {
	return Buffer.from(nobleSha256.sha256(msg));
};

exports.sum256 = (msg) => {
	return Buffer.from(jsSHA3.sha3_256.create().update(msg).digest());
};

exports.keccak256 = (msg) => {
	return Buffer.from(jsSHA3.keccak256.create().update(msg).digest());
}