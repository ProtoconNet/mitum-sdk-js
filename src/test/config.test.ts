import base58 from "bs58"

import dummy from "./dummy"

import { Amount } from "../common"
import { TimeStamp } from "../utils"
import { Keys, PubKey } from "../key"
import { NetworkID, Version } from "../config"
import { CreateAccountsFact, CreateAccountsItem, Operation } from "../operations"

test("test: config; version", () => {
    const version2 = "v0.0.2"
    const version1 = "v0.0.1"

    Version.set(version2)

    let amountHint = new Amount("MCC", "100").toHintedObject()._hint
    let key = new PubKey(dummy.account.a.public, 100)
    let keysHint = new Keys([key], 100).toHintedObject()._hint
    let keyHint = key.toHintedObject()._hint
    expect(amountHint && amountHint.substring(amountHint.length - 6)).toBe(version2)
    expect(keyHint && keyHint.substring(keyHint.length - 6)).toBe(version2)
    expect(keysHint && keysHint.substring(keysHint.length - 6)).toBe(version2)

    Version.set(version1)
    amountHint = new Amount("MCC", "100").toHintedObject()._hint
    key = new PubKey(dummy.account.a.public, 100)
    keysHint = new Keys([key], 100).toHintedObject()._hint
    keyHint = key.toHintedObject()._hint
    expect(amountHint && amountHint.substring(amountHint.length - 6)).toBe(version1)
    expect(keyHint && keyHint.substring(keyHint.length - 6)).toBe(version1)
    expect(keysHint && keysHint.substring(keysHint.length - 6)).toBe(version1)
})

test("test: config; id", () => {
    const id1 = "mitum"
    const id2 = "mainnet"

    const amount = new Amount("MCC", "100")
    const key = new PubKey(dummy.account.a.public, 100)
    const keys = new Keys([key], 100)
    const item = new CreateAccountsItem(keys, [amount])
    const fact = new CreateAccountsFact(
        new TimeStamp().UTC(),
        dummy.genesis.m1.address,
        [item]
    )

    NetworkID.set(id1)
    const operation1 = new Operation(fact)
    operation1.sign(dummy.genesis.m1.private)

    NetworkID.set(id2)
    const operation2 = new Operation(fact)
    operation2.sign(dummy.genesis.m1.private)

    NetworkID.set(id1)
    const operation3 = new Operation(fact)
    operation3.sign(dummy.genesis.m1.private)

    expect(operation1.id.toString()).toBe(id1)
    expect(operation2.id.toString()).toBe(id2)
    expect(operation3.id.toString()).toBe(id1)

    expect(base58.encode(operation1.factSigns[0].signature)).not.toBe(
        base58.encode(operation2.factSigns[0].signature)
    )
    expect(base58.encode(operation1.factSigns[0].signature)).toBe(
        base58.encode(operation3.factSigns[0].signature)
    )
})