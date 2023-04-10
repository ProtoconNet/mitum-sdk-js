import bs58 from "bs58";
import ethWallet from "ethereumjs-wallet";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import * as secp256k1 from "@noble/secp256k1";

import { MIN_SEED_LENGTH } from "../mitum.config.js";

import { EC_INVALID_PRIVATE_KEY, EC_INVALID_SEED, assert, error } from "../base/error.js";
import { SUFFIX_KEY_ETHER_PRIVATE } from "../alias/key.js";

import { Key } from "./key.js";
import { K, KeyPair } from "./keypair.js";
import { isM2EtherPrivateKey } from "./validation.js";
import { Big } from "../utils/number.js";

class M2EtherKeyPair extends KeyPair {
    constructor(privateKey) {
        super(privateKey);
    }

    sign(msg) {
        secp256k1.utils.hmacSha256Sync = (key, ...msgs) =>
			hmac(sha256, key, secp256k1.utils.concatBytes(...msgs));
		secp256k1.utils.sha256Sync = (...msgs) =>
            sha256(secp256k1.utils.concatBytes(...msgs));

		const sig = secp256k1.signSync(sha256(msg), this.signer.getPrivateKey());

        const rlen = sig[3];
        const r = sig.slice(4, 4 + rlen);
        const slen = sig[5 + rlen];
        const s = sig.slice(6 + rlen);

        const brlen = new Big(rlen).fillBytes();

        const buf = Buffer.alloc(rlen + slen + 4);
        brlen.copy(buf, 0, 0, 4);
        
        Buffer.from(r).copy(buf, 4, 0, rlen);
        Buffer.from(s).copy(buf, rlen + 4, 0, slen);

        return buf;
	}

    verify(sig, msg) {
        if (typeof sig === "string") {
            sig = bs58.decode(sig);
        }

        const rlen = new Big(sig.subarray(0, 4).reverse());
        const r = Buffer.alloc(rlen.v);

        const rb = new Big(sig.subarray(4, 4 + rlen.v));
        rb.bytes().copy(r, rlen.v - rb.byteLen());

        const s = sig.subarray(4 + rlen.v);
        const slen = new Big(s.length);

        const base = Buffer.from([48, sig.length, 2]);
        
        const buf = Buffer.alloc(sig.length + 2);
        base.copy(buf, 0, 0, 4);

        rlen.bytes().copy(buf, 3);
        r.copy(buf, 4);

        Buffer.from([2]).copy(buf, 4 + rlen.v);

        slen.bytes().copy(buf, 5 + rlen.v);
        s.copy(buf, 6 + rlen.v);

        return secp256k1.verify(buf, sha256(msg), secp256k1.getPublicKey(this.signer.getPrivateKey()));
    }

    _generateSigner() {
        return ethWallet.fromPrivateKey(Buffer.from(this.privateKey.key, 'hex'));
    }
}

const random = () => {
    return new M2EtherKeyPair(
        new Key(
            ethWallet.generate().getPrivateKeyString().substring(2) + SUFFIX_KEY_ETHER_PRIVATE
        )
    );
};

const fromPrivateKey = (privateKey) => {
    assert(
        typeof privateKey === "string",
        error.type(EC_INVALID_PRIVATE_KEY, "not string")
    );
    assert(
        isM2EtherPrivateKey(privateKey),
        error.format(EC_INVALID_PRIVATE_KEY, "invalid length or key suffix")
    );

    return new M2EtherKeyPair(new Key(privateKey));
};

const fromSeed = (seed) => {
    assert(typeof seed === "string", error.type(EC_INVALID_SEED, "not string"));
    assert(
        seed.length >= MIN_SEED_LENGTH,
        error.range(EC_INVALID_SEED, "seed length out of range")
    );

    return new M2EtherKeyPair(
        new Key(
            K(seed).toString(16) + SUFFIX_KEY_ETHER_PRIVATE
        )
    );
};

export const m2ether = {
    random,
    fromPrivateKey,
    fromSeed,
};
