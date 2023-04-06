import jsSHA3 from "js-sha3";
import { sha256 as nobleSha256 } from "@noble/hashes/sha256";

export const sha256 = (msg) => {
	return Buffer.from(nobleSha256(msg));
};

export const sum256 = (msg) => {
	return Buffer.from(jsSHA3.sha3_256.create().update(msg).digest());
};
