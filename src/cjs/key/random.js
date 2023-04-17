const m1 = require("./m1-keypair.js");
const m2 = require("./m2-keypair.js");
const m2ether = require("./m2-ether-keypair.js");

const { Keys, PublicKey } = require("./key.js");

const { MAX_KEYS_IN_ADDRESS, MAX_THRESHOLD } = require("../mitum.config.js");

const randomN = (n, f) => {
    if (typeof n !== "number") {
        return null;
    }

    if (n < 1 || n > MAX_KEYS_IN_ADDRESS) {
        return null;
    }

    let weight = Math.floor(MAX_THRESHOLD / n);
    if (MAX_THRESHOLD % n) {
        weight += 1;
    }

    const ks = [];
    const kps = [];
    for (let i = 0; i < n; i++) {
        kps.push(f());
        ks.push(new PublicKey(kps[i].publicKey.toString(), weight));
    }

    return {
        keys: new Keys(ks, MAX_THRESHOLD),
        keypairs: kps,
    };
};

export const M1RandomN = (n) => {
    return randomN(n, m1.random);
};

export const M2RandomN = (n) => {
    return randomN(n, m2.random);
};

export const M2EtherRandomN = (n) => {
    return randomN(n, m2ether.random);
};