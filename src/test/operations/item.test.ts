import dummy from "../dummy"
import { Amount } from "../../common"
import { TransfersItem } from "../../operations"

test("test: item; duplicate amounts", () => {
	const am1 = new Amount("MCC", "1")
	const am2 = new Amount("MCC", "10")
	const am3 = new Amount("PEN", "1000")

	expect(() => new TransfersItem(dummy.account.a.address, [am1, am2, am3])).toThrow(Error)
})