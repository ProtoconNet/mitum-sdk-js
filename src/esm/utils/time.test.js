import { TimeStamp } from "./time";

describe("test: time", () => {
	it("case: create timestamp", () => {
		const tcs = [
			{
				m: "2022-11-24 05:05:17.546836 +0000 UTC",
				b: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 52, 32, 48, 53, 58, 48,
					53, 58, 49, 55, 46, 53, 52, 54, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
			},
		];

		tcs.forEach((tc) => {
			const t = new TimeStamp(tc.m);
			t.bytes().forEach((b, i) => expect(b).toBe(tc.b[i]));
		});
	});
});
