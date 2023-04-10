const { PublicKey, Keys } = require("./key");
const { HINT_KEY, HINT_KEYS } = require("../alias/key");

describe("test: address generation", () => {
	it("case: weighted public key", () => {
		const tcs = [
			{
				weight: 1,
				key: "23RWZ9McmTt5EpPYdLBeGYDn7nwyEB6qiPdU8DMjZ3dnkmpu",
			},
			{
				weight: 10,
				key: "vcsQ2fYSU5YVW5zRtpACXSLHtppkjCUo3tJ5witmAyZPmpu",
			},
			{
				weight: 20,
				key: "23jEC2vNwdfJn7PAKcFjy5CTVmELWdiAm6ZENEMr62cnsmpu",
			},
			{
				weight: 30,
				key: "282UNbzEAZQf3GdWJRPUrSaHWF88u297WTQbxfkytpcTsmpu",
			},
			{
				weight: 40,
				key: "bkPHGdsHSzRGe3NZ2hkzTSPyJx42BRaXetzy1bgBmbaAmpu",
			},
			{
				weight: 50,
				key: "dkEwnSpWm8jPokZdG8kTpJ2gYP6Thnfussn46Em1N2Q9mpu",
			},
			{
				weight: 60,
				key: "25BSSq9WLYD2mdrkDQVGoFXkXFHA7hX3MD3x7yRZyDd8rmpu",
			},
			{
				weight: 70,
				key: "25weqEnC7FooDKKszmi2cghh5SZ7xeFZ3gmajVwmSQLp6mpu",
			},
			{
				weight: 80,
				key: "26DWqrAxSN89SDmpQwpHRyFkJ5cacRpSPPAwUbzj44aFbmpu",
			},
			{
				weight: 90,
				key: "bdLMBPJ2DvADomo1zaAj8HaCqBdEJbk6ANgCibw1no6Hmpu",
			},
			{
				weight: 100,
				key: "nrVNZz89tK5jYpRcneLDm2SpnqKEJJ6a11T7AsezyRjbmpu",
			},
		];

		tcs.forEach((tc) => {
			const key = new PublicKey(tc.key, tc.weight);

			expect(key.hint.s).toBe(HINT_KEY);
			expect(key.toString()).toBe(tc.key);
			expect(key.weight.v).toBe(tc.weight);
		});
	});

	it("case: address from keys", () => {
		const tcs = [
			{
				keys: [
					{
						weight: 10,
						key: "23RWZ9McmTt5EpPYdLBeGYDn7nwyEB6qiPdU8DMjZ3dnkmpu",
					},
					{
						weight: 10,
						key: "2B3uCJP64EAjGQfMmbhg2NhL5KsGFaXg7djafkia6PVJVmpu",
					},
					{
						weight: 10,
						key: "ca3wzQfedeiCtfmcwTu5rrDSGDmsHe7CdkLm37ngdjaHmpu",
					},
					{
						weight: 10,
						key: "fP2GDSXPzWCj6FgJZY1t2uTUsnxNHiZ9K6tivmL9hcXnmpu",
					},
					{
						weight: 10,
						key: "foN2dQ9VioFffPT4xnDJnaWvdrRt5MWv4nEuJaJZffqPmpu",
					},
					{
						weight: 10,
						key: "gfBwN8te2B6QN1cGLjPL8DfQXzUnopUmj8QFcbzSW5Bzmpu",
					},
					{
						weight: 10,
						key: "mMb8n1ngSXehYUbCe6yibFJYAdCQueM2XLzj1yTpNZPPmpu",
					},
					{
						weight: 10,
						key: "tFjPU6h5ZGPrjuCoH4QkrNn3m53F4u9PJV2x2cL4V6ysmpu",
					},
					{
						weight: 10,
						key: "te2eJF6JY6vzXHrYCaGA9d4UrrXDtcreYPVntLwp9pd2mpu",
					},
					{
						weight: 10,
						key: "vcsQ2fYSU5YVW5zRtpACXSLHtppkjCUo3tJ5witmAyZPmpu",
					},
				],
				threshold: 100,
				address: "Bxw6tR2veTepgqVUs4ZgDUUty6EZyQXFF4hmQn6PtRK8mca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "23jEC2vNwdfJn7PAKcFjy5CTVmELWdiAm6ZENEMr62cnsmpu",
					},
					{
						weight: 10,
						key: "282UNbzEAZQf3GdWJRPUrSaHWF88u297WTQbxfkytpcTsmpu",
					},
					{
						weight: 10,
						key: "bkPHGdsHSzRGe3NZ2hkzTSPyJx42BRaXetzy1bgBmbaAmpu",
					},
					{
						weight: 10,
						key: "dkEwnSpWm8jPokZdG8kTpJ2gYP6Thnfussn46Em1N2Q9mpu",
					},
					{
						weight: 10,
						key: "e49Ee3cUVstQGREZwrExiNvg9ySSigXrzh6wRZS5FYJ3mpu",
					},
					{
						weight: 10,
						key: "pdSx1i3h3WHWAaGfe5zNVVp42KHWVsan6hQxkfbkBi5Pmpu",
					},
					{
						weight: 10,
						key: "rrfsPSWHVTSMQn3A6ye8pnWwZYvcBLLLkjcpsutRgky6mpu",
					},
					{
						weight: 10,
						key: "siMWQTKRgshxtTH32zY8XkJyVL9yUNYF8KTqqvjo8Q5empu",
					},
					{
						weight: 10,
						key: "usxt4SA1jYKJP68yFMSrmC3Z6E7GTJmL1ZLSEfGoW9zBmpu",
					},
					{
						weight: 10,
						key: "yhJVPi2Sn2qtgtjaUtWanUGboQAFQhDS9u6yjtdLYaG4mpu",
					},
				],
				threshold: 100,
				address: "BCxd12tjsmZqYRv5E6uL1R1e4kScMvH18C7QwwJLz21Zmca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "21qVFp27KrW1bJDcbwBKT2vtakxaHnPATpDyGYVi3E1smmpu",
					},
					{
						weight: 10,
						key: "25BSSq9WLYD2mdrkDQVGoFXkXFHA7hX3MD3x7yRZyDd8rmpu",
					},
					{
						weight: 10,
						key: "25weqEnC7FooDKKszmi2cghh5SZ7xeFZ3gmajVwmSQLp6mpu",
					},
					{
						weight: 10,
						key: "26DWqrAxSN89SDmpQwpHRyFkJ5cacRpSPPAwUbzj44aFbmpu",
					},
					{
						weight: 10,
						key: "bdLMBPJ2DvADomo1zaAj8HaCqBdEJbk6ANgCibw1no6Hmpu",
					},
					{
						weight: 10,
						key: "nrVNZz89tK5jYpRcneLDm2SpnqKEJJ6a11T7AsezyRjbmpu",
					},
					{
						weight: 10,
						key: "oj45xfcwqeSJtSBA77Z6NaoBW2qZxeSoy7NP7HWMB9bMmpu",
					},
					{
						weight: 10,
						key: "tNXas34cP1a5R7xbFuMzLP8VqwrmmKHgk5EJi7JHu5sEmpu",
					},
					{
						weight: 10,
						key: "ybKjNv7rTtfYxT1PdBGp7QJs2JS9qJAM7exmyAxeAzAhmpu",
					},
					{
						weight: 10,
						key: "zyDtSSEjMaBomBQb8vzfuGLiojeWhmvN9ZbEFS8ByEU4mpu",
					},
				],
				threshold: 100,
				address: "86ysmyZnpR8fk11X47rSjsdScTjk7SxTNCMF1gPqfHZhmca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "21LPnvUU4XpQCKnZzhy4Y15WLbvfurdYXbxBMwpa3N6rjmpu",
					},
					{
						weight: 10,
						key: "22cdgTHQWQocprofPehf4T8mgwG3aENyrf37Pz3vtUFJampu",
					},
					{
						weight: 10,
						key: "29htHP62PpPe4Vk9XnU9uCkSAZvVWYAkqKpHToQD8Vxpnmpu",
					},
					{
						weight: 10,
						key: "mZ2ehHVVPYMWKsXXaZwbtQBVGWrZcVpgLXJMEe3rtTkRmpu",
					},
					{
						weight: 10,
						key: "qGVGNyFuBSyfriGtFhUZPMp6ounkHFn6dGTPdBuEihiGmpu",
					},
					{
						weight: 10,
						key: "txdqvCNcS1Tb6VFwyLC6MbybKHCMHn3kyT29cxNvYocUmpu",
					},
					{
						weight: 10,
						key: "wxtX7HP777i8Y9Bw9aoKvqG58zXToxBUFhsXUzLp3cpwmpu",
					},
					{
						weight: 10,
						key: "x8D9ayLqdQKNjejHiMXienHUH9kg1HXC8eK7PMZKnhdjmpu",
					},
					{
						weight: 10,
						key: "y4HE3PiKGJRpc92zdH3R4QCpUASS2onjT4w76m2ZjKErmpu",
					},
					{
						weight: 10,
						key: "yaoY2PYVh7PAjAPzSLL3g2RHZpZ2R5SbkmQ3mMSKvrK5mpu",
					},
				],
				threshold: 100,
				address: "2iUueU6T2Zp2mLgJWXS9qhj6wSQC9c8QQ6BVB2bkiTrcmca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "22gBvaMCRaEVfUToPyYYGbbGMu4CrdgzVx9CqhakNpLRsmpu",
					},
					{
						weight: 10,
						key: "dzs9bkLbmpNsanoemzGNAWw81yoW3nWPyE6ymLucg1zxmpu",
					},
					{
						weight: 10,
						key: "gPqJtpFAGwdL2xo3Z8SEAACqf81NPRw2Rhv5LncdKhTnmpu",
					},
					{
						weight: 10,
						key: "gqGDoHC4vnSUb3hdzhZJZgD7XSu6CjRRksgqWkRLHNRwmpu",
					},
					{
						weight: 10,
						key: "nJWma21TFMob5c8iRigJzhPyvw1t32dxvUC4aEPCqpPmmpu",
					},
					{
						weight: 10,
						key: "pa1MRZE4dE1GZFJ1JWdHkGwvJqdLJdyytBW8NqJmo3utmpu",
					},
					{
						weight: 10,
						key: "tfWsgErte2QC1HVGDeeJri5Mfb58KRweavQ3o6C1qg9cmpu",
					},
					{
						weight: 10,
						key: "u7f1NZwtZLrc3Y1nQJMeRbSXG5sm926XBqZTMa6LrA6impu",
					},
					{
						weight: 10,
						key: "ySmcVS54zVEmbnZBTxqsWA8EEwYaStU6NLF7BUnFPGjampu",
					},
					{
						weight: 10,
						key: "z965Q8TjwmCz6Y74ms2QPXb1m3aU7yKvcAkPZFCLzMkkmpu",
					},
				],
				threshold: 100,
				address: "FnKwyXRKVpSzYQD6FZZBxcAQYTGW8MxUZRfcYGqQjF9nmca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "21hcTjFFPihNsixkBBkMYSpQ6ZQKqsWBgibjWurSvKfGumpu",
					},
					{
						weight: 10,
						key: "21qHeAz18gvNZcDhrhRJYpfwsUPfSKSNeghDP72kdcAc2mpu",
					},
					{
						weight: 10,
						key: "22oMznc6PKJEHhzFWbe73KeK1ck4TGRbAHQHJtYMuY4p3mpu",
					},
					{
						weight: 10,
						key: "27qkbi9Mee43yxrgcwTGAEGpFPa2CEmCrC49apWnC31K8mpu",
					},
					{
						weight: 10,
						key: "2B5WzKjKNi44Ui37RY81bvYLVoCasAsLqy87jTrZxrs5xmpu",
					},
					{
						weight: 10,
						key: "kuekXKsrTMtkRAH3Yw8mEP7NsSND1d1ZSSCtLinB4C7Cmpu",
					},
					{
						weight: 10,
						key: "pbzDKqjGtLcUaPs7HmNAbJHRbtXb2ndwyjVVA1AoyDEjmpu",
					},
					{
						weight: 10,
						key: "puk3ZDeSyEM3gsxgtZojAAkHo6BYQs7jktj48895VcTympu",
					},
					{
						weight: 10,
						key: "sCUE5Zf1BFzS8VXJh8jJDWBJoKDqvCW8Uaou6b1o359ympu",
					},
					{
						weight: 10,
						key: "vK8oRfjgqFP4ZwE8SWTarCUSgt5iXRDFt7zqAx5vkqoympu",
					},
				],
				threshold: 100,
				address: "ExDkaEfNKc8NDVR4D2NmtspTE2HQreTMUqMuBQBoKSDumca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "d2iJPX7JCt8ekVHS5XdRfBGzR7qckoGDvVLUid6a3CHkmpu",
					},
					{
						weight: 10,
						key: "dH11BquvQCoHwhqCV5ErjQxdad9EmtZVwXVYfaeXW8uHmpu",
					},
					{
						weight: 10,
						key: "eASof3D2HTYVbN2MeqnmvKGrG7Vk5JKs1MYMY37Yu1f1mpu",
					},
					{
						weight: 10,
						key: "gfSpgnPE4tgnGVDJVLRmjUyABjgFqSQCVRpKstyAoWMGmpu",
					},
					{
						weight: 10,
						key: "qgjVzw4n8UH8xcf2ycHYmgWdRbd3UJ84T4Q8nHacdeMdmpu",
					},
					{
						weight: 10,
						key: "rPv4Chc2feq7qK2pLNGxdMNAvJN2TLiHJJYdZi6arzPcmpu",
					},
					{
						weight: 10,
						key: "rnZKoaTGyry9oz3PpygkuLYTBi1DJcgxD88UDgT5gjkzmpu",
					},
					{
						weight: 10,
						key: "sa6D1EMXXMDpraLbRbrKbBLFRg7skirzog7BWqTbJtGampu",
					},
					{
						weight: 10,
						key: "syUUHG7fjTSaNJnt1jcAsWD3d1Hzz57NRWXUrP5kf4XTmpu",
					},
					{
						weight: 10,
						key: "zQLJq3G25K5HCqfi4AVKm1dL4FbTu8y2qt1kTxyU4yw4mpu",
					},
				],
				threshold: 100,
				address: "KDzzTL1MoWtVZshU6wnajjmKVAPPc4FPAEJGiWSEgazmca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "25XyjQGCKR8nNKPiam9Qbh59zkpL3JfB15QEYLfc817BAmpu",
					},
					{
						weight: 10,
						key: "28YjRT1mqPFXDTqNBNPz69UE8JNcFd4v7G3T7QrZsJ9jZmpu",
					},
					{
						weight: 10,
						key: "fFiXwKfeS2wfZ3mwF2TidnfpkN2dWWhtoepPVsesWXyTmpu",
					},
					{
						weight: 10,
						key: "iJ7J4zYURxxDtQ67jauxsR8uQaZrMoqnkrJMddAHadUWmpu",
					},
					{
						weight: 10,
						key: "j7Ao9Z2FktLTvNn3rETJvQKTFaaS5JBgvqPpXjxfRyfJmpu",
					},
					{
						weight: 10,
						key: "kdJN8A2fL356XpLGLkfCYhp8wZrBknxqLpoKrcpRvasJmpu",
					},
					{
						weight: 10,
						key: "mX7fSMtUd4hvLusBd3J9rsMkMYAvEbZcCgg17rE3CrLGmpu",
					},
					{
						weight: 10,
						key: "nLs3AVG1d5QtRcWXQ4JP21Nid5NYnSxqonPGpJs5hJfpmpu",
					},
					{
						weight: 10,
						key: "svwhjXZw5uU7HAj7Kp6nGLRQbtEVWPDXdcKDfWXMCdH4mpu",
					},
					{
						weight: 10,
						key: "tontAdwi3UoZSxRTVB1nK432es6oMk37M5aXvKxcKqDZmpu",
					},
				],
				threshold: 100,
				address: "AcBmwC7GWhgTkKPeu4xprVWTmEEfmMuW8X3FqMnPcmPCmca",
			},
			{
				keys: [
					{
						weight: 10,
						key: "27N7gzwVdydXhTZzm86HYLoJJguyeashVNBTz7AkG4W3qmpu",
					},
					{
						weight: 10,
						key: "28wLGqpGg5QzTAshP1c8fz1hSpRA5VVfoAufGYeUxQiUsmpu",
					},
					{
						weight: 10,
						key: "29JCtH7K9ZL4ihu4HGLJH4c4SvqUeWJogWPWaEEsvoH39mpu",
					},
					{
						weight: 10,
						key: "2A7ttLoXi9sbLsDrLCwF5r6UVjKnr5ndGoUrKD5NpfyHnmpu",
					},
					{
						weight: 10,
						key: "ecQ4wihjK1BKNpWN5a3Hrxne3T22YCNVCqaJQuMsfVzrmpu",
					},
					{
						weight: 10,
						key: "kpZLdVYFJXVbS7aXkVi4qeYutZu5fFYH9Zber1TYEkuempu",
					},
					{
						weight: 10,
						key: "nsyENThqTqQLWEiTiahbJA1DzqpjAUah7j14Nd39Wfpmmpu",
					},
					{
						weight: 10,
						key: "r2QNtkK1odMHpggmYeeADpGwPTwyM1XhyPKhVTcxg9bQmpu",
					},
					{
						weight: 10,
						key: "tytaSadh5nfvDLcbuGcRhsgWz1DBFRJKHQHoWjD8Y8AEmpu",
					},
					{
						weight: 10,
						key: "zvi7WsuKmvJzJVA9eY4fNxW4Y1hGuCM6TR8RMoxzQ97Hmpu",
					},
				],
				threshold: 100,
				address: "EgmSZPYXwgLEgCbM1U6jhJL7foaJPk2CDvhRghNoSXaWmca",
			},
			{
				hash: "BEVN6kxxzisUrByVu6sYjReA8PeW8SZY2ebGQ4PrbPm9",
				keys: [
					{
						weight: 10,
						key: "21etLSEDHNHakuotR9DifNwp3nGFRFnjEk5gZUxFxwiPxmpu",
					},
					{
						weight: 10,
						key: "23sGG9cLkDXadpLKyJxtaUadd18M1jA4emDKhZNp9xpuampu",
					},
					{
						weight: 10,
						key: "25CK7ay1LyLtUm6FxnvFkK55siQXWycCHZPrYJnMKQ4mHmpu",
					},
					{
						weight: 10,
						key: "2ALFuFuBS4JXRQmuUqPWaCAz7rgB5AfsouDyJgzTzq3Hhmpu",
					},
					{
						weight: 10,
						key: "2BMVsBmxdZ5qER4742mAegQKnWK7DmJ2ow82RDW4WyFbZmpu",
					},
					{
						weight: 10,
						key: "2BbgHDeybvide7EvBJnt6wagLUPfLjyhUEddwJMPoAPXfmpu",
					},
					{
						weight: 10,
						key: "iaWLHhmidLghp8opoYH6mKF6gokir3h7sUdTAGYp5RXhmpu",
					},
					{
						weight: 10,
						key: "peqMXNkAkwBKHih3QAUFXq2a8rduPH9LrHvR3eEtuumAmpu",
					},
					{
						weight: 10,
						key: "rt9yL1HTDKceS72biJ4QW9q7Used988sWar8hn1sVj1kmpu",
					},
					{
						weight: 10,
						key: "yQ64LG6zQqsgynh2DzNQbHJ5qWFbTCkJrYXFdzLH4UwKmpu",
					},
				],
				threshold: 100,
				address: "BEVN6kxxzisUrByVu6sYjReA8PeW8SZY2ebGQ4PrbPm9mca",
			},
		];

		tcs.forEach((tc) => {
			const ks = tc.keys.map((k) => new PublicKey(k.key, k.weight));
			const keys = new Keys(ks, tc.threshold);

			expect(keys.hint.s).toBe(HINT_KEYS);
			expect(keys.keys.length).toBe(10);
			expect(keys.threshold.v).toBe(tc.threshold);
			expect(keys.address.toString()).toBe(tc.address);
		});
	});

	it("case: duplicate keys", () => {
		const pub = "kpZLdVYFJXVbS7aXkVi4qeYutZu5fFYH9Zber1TYEkuempu";

		expect(
			() =>
				new Keys([new PublicKey(pub, 50), new PublicKey(pub, 50)], 100)
		).toThrow(Error);
	});
});
