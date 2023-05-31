import base58 from "bs58"

import dummy from "../dummy"
import {
	CurrencyPolicy, CurrencyPolicyUpdaterFact, Operation,
	NilFeeer, FixedFeeer, RatioFeeer,
} from "../../operations"

test("test: currency-policy-updater; m1 nil feeer", () => {
	const feeer = new NilFeeer()
	const policy = new CurrencyPolicy("33", feeer)

	const fact = new CurrencyPolicyUpdaterFact(
		"2022-11-16T06:46:44.06812Z",
		"PEN",
		policy
	)
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m1)

	expect(base58.encode(fact.hash)).toBe(
		"5Mhz2DfpQ51G3SyNLcLgmCbp8yx5o53ykwre7DidT3Rr"
	)
})

test("test: currency-policy-updater; m1 fixed feeer", () => {
	const feeer = new FixedFeeer(dummy.genesis.m1.address, "999")
	const policy = new CurrencyPolicy("33", feeer)

	const fact = new CurrencyPolicyUpdaterFact(
		"2022-11-16T06:48:54.046555Z",
		"PEN",
		policy
	)
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m1)

	expect(base58.encode(fact.hash)).toBe(
		"4n6AxV17j2oMmQhk1qMqTWzd3dUuEW45v88aLmisoCgy"
	)
})

test("test:currency-policy-updater;  m1 ratio feeer", () => {
	const feeer = new RatioFeeer(
		dummy.genesis.m1.address,
		0.5,
		"1",
		"99"
	)
	const policy = new CurrencyPolicy("33", feeer)

	const fact = new CurrencyPolicyUpdaterFact(
		"2022-11-16T06:51:18.841996Z",
		"PEN",
		policy
	)
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m1)

	expect(base58.encode(fact.hash)).toBe(
		"4h8RXMBj9qpEiWe3JrdnazhasuwVcBnyvVVNj8G3usrp"
	)
})