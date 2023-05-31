import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { Operation, SuffrageInflationFact, SuffrageInflationItem } from "../../operations"

test("test: suffrage-inflation m1 - operation", () => {
	const items = [
		new SuffrageInflationItem(
			dummy.genesis.m1.address,
			new Amount("MCC", "9999999999999999999999")
		),
		new SuffrageInflationItem(
			dummy.genesis.m1.address,
			new Amount("PEN", "9999999999999999999999")
		),
	]

	const fact = new SuffrageInflationFact(
		"2022-11-16T06:55:02.135231Z",
		items
	)
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m1)

	expect(base58.encode(fact.hash)).toBe(
		"FcP5ciHKkhogkskiYiaVCTP4JZ7zr4UH2cMRJqhhzEgV"
	)
})

test("test: suffrage-inflation duplicate items", () => {
	const items = [
		new SuffrageInflationItem(
			dummy.genesis.m1.address,
			new Amount("MCC", "9999999999999999999999")
		),
		new SuffrageInflationItem(
			dummy.genesis.m1.address,
			new Amount("MCC", "9999999999999999999999")
		),
	]

	expect(
		() => new SuffrageInflationFact(new TimeStamp().UTC(), items)
	).toThrow(Error)
})