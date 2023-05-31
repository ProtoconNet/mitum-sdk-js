import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { Operation, Seal, TransfersFact, TransfersItem } from "../../operations"

const amounts = [new Amount("MCC", "1000"), new Amount("PEN", "1000")]
const item = new TransfersItem(dummy.account.a.address, amounts)
const fact = new TransfersFact(
	new TimeStamp().UTC(),
	dummy.genesis.m1.address,
	[item]
)

test("test: seal operation m1 - seal signed m1", () => {
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	const seal = new Seal([operation])
	expect(() => seal.sign(dummy.nodePriv.m1)).not.toThrow(Error)
})

test("test: seal operation m2", () => {
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m2.private)

	expect(() => new Seal([operation])).toThrow(Error)
})

test("test: seal operation m2-node", () => {
	const operation = new Operation(fact)
	operation.sign(dummy.nodePriv.m2, { node: "node0sas" })

	expect(() => new Seal([operation])).toThrow(Error)
})

test("test: seal operation m1 - unsigned seal dict", () => {
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	const seal = new Seal([operation])
	expect(() => seal.toHintedObject()).not.toThrow(Error)
})

test("test: seal duplicate m1 facts", () => {
	const operation = new Operation(fact)
	operation.sign(dummy.genesis.m1.private)

	expect(() => new Seal([operation, operation])).toThrow(Error)
})