const { Signer } = require("./signer");
const { Operation } = require("./operation");

const { Amount } = require("./currency/amount");
const { TransfersFact, TransfersItem } = require("./currency/transfers");
const {
    SuffrageInflationFact,
    SuffrageInflationItem,
} = require("./currency/suffrage-inflation");

const { TEST_ACCOUNT, TEST_GENESIS, TEST_NODE } = require("../mitum.config");

const m1 = require("../key/m1-keypair");
const m2 = require("../key/m2-keypair");

describe("test: signer", () => {
    it("case: m1; no sign", () => {
        const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
        const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
        const fact = new TransfersFact(
            "2022-11-16T06:26:07.47499Z",
            TEST_GENESIS.m1.address,
            [item]
        );

        const operation = new Operation(fact, "");

        const signer = new Signer(TEST_GENESIS.m1.private);
        expect(() => signer.sign(operation.dict())).not.toThrow(Error);
    });

    it("case: m1; with sign", () => {
        const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
        const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
        const fact = new TransfersFact(
            "2022-11-16T06:26:07.47499Z",
            TEST_GENESIS.m1.address,
            [item]
        );

        const operation = new Operation(fact, "");
        operation.sign(TEST_GENESIS.m1.private, null);

        const signer = new Signer(m1.random().privateKey.toString());
        expect(() => signer.sign(operation.dict())).not.toThrow(Error);
    });

    it("case: m2; no sign", () => {
        const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
        const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
        const fact = new TransfersFact(
            "2022-11-16T06:26:07.47499Z",
            TEST_GENESIS.m2.address,
            [item]
        );

        const operation = new Operation(fact, "");

        const signer = new Signer(TEST_GENESIS.m2.private);
        expect(() => signer.sign(operation.dict())).not.toThrow(Error);
    });

    it("case: m2; with sign", () => {
        const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
        const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
        const fact = new TransfersFact(
            "2022-11-16T06:26:07.47499Z",
            TEST_GENESIS.m2.address,
            [item]
        );

        const operation = new Operation(fact, "");
        operation.sign(TEST_GENESIS.m2.private, null);

        const signer = new Signer(m2.random().privateKey.toString());
        expect(() => signer.sign(operation.dict())).not.toThrow(Error);
    });

    it("case: m2 node; no sign", () => {
        const items = [
            new SuffrageInflationItem(
                TEST_GENESIS.m2.address,
                new Amount("MCC", "9999999999999999999999")
            ),
            new SuffrageInflationItem(
                TEST_GENESIS.m2.address,
                new Amount("PEN", "9999999999999999999999")
            ),
        ];

        const fact = new SuffrageInflationFact(
            "2022-11-16T06:55:02.135231Z",
            items
        );
        const operation = new Operation(fact, "");

        const signer = new Signer(TEST_NODE.m2);
        expect(() =>
            signer.M2NodeSign(operation.dict(), "node0sas")
        ).not.toThrow(Error);
    });

    it("case: m2 node; with sign", () => {
        const items = [
            new SuffrageInflationItem(
                TEST_GENESIS.m2.address,
                new Amount("MCC", "9999999999999999999999")
            ),
            new SuffrageInflationItem(
                TEST_GENESIS.m2.address,
                new Amount("PEN", "9999999999999999999999")
            ),
        ];

        const fact = new SuffrageInflationFact(
            "2022-11-16T06:55:02.135231Z",
            items
        );
        const operation = new Operation(fact, "");
        operation.sign(TEST_NODE.m2, { node: "node0sas" });

        const signer = new Signer(m2.random().privateKey.toString());
        expect(() =>
            signer.M2NodeSign(operation.dict(), "node2sas")
        ).not.toThrow(Error);
    });
});
