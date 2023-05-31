import base58 from "bs58"

import dummy from "../dummy"
import { Amount } from "../../common"
import { TimeStamp } from "../../utils"
import { M2FactSign, Operation, TransfersFact, TransfersItem } from "../../operations"

test("test: operation; memo m2", () => {
	const item = new TransfersItem(dummy.account.a.address, [
		new Amount("MCC", "10000000"),
	])
	const fact = new TransfersFact(
		"2022-12-13 03:24:26.767983 +0000 UTC",
		dummy.genesis.m2.address,
		[item]
	)
	const fs = new M2FactSign(
		"kYJADZP1XKNvUNn7XHY39yisp9QCfU1LtyxGw2HRjQwXmpu",
		Buffer.from(
			base58.decode(
				"AN1rKvsyryVhAw4dXZfWSRXfiFhWuvbtV9mcDLf9WRq8MhfrjdpXjBzC1nxgMyDmSL9FhjCohhcJukfLviJYqpKBDo5Jm2SxD"
			)
		),
		"2022-12-13T03:24:26.768075Z"
	)
	const op = new Operation(fact, "transfers test")
	op.setFactSigns([fs])

	expect(base58.encode(fact.hash)).toBe(
		"Dct6c9pDynFzfc5N4Lcot3LJXwkjuDgQt2okzgnPpT2H"
	)

	expect(base58.encode(op.hash)).toBe(
		"A88QiicaVofkeDMZq172W9DsaxwWF7PpnuLGSzQzoU1r"
	)
})

test("test: operation; duplicate factsigns", () => {
	const item = new TransfersItem(dummy.account.a.address, [
		new Amount("MCC", "10000000"),
	])
	const fact = new TransfersFact(
		new TimeStamp().UTC(),
		dummy.genesis.m1.address,
		[item]
	)
	const op = new Operation(fact)

	const fs = [
		new M2FactSign(
			"kYJADZP1XKNvUNn7XHY39yisp9QCfU1LtyxGw2HRjQwXmpu",
			Buffer.from(
				base58.decode(
					"AN1rKvsyryVhAw4dXZfWSRXfiFhWuvbtV9mcDLf9WRq8MhfrjdpXjBzC1nxgMyDmSL9FhjCohhcJukfLviJYqpKBDo5Jm2SxD"
				)
			),
			new TimeStamp().UTC()
		),
		new M2FactSign(
			"kYJADZP1XKNvUNn7XHY39yisp9QCfU1LtyxGw2HRjQwXmpu",
			Buffer.from(
				base58.decode(
					"AN1rKvsyryVhAw4dXZfWSRXfiFhWuvbtV9mcDLf9WRq8MhfrjdpXjBzC1nxgMyDmSL9FhjCohhcJukfLviJYqpKBDo5Jm2SxD"
				)
			),
			new TimeStamp().UTC()
		)
	]

	expect(() => op.setFactSigns(fs)).toThrow(Error)
})