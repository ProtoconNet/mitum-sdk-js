import { TimeStamp } from "./time";

describe("test: time", () => {
	it("case: create factsign", () => {
		const tcs = [
			{
				m: "2022-11-04 15:13:45.203155 +0900",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 48, 52, 32, 48, 54, 58, 49,
					51, 58, 52, 53, 46, 50, 48, 51, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
			},
			{
				m: "2022-11-04 15:13:45.203161 +0900",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 48, 52, 32, 48, 54, 58, 49,
					51, 58, 52, 53, 46, 50, 48, 51, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
			},
			{
				m: "2022-11-04 15:13:45.203163 +0900",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 48, 52, 32, 48, 54, 58, 49,
					51, 58, 52, 53, 46, 50, 48, 51, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
			},
			{
				m: "2022-11-04 15:13:45.203167 +0900",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 48, 52, 32, 48, 54, 58, 49,
					51, 58, 52, 53, 46, 50, 48, 51, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
			},
			{
				m: "2022-11-04 15:13:45.203165 +0900",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 48, 52, 32, 48, 54, 58, 49,
					51, 58, 52, 53, 46, 50, 48, 51, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
			},
		];

		tcs.forEach((tc) => {
			const t = new TimeStamp(tc.m);
			t.bytes().forEach((b, i) => expect(b === tc.b[i]));
		});
	});
});