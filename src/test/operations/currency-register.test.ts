import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import {
	CurrencyDesign, CurrencyPolicy,
	CurrencyRegisterFact, Operation,
	NilFeeer, FixedFeeer, RatioFeeer,
} from "../../operations"

test("test: currency-register m1 - nil feeer", () => {
	const feeer = new NilFeeer()
	const policy = new CurrencyPolicy("33", feeer)

	const amount = new Amount("PEN", "99999999999999999999999")
	const design = new CurrencyDesign(
		amount,
		dummy.genesis.m1.address,
		policy
	)

	const fact = new CurrencyRegisterFact(
		"2022-11-24T02:17:37.256409Z",
		design
	)
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m1)

	expect(base58.encode(fact.hash)).toBe(
		"3AtsTvXxZ3BYczqAYZAqbV7y76UW4mCEipvV4jWH7B4h"
	)
})

test("test: currency-register m1 - fixed feeer", () => {
	const feeer = new FixedFeeer(dummy.genesis.m1.address, "999")
	const policy = new CurrencyPolicy("33", feeer)

	const amount = new Amount("PEN", "99999999999999999999999")
	const design = new CurrencyDesign(
		amount,
		dummy.genesis.m1.address,
		policy
	)

	const fact = new CurrencyRegisterFact(
		"2022-11-16T06:35:43.649604Z",
		design
	)
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m1)

	expect(base58.encode(fact.hash)).toBe(
		"6j3PN6oPof46vyoUjDxMnEr5JCdco2b5USapBYLLf1xh"
	)
})

test("test: currency-register m1 - ratio feeer", () => {
	const ratio = (n: number, token: string) => {
		const feeer = new RatioFeeer(
			dummy.genesis.m1.address,
			n,
			"1",
			"99"
		)
		const policy = new CurrencyPolicy("33", feeer)

		const amount = new Amount("PEN", "99999999999999999999999")
		const design = new CurrencyDesign(
			amount,
			dummy.genesis.m1.address,
			policy
		)

		const fact = new CurrencyRegisterFact(token, design)
		const operation = new Operation(fact)
		operation.sign(dummy.nodePriv.m1)

		return base58.encode(fact.hash)
	}

	const r0 = ratio(0, "2022-11-16T06:42:44.505842Z")
	const r1 = ratio(0.5, "2022-11-16T06:38:44.472Z")
	const r2 = ratio(1, "2022-11-16T06:44:19.856767Z")

	expect(r0).toBe("Dai6Wt9kqb8Mztt8uVspZZJYw3QsTmccxKQzqC5hPCCR")
	expect(r1).toBe("8RihHh7jYDcG8fMi1KHnVdm6YVHYiBKN3iVpvPoysPw2")
	expect(r2).toBe("DLsvsfkRGpHXrMXSyxYMGGmT48Jhhuro4bVNSojHJ7DB")
})