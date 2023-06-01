import dummy from "../dummy"
import { Amount } from "../../common"
import { Signer } from "../../operations/signer"
import { M1KeyPair, M2KeyPair } from "../../key"
import { Operation, SuffrageInflationFact, SuffrageInflationItem, TransfersFact, TransfersItem } from "../../operations"

it("test: signer; m1 - no sign", () => {
    const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
    const item = new TransfersItem(dummy.account.a.address, amounts)
    const fact = new TransfersFact(
        "2022-11-16T06:26:07.47499Z",
        dummy.genesis.m1.address,
        [item]
    )

    const operation = new Operation(fact)

    const signer = new Signer(dummy.genesis.m1.private)
    expect(() => signer.sign(operation.toHintedObject())).not.toThrow(Error)
})

test("test: signer; m1 - with sign", () => {
    const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
    const item = new TransfersItem(dummy.account.a.address, amounts)
    const fact = new TransfersFact(
        "2022-11-16T06:26:07.47499Z",
        dummy.genesis.m1.address,
        [item]
    )

    const operation = new Operation(fact)
    operation.sign(dummy.genesis.m1.private)

    const signer = new Signer(M1KeyPair.random().privateKey.toString())
    expect(() => signer.sign(operation.toHintedObject())).not.toThrow(Error)
})

test("test: signer; m2 - no sign", () => {
    const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
    const item = new TransfersItem(dummy.account.a.address, amounts)
    const fact = new TransfersFact(
        "2022-11-16T06:26:07.47499Z",
        dummy.genesis.m2.address,
        [item]
    )

    const operation = new Operation(fact)

    const signer = new Signer(dummy.genesis.m2.private)
    expect(() => signer.sign(operation.toHintedObject())).not.toThrow(Error)
})

test("test: signer; m2 - with sign", () => {
    const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
    const item = new TransfersItem(dummy.account.a.address, amounts)
    const fact = new TransfersFact(
        "2022-11-16T06:26:07.47499Z",
        dummy.genesis.m2.address,
        [item]
    )

    const operation = new Operation(fact)
    operation.sign(dummy.genesis.m2.private)

    const signer = new Signer(M2KeyPair.random().privateKey.toString())
    expect(() => signer.sign(operation.toHintedObject())).not.toThrow(Error)
})

test("case: m2 node - no sign", () => {
    const items = [
        new SuffrageInflationItem(
            dummy.genesis.m2.address,
            new Amount("MCC", "9999999999999999999999")
        ),
        new SuffrageInflationItem(
            dummy.genesis.m2.address,
            new Amount("PEN", "9999999999999999999999")
        ),
    ]

    const fact = new SuffrageInflationFact(
        "2022-11-16T06:55:02.135231Z",
        items
    )
    const operation = new Operation(fact)

    const signer = new Signer(dummy.nodePriv.m2)
    expect(() =>
        signer.sign(operation.toHintedObject(), { node: "node0sas" })
    ).not.toThrow(Error)
})

test("test: signer; m2 node - with sign", () => {
    const items = [
        new SuffrageInflationItem(
            dummy.genesis.m2.address,
            new Amount("MCC", "9999999999999999999999")
        ),
        new SuffrageInflationItem(
            dummy.genesis.m2.address,
            new Amount("PEN", "9999999999999999999999")
        ),
    ]

    const fact = new SuffrageInflationFact(
        "2022-11-16T06:55:02.135231Z",
        items
    )
    const operation = new Operation(fact)
    operation.sign(dummy.nodePriv.m2, { node: "node0sas" })

    const signer = new Signer(M2KeyPair.random().privateKey.toString())
    expect(() =>
        signer.sign(operation.toHintedObject(), { node: "node2sas" })
    ).not.toThrow(Error)
})