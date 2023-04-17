import { Signer } from "./signer";
import { Operation } from "./operation";

import { Amount } from "./currency/amount";
import { TransfersFact, TransfersItem } from "./currency/transfers";
import {
    SuffrageInflationFact,
    SuffrageInflationItem,
} from "./currency/suffrage-inflation";

import { TEST_ACCOUNT, TEST_GENESIS, TEST_NODE } from "../mitum.config";

import { m1 } from "../key/m1-keypair";
import { m2 } from "../key/m2-keypair";

describe("test: signer", () => {
    it("case: m1; no sign", () => {
        const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")];
        const item = new TransfersItem(TEST_ACCOUNT.address, amounts);
        const fact = new TransfersFact(
            "2022-11-16T06:26:07.47499Z",
            TEST_GENESIS.m1.address,
            [item]
        );

        const operation = new Operation(fact);

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

        const operation = new Operation(fact);
        operation.sign(TEST_GENESIS.m1.private);

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

        const operation = new Operation(fact);

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

        const operation = new Operation(fact);
        operation.sign(TEST_GENESIS.m2.private);

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
        const operation = new Operation(fact);

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
        const operation = new Operation(fact);
        operation.sign(TEST_NODE.m2, { node: "node0sas" });

        const signer = new Signer(m2.random().privateKey.toString());
        expect(() =>
            signer.M2NodeSign(operation.dict(), "node2sas")
        ).not.toThrow(Error);
    });
});
