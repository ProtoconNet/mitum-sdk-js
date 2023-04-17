const bs58 = require("bs58");

const { TEST_ACCOUNT, TEST_GENESIS } = require("../mitum.config");

const { M1FactSign, M2FactSign } = require("./factsign");
const { Operation } = require("./operation");

const { Amount } = require("./currency/amount");
const { TransfersFact, TransfersItem } = require("./currency/transfers");
const { TimeStamp } = require("../utils/time");

describe("test: operation", () => {
	it("case: memo; m2", () => {
		const item = new TransfersItem(TEST_ACCOUNT.address, [
			new Amount("MCC", "10000000"),
		]);
		const fact = new TransfersFact(
			"2022-12-13 03:24:26.767983 +0000 UTC",
			TEST_GENESIS.m2.address,
			[item]
		);
		const fs = new M2FactSign(
			"kYJADZP1XKNvUNn7XHY39yisp9QCfU1LtyxGw2HRjQwXmpu",
			Buffer.from(
				bs58.decode(
					"AN1rKvsyryVhAw4dXZfWSRXfiFhWuvbtV9mcDLf9WRq8MhfrjdpXjBzC1nxgMyDmSL9FhjCohhcJukfLviJYqpKBDo5Jm2SxD"
				)
			),
			"2022-12-13T03:24:26.768075Z"
		);
		const op = new Operation(fact, "transfers test");
		op.setFactSigns([fs]);

		expect(bs58.encode(fact.hash)).toBe(
			"Dct6c9pDynFzfc5N4Lcot3LJXwkjuDgQt2okzgnPpT2H"
		);
		expect(bs58.encode(op.hash)).toBe(
			"A88QiicaVofkeDMZq172W9DsaxwWF7PpnuLGSzQzoU1r"
		);
	});

	it("case: duplicate fact signs", () => {
		const item = new TransfersItem(TEST_ACCOUNT.address, [
			new Amount("MCC", "10000000"),
		]);
		const fact = new TransfersFact(
			new TimeStamp().UTC(),
			TEST_GENESIS.m1.address,
			[item]
		);
		const op = new Operation(fact);

		const fs = [];
		for (let i = 0; i < 2; i++) {
			fs.push(
				new M1FactSign(
					"kYJADZP1XKNvUNn7XHY39yisp9QCfU1LtyxGw2HRjQwXmpu",
					Buffer.from(
						bs58.decode(
							"AN1rKvsyryVhAw4dXZfWSRXfiFhWuvbtV9mcDLf9WRq8MhfrjdpXjBzC1nxgMyDmSL9FhjCohhcJukfLviJYqpKBDo5Jm2SxD"
						)
					),
					new TimeStamp().UTC()
				)
			);
		}

		expect(() => op.setFactSigns(fs)).toThrow(Error);
	});
});
