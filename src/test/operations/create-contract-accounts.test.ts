import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { Keys, PubKey } from "../../key"
import { CreateContractAccountsFact, CreateContractAccountsItem, Operation } from "../../operations"

test("test: create-contract-accounts; m1 operation", () => {
	const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
	const keys = new Keys([new PubKey(dummy.account.a.public, 100)], 100)
	const item = new CreateContractAccountsItem(keys, amounts)
	const fact = new CreateContractAccountsFact(
		"2022-11-16T06:59:44.986806Z",
		dummy.genesis.m1.address,
		[item]
	)
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	expect(base58.encode(fact.hash)).toBe(
		"79MQkuRZW26k4YXT7xhADF2JwJW4geMfFCVmwNcLsp4Q"
	)

	expect(keys.address.toString()).toBe(dummy.account.a.address)
})

// it("case: m2 operation", () => {})

it("test: create-contract-accounts; duplicate items", () => {
	const amounts = [new Amount("MCC", "1000")]
	const keys = new Keys([new PubKey(dummy.account.a.public, 100)], 100)

	const items = [
		new CreateContractAccountsItem(keys, amounts),
		new CreateContractAccountsItem(keys, amounts),
	]

	expect(
		() =>
			new CreateContractAccountsFact(
				new TimeStamp().UTC(),
				dummy.genesis.m1.address,
				items
			)
	).toThrow(Error)
})