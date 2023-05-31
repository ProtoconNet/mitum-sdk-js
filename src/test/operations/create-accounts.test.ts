import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { Keys, PubKey } from "../../key"
import { CreateAccountsFact, CreateAccountsItem, Operation } from "../../operations"

test("test: create-accounts; m1 operation", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
	const keys = new Keys([new PubKey(dummy.account.a.public, 100)], 100)
	const fact = new CreateAccountsFact(
		"2022-11-16T06:05:14.889691Z",
		dummy.genesis.m1.address,
		[new CreateAccountsItem(keys, amounts)]
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	expect(base58.encode(fact.hash)).toBe(
		"3YQ6tUgKBKq6HdjREeFTVBYrTDWiTQEYARv6HX8wyQZP"
	)
	expect(keys.address.toString()).toBe(dummy.account.a.address)
})

test("test: create-accounts; m2 operation", () => {
	const amounts = [new Amount("MCC", "1000")]
	const keys = new Keys([new PubKey(dummy.account.b.public, 100)], 100)
	const fact = new CreateAccountsFact(
		"2022-10-25 03:52:32.461515 +0000 UTC",
		dummy.genesis.m2.address,
		[new CreateAccountsItem(keys, amounts, "btc")]
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m2.private)

	expect(base58.encode(fact.hash)).toBe(
		"4hQnx3YTV4YGNXfoDYDUdx5Q1inFgzNAc8wy6dVoaDAd"
	)
	expect(keys.address.toString()).toBe(dummy.account.b.address)
})

test("test: create-accounts; m2 - ether operation", () => {
	const amounts = [new Amount("MCC", "1000")]
	const keys = new Keys([new PubKey(dummy.account.eth.public, 100)], 100)
	const fact = new CreateAccountsFact(
		"2022-10-25 03:52:32.461515 +0000 UTC",
		dummy.genesis.m2ether.address,
		[new CreateAccountsItem(keys, amounts, "ether")]
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m2ether.private)

	expect(base58.encode(fact.hash)).toBe(
		"7QBsdU2pRXc4vTZAdHKtPi4Ct7NyHiEudyGiErZnHNRj"
	)
	expect(keys.etherAddress.toString()).toBe(dummy.account.eth.address)
})

test("test: create-accounts; duplicate items", () => {
	const amounts = [new Amount("MCC", "1000")]
	const keys = new Keys([new PubKey(dummy.account.b.public, 100)], 100)

	const items = [
		new CreateAccountsItem(keys, amounts),
		new CreateAccountsItem(keys, amounts),
	]

	expect(
		() =>
			new CreateAccountsFact(
				new TimeStamp().UTC(),
				dummy.genesis.m2.address,
				items
			)
	).toThrow(Error)
})