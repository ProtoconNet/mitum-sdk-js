const bs58 = require("bs58");
const m2 = require("./m2-keypair");

describe("test: m2; keypair generation", () => {
	it("case: random", () => {
		const kp1 = m2.random();
		const kp2 = m2.fromPrivateKey(kp1.privateKey.toString());

		expect(kp2.privateKey.toString()).toBe(kp1.privateKey.toString());
		expect(kp2.publicKey.toString()).toBe(kp1.publicKey.toString());
	});

	it("case: = require(private key", () => {
		const testKps = [
			{
				priv: "FErPVnjF9RZBB1KN1gBeeQQqohprAfFFcDBtUSSLPLn3mpr",
				pub: "21vgR4sWkWWTTgkCCzWa8Gepy4Lp91bSF3Z4EpMuVqzMvmpu",
			},
			{
				priv: "DGB7Qb3R56MDhPiAXVHCuCSb41CgNvRCBnptQMQvbBj7mpr",
				pub: "tu93iKiEnX77sBBqY6uQYaPJTeRcXSFzQGCtwKXsywgNmpu",
			},
			{
				priv: "Co4mn2Lr6tqboxpyypHF1nmj2m3HyXnuwaK9QiPqsWn6mpr",
				pub: "oSVLVCpQYZm2RcYJKLHBodJfMWvna6WN5pHfLiLKtDkgmpu",
			},
			{
				priv: "4VHhkaKhsAppCWesSyXyrEPpmrVDLTcJYM5d39WNpzWimpr",
				pub: "gcr11NFGcCC6faaPJ4qszV58Q5KSYB5kkSRY8YKqVhttmpu",
			},
			{
				priv: "CkB4rAejq2VG3MUWqTpLAVaX4rTVvjYqws1LGZzeKaRompr",
				pub: "w65M5gGT3F51hR3nhcDtUj7RMHwjTGkFcrtqRxiu7PD2mpu",
			},
			{
				priv: "5WB9swh8nhbTa2ci6pv1Xy92eTR94D6Leo8EFjqGz6wfmpr",
				pub: "vy9tZXid5aop5HVUnWB87nRqop4Mb7TsKUAej1T1terCmpu",
			},
			{
				priv: "7qwXX1eCcXs8XURcaKFf4qNkJhM8wDziqSBvxZSA4Sx7mpr",
				pub: "x5XzoPmdyFk5z3xoEo924QdSa9qU259Cj5TY84GvbF6Umpu",
			},
			{
				priv: "HqEhjBt7nc7KC9mYmRkr1SHgbP5RovUF7SsGYDtCiCaJmpr",
				pub: "h8s8F7jKHypm1YzpVWjcwS2chkEnhfcrwyZUhqfGgyuampu",
			},
			{
				priv: "8pvkGATvZxNMpAUAQaRDLjHSqmzVjeNxtBARYXc9EJANmpr",
				pub: "owgo7zTWAjA87t9DaMogqHxuJBZLwGxnYnuNNsHA2SFnmpu",
			},
			{
				priv: "CKtUSizGoErJMM3ywCXWvnrkYh4mGRZFLcLbXZdn5Rezmpr",
				pub: "caVrKnWk1syANTEFqpfFJTgjEyqcirWmj2UzGHStsDYDmpu",
			},
		];

		testKps.forEach((tc) => {
			const tkp = m2.fromPrivateKey(tc.priv);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});

	it("case: = require(seed", () => {
		const testKps = [
			{
				seed: "mitummitummitummitummitummitummitummitum",
				priv: "7kWSghrTyZ2tAX7ETPXFNiXDeLpAn8UiqGQH9KXn6RXXmpr",
				pub: "24TbbrNYVngpPEdq6Zc5rD1PQSTGQpqwabB9nVmmonXjqmpu",
			},
			{
				priv: "5QH1MUpwrsHpaLLd4yXJgpqEQJbFjyYPBgiWEjferGRXmpr",
				pub: "28gnHT5DJtFygjCK3wbsdPfJtE45U9tXpzWyap5kXSHc3mpu",
				seed: "abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde",
			},
			{
				priv: "7cdDwK81MSYRPKnTPFTT7ssh6u8gremnjEuVkLR3ZQV4mpr",
				pub: "x1YEvgC6Je8Y9JJBnWNVP2Nfag7cULQQTA4N3247ww1Dmpu",
				seed: "aslkfjwelkfjlaskjflawkefjlwekjflwkefjlwkefj",
			},
			{
				priv: "6QXXmgv2KiNiQ7Xag8pVDajxSaqSR12ND24ep5byru41mpr",
				pub: "v99vuWLMn1rBcTi8GQna2wU61CpZh4GWzub3PGwqV7vfmpu",
				seed: "lwkejfl#@439080sdfklj1o48u3.33323li4j2l3",
			},
			{
				priv: "8y7AGQoSv2EtVoq2Gwt97scq3frjEf4baaXgMD6XAwu8mpr",
				pub: "j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu",
				seed: "Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~",
			},
		];

		testKps.forEach((tc) => {
			const tkp = m2.fromSeed(tc.seed);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});
});

describe("test: m2; sign", () => {
	it("case: sign string msg", () => {
		const tcs = [
			{
				msg: "mitum",
				priv: "BhWt1hqkkxUHspcvSfJKaH2HQ7Ns4n1oHzAv7s7P75Y1mpr",
				sig: "AN1rKvtV12snAHf2KHUeBFrCL58w1P51sKjQAH21AppRn3xHyJQ2XHVL8wrAeEybWmcFz7ZFxGvbYpMEDYtxm44jvntSRvv9J",
			},
			{
				msg: "this is a msg to test",
				priv: "4ZGWj8KLh4cRjXErqABYLARHxhruQmJNCMwucgD6wLL4mpr",
				sig: "AN1rKvt9KZCeynd4faPM4q61k2aP58YEQokKz4hgZQafsvgvin8VRcRZ6y9vjwgBpv9LwhKEp9i2jZ5Uco4Z1Q9dBvZyedbDQ",
			},
			{
				msg: "te스타 forever~",
				priv: "6LQmHvc7dpG5eQtbX858CLeYrB8jSy3XUmV59puytnNPmpr",
				sig: "AN1rKvtheftA54ngmgzMb7LVKXotsSBMDsv9ocsgFBkBF5VJffctT8tLXC4o3w7JauiNJkbE2c7oj1wWXrKXpLwTgrzBnNJLo",
			},
			{
				msg: "drill",
				priv: "HoTnYPSHC5hJW2jWNJXfuhNEQjqYFdhLbchQij3E42UNmpr",
				sig: "AN1rKvtmT7ZskdqVSrmbBjfNs79bA51X4NFWFUtC62tDvKiP7zJagiDNE6cdcAPZhrnokzXV24hC4sBMRtwPGN86uW7XhBVEd",
			},
			{
				msg: "kim rabbit",
				priv: "4RVwW7w1JE9DCjs4dB37fge36xdRb4Qr5jeYb8zsStPkmpr",
				sig: "AN1rKvtWpfj7fDwiRX7SZruhkzLyAAAK5nJmNWVq1yWKuw3jbsNJ6G2NJDxxmx8BWwZf2g6Uprj98u1pKniEpN4q4wGu4qxQf",
			},
			{
				msg: "mabeopsonyeon",
				priv: "6gZXpmZvsQeDkcxg7m9WXrNFNjF8vCLwHrUHWPV2sddempr",
				sig: "381yXZPZCQfjU1UgMkMXCSz8ULuoq5sM7eV7Bxwpc5iG8uySpJ6fddkrkEbLSkNN1qedjA2HcS8ccSFEiCfAPKKtYffdETtB",
			},
			{
				msg: "baehamzzi",
				priv: "EEqNCm69hXEGkvxmhiqxJHh8ZczqTouW9fdXUHT8n9Etmpr",
				sig: "381yXZK1j8xc8dML9vEDsGUnqczGGZqidT4yAazwoif6xrjfifKFFnDjmrygugtEEtEPBztuP99YEaCQYKCuF3vQkW8EEMKX",
			},
			{
				msg: "dynamite",
				priv: "HMQeEk38norYUW6CAqZqimoS7xRMAzdFjkciL1SnA7onmpr",
				sig: "381yXZ1DccWd1Jt7M9SmAdVoxq52gCYBk6RuiCWMAPRWDdz9rxqXhM5SMEWEPULvfz7o6RZk7uN72MLqmyS8ixj3gGcPyAgD",
			},
			{
				msg: "txt",
				priv: "3zDXJfqJut9G3FLzeTWyeCfgrQruEywQT32tWZxTrrPDmpr",
				sig: "381yXZ9taXw3sjNTSswr1FZHTPcRD6YMnAnuFrBewyhttDKwthUGNx2MGEcGhzgu9kW6cUB73JdVjzZf5teRj7Kxj982XRqb",
			},
		];

		tcs.forEach((tc) => {
			const kp = m2.fromPrivateKey(tc.priv);
			const sig = bs58.encode(kp.sign(tc.msg));

			expect(sig).toBe(tc.sig);
		});
	});
});
