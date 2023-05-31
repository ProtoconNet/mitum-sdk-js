import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { Operation, WithdrawsFact, WithdrawsItem } from "../../operations"

test("test: withdraws m1 - operation", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
	const item = new WithdrawsItem(dummy.account.a.address, amounts)

	const fact = new WithdrawsFact(
		"2022-11-16T07:03:47.411489Z",
		dummy.genesis.m1.address,
		[item]
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	expect(base58.encode(fact.hash)).toBe(
		"ApAZLELnH8iYHtThDJk5dtr4Ni7TvDfJT4XHU4Z8gHM5"
	)
})

test("test: withdraws duplicate items", () => {
	const items = [
		new WithdrawsItem(dummy.account.a.address, [
			new Amount("MCC", "1000"),
		]),
		new WithdrawsItem(dummy.account.a.address, [
			new Amount("PEN", "1000"),
		]),
	]

	expect(
		() =>
			new WithdrawsFact(
				new TimeStamp().UTC(),
				dummy.genesis.m1.address,
				items
			)
	).toThrow(Error)
})