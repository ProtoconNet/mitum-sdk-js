import bs58 from "bs58";

import { m2 } from "../key/m2-keypair";
import { TimeStamp } from "../utils/time";

describe("test: factsign", () => {
	it("case: m1", () => {});

	it("case: m2", () => {
		const tcs = [
			{
				now: "2022-11-24 03:43:57.251403 +0000 UTC",
				nbytes: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 52, 32, 48, 51, 58, 52,
					51, 58, 53, 55, 46, 50, 53, 49, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
				msg: "kiY4uUs2BMAZnU5NfPMra3FGwfNGxSWtwSuhMCHnmhu3mpu",
				key: "CjQqpGfbEr3efue2LyVSwBFRLbKV6hvC5WFVjrfUp9Uhmpr",
				sign: "381yXYmCy3hVPZwHckexGkohuP9yhnxqrETcdhTUvSj6hpQdfVps161XNab8MQLRrKwp4Z52qsR4tTHwW9q81bFhvMZxCUKZ",
			},
			{
				now: "2022-11-24 03:43:57.251531 +0000 UTC",
				nbytes: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 52, 32, 48, 51, 58, 52,
					51, 58, 53, 55, 46, 50, 53, 49, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
				msg: "28W5VfMq1PQ9X6tioq5SQveEUehmgPCEZBZQsrruFtjUQmpu",
				key: "FvYXpN51pevfZUaH3V9W3jcpiYiNMbhrCyiWJNJMoNifmpr",
				sign: "AN1rKvtRvXwBhHAugtHoUwymQ6kBw6JuoNkLm1EXoqyruQdGbEFRSqSxZHbnuCKvJnzZhNJkhxMtdNFLDyr8EQjA2VPz3jUHP",
			},
			{
				now: "2022-11-24 03:43:57.251637 +0000 UTC",
				nbytes: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 52, 32, 48, 51, 58, 52,
					51, 58, 53, 55, 46, 50, 53, 49, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
				msg: "rzBYimWA38PRN5AhQUw6RDDU6vQCxgAe6775VtmZJhqJmpu",
				key: "8V6F3t8KHePtmbES2XR6GCSN6wAozPJaAWXS877ZwQFempr",
				sign: "381yXZPed5fZ2xB2Q9f2853sASYWLgVgsgKR6P5pM3wCFgzdVEujCM5JbuNCsjtkHncHBEseaHRp3CmP8u39wWyLZ3XJGiEK",
			},
			{
				now: "2022-11-24 03:43:57.251747 +0000 UTC",
				nbytes: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 52, 32, 48, 51, 58, 52,
					51, 58, 53, 55, 46, 50, 53, 49, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
				msg: "sC9e2ah6B3HcMrkBqwAWqmMjKoCBAxxPnsMGpt8ShaSAmpu",
				key: "7E7CjmV99hxA6tHDg98gA3Lh5RUmrTRho1Rmj5sfSWb6mpr",
				sign: "AN1rKvtWyZvex1A2SEoa11e5VCV4vU5ZyczsUjB2vo45Zdrp8jiSzXJGa2bN3Vt8eXBXLYiYZ1PH22UiFEmwB44a7oCUzpgXi",
			},
			{
				now: "2022-11-24 03:43:57.251855 +0000 UTC",
				nbytes: [
					50, 48, 50, 50, 45, 49, 49, 45, 50, 52, 32, 48, 51, 58, 52,
					51, 58, 53, 55, 46, 50, 53, 49, 32, 43, 48, 48, 48, 48, 32,
					85, 84, 67,
				],
				msg: "wATJo8CycLZgZv8brcuJwdMjqTGyzrhq367bMgz4aYxnmpu",
				key: "B241sRaf5krKCgKkh4hvpUt6D59QsmhBHmgbapnptev1mpr",
				sign: "381yXZRyM8GARabptkcjdQPHEtNPMzTovaoHC9BdjJ84i361AWdovsZRagV6FigLoGTKUGefzA1EMm3D21uVg4D6KLD5moas",
			},
		];

		tcs.forEach((tc) => {
            const time = new TimeStamp(tc.now);
			const kp = m2.fromPrivateKey(tc.key);
			const msg = Buffer.concat([
				Buffer.from("mitum"),
				Buffer.from(tc.msg),
				time.bytes(),
			]);
			const sign = kp.sign(msg);

			time.bytes().forEach((b, idx) => expect(b).toBe(tc.nbytes[idx]));
			expect(bs58.encode(sign)).toBe(tc.sign);
		});
	});
});
