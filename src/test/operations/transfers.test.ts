import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { Operation, TransfersFact, TransfersItem } from "../../operations"

test("test: transfers m1 - operation", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
	const item = new TransfersItem(dummy.account.a.address, amounts)
	const fact = new TransfersFact(
		"2022-11-16T06:26:07.47499Z",
		dummy.genesis.m1.address,
		[item]
	)

	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	expect(base58.encode(fact.hash)).toBe(
		"GTXjBCvb183KaCtiprpjC4e4XDor6XeBfijZfqwMPsBx"
	)
})

test("test: transfers m2 - operation", () => {
	const amounts = [new Amount("MCC", "1000")]
	const item = new TransfersItem(dummy.account.b.address, amounts)
	const fact = new TransfersFact(
		"2022-11-19 23:44:30.883651 +0000 UTC",
		dummy.genesis.m2.address,
		[item]
	)

	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m2.private)

	expect(base58.encode(fact.hash)).toBe(
		"k1vnR6xnWBPoehfZGcbnfXBD8yZRmT4jsGfquRUPzjx"
	)
})

test("test: transfers transfer to zero address", () => {
	const amounts = [new Amount(dummy.currency.MCC.currency, "1000")]
	const item = new TransfersItem(dummy.currency.MCC.zero, amounts)
	const fact = new TransfersFact(
		"2022-11-19 23:44:30.883651 +0000 UTC",
		dummy.genesis.m2.address,
		[item]
	)

	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m2.private)

	expect(base58.encode(fact.hash)).toBe(
		"5F1hhzhi7rtjJmjdbUjDkio8niGiftKJLCxqAmXWvkDv"
	)
})

test("test: transfers duplicate items", () => {
	const items = [
		new TransfersItem(dummy.account.a.address, [
			new Amount("MCC", "1000"),
		]),
		new TransfersItem(dummy.account.a.address, [
			new Amount("PEN", "1000"),
		]),
	]

	expect(
		() =>
			new TransfersFact(
				new TimeStamp().UTC(),
				dummy.genesis.m1.address,
				items
			)
	).toThrow(Error)
})