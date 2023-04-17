const bs58 = require("bs58");

const { M1FactSign, M2FactSign, M2NodeFactSign } = require("./factsign.js");

const {
    error,
    assert,
    EC_INVALID_FACTSIGN,
    EC_INVALID_OPERATION,
    EC_INVALID_PRIVATE_KEY,
    EC_INVALID_NETWORK_ID,
} = require("../base/error.js");
const { ID } = require("../base/ID.js");

const { Address } = require("../key/address.js");

const { id } = require("../utils/config.js");
const { sum256 } = require("../utils/hash.js");
const { exist, findKeyPair } = require("../utils/tools.js");
const { FullTimeStamp, TimeStamp } = require("../utils/time.js");

exports.Signer = class Signer {
    constructor(privateKey) {
        this.kp = findKeyPair(privateKey);
        this.id = new ID(id(), EC_INVALID_NETWORK_ID);
    }

    sign(json) {
        this.checkOperation(json);

        const now = new TimeStamp();

        if (this.kp.type === "m1") {
            const fs = new M1FactSign(
                this.kp.keypair.publicKey.toString(),
                this.kp.keypair.sign(
                    Buffer.concat([json.fact.hash, this.id.bytes()])
                ),
                now.toString()
            );

            assert(
                fs != null,
                error.runtime(
                    EC_INVALID_FACTSIGN,
                    "failed to add sign to operation"
                )
            );

            if (exist(json, "fact_signs")) {
                json.fact_signs = [...json.fact_signs, fs];
            } else {
                json.fact_signs = [fs];
            }

            const factSigns = json.fact_signs
                .map((s) =>
                    Buffer.concat([
                        Buffer.from(s.signer),
                        bs58.decode(s.signature),
                        new FullTimeStamp(s.signed_at).hashBytes(),
                    ])
                )
                .sort((a, b) => Buffer.compare(a, b));

            const msg = Buffer.concat([
                bs58.decode(json.fact.hash),
                Buffer.concat(factSigns),
                Buffer.from(exist(json, "memo") ? json.memo : ""),
            ]);

            json.hash = sum256(msg);
        } else if (["m2", "m2ether"].includes(this.kp.type)) {
            const fs = new M2FactSign(
                this.kp.keypair.publicKey.toString(),
                this.kp.keypair.sign(
                    Buffer.concat([
                        this.id.bytes(),
                        json.fact.hash,
                        now.bytes(),
                    ])
                ),
                now.toString()
            );

            assert(
                fs != null,
                error.runtime(
                    EC_INVALID_FACTSIGN,
                    "failed to add sign to operation"
                )
            );

            if (exist(json, "signs")) {
                assert(
                    Array.isArray(json.signs),
                    error.format(EC_INVALID_OPERATION, "signs not Array")
                );
                json.signs.forEach((sign) =>
                    assert(
                        !exist(sign, "node"),
                        error.runtime(
                            EC_INVALID_FACTSIGN,
                            "node signature found"
                        )
                    )
                );

                json.signs = [...json.signs, fs];
            } else {
                json.signs = [fs];
            }

            const factSigns = json.fact_signs
                .map((s) =>
                    Buffer.concat([
                        Buffer.from(s.signer),
                        bs58.decode(s.signature),
                        new FullTimeStamp(s.signed_at).hashBytes(),
                    ])
                )
                .sort((a, b) => Buffer.compare(a, b));

            const msg = Buffer.concat([
                bs58.decode(json.fact.hash),
                Buffer.concat(factSigns),
            ]);

            json.hash = sum256(msg);
        }

        return json;
    }

    M2NodeSign(json, node) {
        this.checkOperation(json);

        assert(
            ["m2", "m2ether"].includes(this.kp.type),
            error.runtime(EC_INVALID_PRIVATE_KEY, "not m2 private key")
        );

        const nd = new Address(node);

        const now = new TimeStamp();

        const fs = new M2NodeFactSign(
            nd.toString(),
            this.kp.keypair.publicKey.toString(),
            this.kp.keypair.sign(
                Buffer.concat([
                    this.id.bytes(),
                    nd.bytes(),
                    bs58.decode(json.fact.hash),
                    now.bytes(),
                ])
            ),
            now.toString()
        );

        assert(
            fs != null,
            error.runtime(
                EC_INVALID_FACTSIGN,
                "failed to add sign to operation"
            )
        );

        if (exist(json, "signs")) {
            assert(
                Array.isArray(json.signs),
                error.format(EC_INVALID_OPERATION, "signs not Array")
            );
            json.signs.forEach((sign) =>
                assert(
                    exist(sign, "node"),
                    error.runtime(EC_INVALID_FACTSIGN, "not node signature")
                )
            );

            json.signs = [...json.signs, fs];
        } else {
            json.signs = [fs];
        }

        const factSigns = json.signs
            .map((s) =>
                Buffer.concat([
                    Buffer.from(s.signer),
                    bs58.decode(s.signature),
                    new FullTimeStamp(s.signed_at).hashBytes(),
                ])
            )
            .sort((a, b) => Buffer.compare(a, b));

        const msg = Buffer.concat([
            bs58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);

        json.hash = sum256(msg);

        return json;
    }

    checkOperation(json) {
        assert(json != null, error.runtime(EC_INVALID_OPERATION, "empty json"));
        assert(
            exist(json, "fact"),
            error.runtime(EC_INVALID_OPERATION, "invalid operation - no fact")
        );
        assert(
            exist(json.fact, "hash"),
            error.runtime(
                EC_INVALID_OPERATION,
                "invalid operation - no fact hash"
            )
        );
        assert(
            exist(
                json,
                "hash",
                error.runtime(
                    EC_INVALID_OPERATION,
                    "invalid operation - no hash"
                )
            )
        );

        if (exist(json, "fact_signs")) {
            assert(
                this.kp.type === "m1",
                error.runtime(EC_INVALID_PRIVATE_KEY, "not m1 private key")
            );
        } else if (exist(json, "signs")) {
            assert(
                ["m2", "m2ether"].includes(this.kp.type),
                error.runtime(EC_INVALID_PRIVATE_KEY, "not m2 private key")
            );
        }
    }
}