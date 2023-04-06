const bs58 = require("bs58");
const m1 = require("./m1-keypair");

describe("test: m1; keypair generation", () => {
	it("case: random", () => {
		const kp1 = m1.random();
		const kp2 = m1.fromPrivateKey(kp1.privateKey.toString());

		expect(kp2.privateKey.toString()).toBe(kp1.privateKey.toString());
		expect(kp2.publicKey.toString()).toBe(kp1.publicKey.toString());
	});

	it("case: = require(private key", () => {
		const testKps = [
			{
				priv: "KwSKzHfNFKELkWs5gqbif1BqQhQjGhruKubqqU7AeKu5JPR36vKrmpr",
				pub: "22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu",
			},
			{
				priv: "KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr",
				pub: "r3W57ffVSjnyMFQ6132ZoPj1jnbFhoSFCnDYYRq2tXQVmpu",
			},
			{
				priv: "KzJJKNzD1xUGnvApDUqcEkgKoXXGqq7SibC2h1HRXtASrn38kWQqmpr",
				pub: "yX3YBvu597eNgwuuJpsnZunZcDkABVeqfmiyveKuNregmpu",
			},
			{
				priv: "L4riAEL7826Lx1xSmeFfn9LsbEpNg9AeqqF6Ch7iad5WBn979MLympr",
				pub: "f8sfHFcvWZJFM4T5jGJtpxcKxdYagi3uKeGzoAqL6PQhmpu",
			},
			{
				priv: "L27bg9NwbyGpwZZ5zPEBdUJ4rZpwEtnrm1aPNWjX5TtW3CZraTsdmpr",
				pub: "dKygYYM98XycK1qA1qErYss7g6hCgLKtUbywsfCpMorjmpu",
			},
			{
				priv: "KxurztsVLp4Dsm9cJ7JQYTjLmt9LSkjgaLwewPpi9EwrHzqtAyYxmpr",
				pub: "2955ii3dQHwWGvqEjcpQqft1tMAPZ96eLNDLbHZRzTKCkmpu",
			},
			{
				priv: "L5KAuUBntFf6qTuBTmw462n2HSkZtYqKimd6AYUj75XipkJuw3xsmpr",
				pub: "zckdh2xvYg2tg2HRq6hCVwQGvMd5z7jWJ4WzcUppG3Xqmpu",
			},
			{
				priv: "KyyxfQhF3rKwGftkh6j8eeW3uSmLfoRdF1KukEELaLMpNrmjHk5Gmpr",
				pub: "uPf2riDWz8F4RteaVQn6vwKrDg141BbSfrDBDi1hTEJSmpu",
			},
			{
				priv: "L2RC9TsFWnEX74dXMiKhTwx12UbyRLy2RhcDTVzF1dn6iNjLtk6Smpr",
				pub: "rxeeTACS6AYjrgFWidmkJamQ7bCAsgjYuoN3z2QhFKW9mpu",
			},
			{
				priv: "KzR4KDNYBfb8pCGaFh5cDiGLvG757CbEgs9Fqw8NZQGKf5ENsAPgmpr",
				pub: "2AeCEK62ykU3Mgt83i6JejkEXG1PBx6McsP5AD61nGBi9mpu",
			},
		];

		testKps.forEach((tc) => {
			const tkp = m1.fromPrivateKey(tc.priv);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});

	it("case: = require(seed", () => {
		const testKps = [
			{
				seed: "mitummitummitummitummitummitummitummitum",
				priv: "KzafpyGojcN44yme25UMGvZvKWdMuFv1SwEhsZn8iF8szUz16jskmpr",
				pub: "24TbbrNYVngpPEdq6Zc5rD1PQSTGQpqwabB9nVmmonXjqmpu",
			},
			{
				priv: "KyQq9FrK5RmjhfCTNt1ma3mKcnYnYYeuEKLv2NhAd3euoDcc88jFmpr",
				pub: "28gnHT5DJtFygjCK3wbsdPfJtE45U9tXpzWyap5kXSHc3mpu",
				seed: "abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde",
			},
			{
				priv: "KzWk9Qg4zyJKNVVWr4VHZ5Z974KbF7hTKX2AcBQ7jdDfYVfAk5Pgmpr",
				pub: "x1YEvgC6Je8Y9JJBnWNVP2Nfag7cULQQTA4N3247ww1Dmpu",
				seed: "aslkfjwelkfjlaskjflawkefjlwekjflwkefjlwkefj",
			},
			{
				priv: "KyuqYqJLC9oPtaUudToDFq1kdshADx1sAyDiRaeQHJTNGpziqZJvmpr",
				pub: "v99vuWLMn1rBcTi8GQna2wU61CpZh4GWzub3PGwqV7vfmpu",
				seed: "lwkejfl#@439080sdfklj1o48u3.33323li4j2l3",
			},
			{
				priv: "L1BpsqZVzgMhkVCCvR1pyFLHNxBPYi5758uFzPdeLpjejfLxzd7Xmpr",
				pub: "j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu",
				seed: "Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~",
			},
		];

		testKps.forEach((tc) => {
			const tkp = m1.fromSeed(tc.seed);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});
});

describe("test: m1; sign", () => {
	it("case: sign string msg", () => {
		const tcs = [
			{
				msg: "mitum",
				priv: "KztBmiKZXLRS83kTaJZJEh4M5hutKSYiHXtwXEikXKv7zZMZhQJ9mpr",
				sig: "AN1rKvtoy4xsxMkgmM78L9F4pyWVJSPFgfPJJ2b5Sirv6XYgJEvu1hgm1hiaDHD762q1uEPwKQN5zqisEcgGn5nAn4NoKHZ5o",
			},
			{
				msg: "this is a msg to test",
				priv: "L11moS6v3gcM65NQxuTbzcov6kho5DZ7bVQ7nfoF1ZMUYprJFeiHmpr",
				sig: "381yXYmdf6r5MaR9WbvPdjv26HAMaEaKLDv645FS4RKL7jUcZZU94pNv1CLexzMupTg2jWdhiqWfQRx9EQFWC121mWGi57mj",
			},
			{
				msg: "te스타 forever~",
				priv: "KzWrhaorLd2fj8WhBRgMMBo7igqdbCkXZg3SPBXCsT7QgDDy2QDympr",
				sig: "381yXZSmyJhDLiuDg6VR566p5nm1CYek9i7y2JYbLxVXfiGhG6mmZpo77zwCEgCUT6TL7qLhHawsLKdMG5hesSoXgXXiwx4z",
			},
			{
				msg: "drill",
				priv: "Kxyaq11GP8Mufpa9YsMyhuXdjb1RkVu4vWbrb476smt79nKV4tHkmpr",
				sig: "381yXZ8g971mh6pqHYSrD1Lwh9zwFr4M6nZWC18dHgeK31cbHP9sXLATVcMuL1EbDjTa75iSEBgnkj9VX3ieqVJGYAzrx4dM",
			},
			{
				msg: "kim rabbit",
				priv: "KxsUHF31KMX6uChLboqKndx57Jm8fJhXAU5wvUc7VWqwzTQDDw6jmpr",
				sig: "381yXZGHqooWuvAWb3MwByTP1QJDN5y6tdBWNBEVWmUFJ9zj7dFJnrAEjED3qUK1iqaBZPZE2wtZgQj4Gqntg1FLfYH4zU9g",
			},
			{
				msg: "mabeopsonyeon",
				priv: "KzUqZezjAZXhBjjNART81PkzgQTB9rD86CS6cNaLx8wWT8vNN8E2mpr",
				sig: "AN1rKvt8BkTHTHqbTKYh4KukzTRudAftrtzyYKFn1Qdsw4zwJudBBPNXW16wXeB9iT2P3DFRzHennsixsg7cQSAaq45HUPjpJ",
			},
			{
				msg: "baehamzzi",
				priv: "KzD68WytWYJ9K48zC1xMgxQzFjx5gQambwVYYQPZkjZtq4diAUgLmpr",
				sig: "381yXZ3t71ixJAVUGYx8ecF3p3pEjYorshMDRw4q4hBgdEVy4hipS2tcs8Gk5TWVGJA7cYr6ifYnVm5cXZ6y9AKewyFRTVQR",
			},
			{
				msg: "dynamite",
				priv: "KyQrzciU81Li1MP5YZNUf4K834YDV5RdgcRV5SGL1MY38sgrgxTXmpr",
				sig: "381yXYncqRDqcocKpvAXzpYsXzxSDNizz2NWzRGbxqRYjNP5GwUPvDXwsP3qaWygG8wfeen4KThhUwjHQz6QTTWHxRfNFCcD",
			},
			{
				msg: "txt",
				priv: "Ky7CzvAyNWE3AUSuo8ym8gkKvivQW11r6o8gbh37r7DPNEnY49dnmpr",
				sig: "381yXZSLNoCmyyMqPypBHi79zELPGimaevV8q9qeEaer8yLwpArU6pvshC8U3UKqcxHDzMpTQj4nkDfKydZrWTYVadFAmJ7E",
			},
		];

		tcs.forEach((tc) => {
			const kp = m1.fromPrivateKey(tc.priv);
			const sig = bs58.encode(kp.sign(tc.msg));

			expect(sig).toBe(tc.sig);
		});
	});
});
