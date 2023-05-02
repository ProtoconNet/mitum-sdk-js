const m2ether = require("./m2-ether-keypair");

describe("test: m2 ether; keypair generation", () => {
	it("case: random", () => {
		const kp1 = m2ether.random();
		const kp2 = m2ether.fromPrivateKey(kp1.privateKey.toString());
        
		expect(kp2.privateKey.toString()).toBe(kp1.privateKey.toString());
		expect(kp2.publicKey.toString()).toBe(kp1.publicKey.toString());
	});

	it("case: from private key", () => {
		const testKps = [
			{
				priv: "7b312acf5d492443a2c9bcd2a1a183ae05c3589f65edb5c7e193ccb4988462d7epr",
				pub: "040eb6bbc0cac8683369c7d54e8daac1519355f1f8e5dd0f89a3ac0e312d8d1300400a1a769003971868fcb889fb6dab437eeebd189e152e36b5052582ea681c45epu",
			},
			{
				priv: "6357526124ff36c4b61cd547f0f0cf2042883e6ff54b8915d0a1f4b2c9127a09epr",
				pub: "04e12975dc48847dcf7337f108e7e744ac623db9b1bea83abfe87dc0bdd76b7523eded6a4c0b6bcfcd7f8c01f51032bdfc37a5b00179bf1bdea4f108788270dcd2epu",
			},
			{
				priv: "40b631b47f865bc87cdcc82016c6ca8a55372098795ecd3e9d6bd1d5b9f0f67depr",
				pub: "04202fd7544ffc13eea02356c3032a9a4bc708d5f6a4d11493611d297f17ad7820a7ad76eeb7db9c2be46104c9873c2ae0389846a3edb501cbf57d8a8c03756e15epu",
			},
			{
				priv: "1f5bb4b18057dc0aede8ed117702275048b82e05705b409b290bcfab9ba84e63epr",
				pub: "04f9386b2dc77318a79d6eb347e0f3ff1f10f01bc93bc5836d2d6b1c9f2e31ff7bf163b394de09a182c9e1a2d94672e51442988628bd1198d38efe1778335446a0epu",
			},
			{
				priv: "a0c855326961a20b25b994e6c7d210f434a56d81dad6d491cbe3429488511dc2epr",
				pub: "0471961ed21604a39e3416a5cd5f65b11818b790864b232f6431084aeb77df13f46ad53808bff784df20c89ca2d102cd90dbf1effacb1034749cafc250bde1dc8cepu",
			},
			{
				priv: "92766a2f7932878c63850750ada55936a867674ddd15bfcde405d0cb9d8c7424epr",
				pub: "04e1d10e30990a441a9e4253636378135d937bf1ef8cf34a21a97f8320f77b73c5280205971538e8838e51c5d39b59fc2bb41a0950a20a6288b1a2985bfa8bad39epu",
			},
			{
				priv: "c6fbbb48381066021905781add28b06efbef487002f93308bf8eead991b20d11epr",
				pub: "04cc4fa506056730deabc5d254050e670833ec3f56c308f1d8459aab4731d5069bd8def3011124e10a86c8a3439af60f335b0203fd6f9b9bbb7f44fc321b9e375fepu",
			},
			{
				priv: "9aa04468ed7e463dec3c797f75303ca5356adb84bf961a57d7132b5c7fe6bc1aepr",
				pub: "0417401b2db27e930d4c5afee5bd7c8364eab9bc7c505ccc98bffa028db4a5a350647ab70d6f3991d8a62456eb6d3da8713e7785185d9101c90f225fff519be1bcepu",
			},
			{
				priv: "5e30e8ea3902df780fc32ff12d06f486ab5b08ec3d5ff5a02b083dfe3427460cepr",
				pub: "045fe384ba42cd98e59298dc1b8449f9f6cfff0dc8bfb73adc58f01bd0b55d675a3702804bddb12ae193292dd6afa7975a29d64bf5d309538c59b720244a7eb802epu",
			},
			{
				priv: "836496353af1626dad98694f2dc66cba950d294b108010f1abca74aa52aaca9eepr",
				pub: "0462b03a616bab2d4f52e6a9c185f2867942a1a5a1c0686db87fb2f8a0367b39535fcad6befc2a9c33b3dc36dcbc1152d0ca61bf8529ba3638d266c5afde109fcfepu",
			},
		];

		testKps.forEach((tc) => {
			const tkp = m2ether.fromPrivateKey(tc.priv);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});

	it("case: from seed", () => {
		const testKps = [
			{
				seed: "mitummitummitummitummitummitummitummitum",
				priv: "644b63314453316a992c5208e8b27d865cf43b3089cb53e24ee4285d46ceb022epr",
				pub: "049129207ba9555417dd0c84c5f74d381cf1be70f78ab480c1d2ae53f2fe5a3b549d4948768251502b5de50fa6e714d14a39826dcc4bdd3532b7656e69821f5addepu",
			},
			{
				priv: "416534573131526db57d332c5332d79746df65295da726b933194981ef24a762epr",
				pub: "04cff8810d676def297738f4f69157cfb2c7f1b2b07620f386ad581182db02d55810ee0593811a086f174b1b05c85f292c5de1c473cd929b1aea40ed8d86580eb1epu",
				seed: "abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde",
			},
			{
				priv: "6246684b57595166ce710512127f83f03a3ef1a8cde27238608938c680faacf7epr",
				pub: "0431561aaf37b800a07ad527d9953f86173719d837f1bbc1b86227e22828b53b9468e33d5be9b643162c324b5f801a331ba597ea3a29b25e9913cfdb54db2569f1epu",
				seed: "aslkfjwelkfjlaskjflawkefjlwekjflwkefjlwkefj",
			},
			{
				priv: "5051507073507a7006f71059d0619d07482ce167f425dabf4546c950783a95e6epr",
				pub: "041592266b581660fb70bb6d93f6e2fa433b874930246e344e47f1475bcfbcfce0ad59a8511a07abfb07a92512b4e1c8d55cfeee55a1a765d6bbfa07dfb7f291a5epu",
				seed: "lwkejfl#@439080sdfklj1o48u3.33323li4j2l3",
			},
			{
				priv: "76614c74324641478da9cfd4a4a090f3c07d54a8c8ac0e2feda5c8f207fd2ccfepr",
				pub: "0470b096d1ecf1fe9c18318dc81f19ef3ca24f60caa742c312198bb359f4188901ec4f9f13d773ce4f7eb0ed15c211587e90a86d54cfda1b14d24c03b46b0ff4fcepu",
				seed: "Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~",
			},
			{
				priv: "504d46714b776a63ee6bd93e8632d39acf92e1ebd85c2c9a8f349d94448d8272epr",
				pub: "044741f2e182360338fe5ba0fd32af3c6474a88b1866156e088f5387e40f4346f8e771f74b207e581f9e917a2c8d48a228c8673489d2fc7a0823aa160a29e2b449epu",
				seed: "askldfjalsekfnaslfknaslefkjaslefkjaslekfjalskefjalskefjlaskejflasf"
			}
		];

		testKps.forEach((tc) => {
			const tkp = m2ether.fromSeed(tc.seed);

			expect(tkp.privateKey.toString()).toBe(tc.priv);
			expect(tkp.publicKey.toString()).toBe(tc.pub);
		});
	});
});

describe("test: m2 ether; sign", () => {
	it("case: sign string msg", () => {
		const tcs = [
			{
				msg: "mitum",
				priv: "7b312acf5d492443a2c9bcd2a1a183ae05c3589f65edb5c7e193ccb4988462d7epr",
				sig: "5BpRZ8211S7P4cuuSKhW5GbRKanVcVdmnYdAa1gnHtaQQHKY6zo4i1U5AbBhWU4ewqNGB1hKb1xQYpSZeX2FXKXUcxaXL",
			},
			{
				msg: "this is a msg to test",
				priv: "6357526124ff36c4b61cd547f0f0cf2042883e6ff54b8915d0a1f4b2c9127a09epr",
				sig: "5BpRZ4Ttzna35QZc4Be8QjYtWjDP47hvEVnZ1gxJa2p8aH1yHmJHJJ2mxCk9hi5qJZX3Aj1kFh2Hix9tELRB58cDk3MCH",
			},
			{
				msg: "te스타 forever~",
				priv: "40b631b47f865bc87cdcc82016c6ca8a55372098795ecd3e9d6bd1d5b9f0f67depr",
				sig: "5BpRZ8saHdvgjQJMBKY3dLRGQyFxZSYxM4saxjVmGdDHbqNq7bRPq7EnhBC2MUwdasv46Y4UvTbZMM1diZ3NSiSX1rmWh",
			},
			{
				msg: "drill",
				priv: "1f5bb4b18057dc0aede8ed117702275048b82e05705b409b290bcfab9ba84e63epr",
				sig: "5BpRZ8SwBt7mqMDBmLndo7nuZtF44KCKCyz4BcyYkxKWvX4Z65zuKgJ7q8PrbUT98QyPakRfWKXCNyVfuh6ponDg7w2TX",
			},
			{
				msg: "kim rabbit",
				priv: "a0c855326961a20b25b994e6c7d210f434a56d81dad6d491cbe3429488511dc2epr",
				sig: "5BpRZ4shBS9MNcSAfdw5qZ6dV1SmhNLXgNRpAsR7Ui2nAeGtHEz3zz6SHS4iaFXujqgvsEnw2qqdZMXDMX5w1DL8eQoct",
			},
			{
				msg: "mabeopsonyeon",
				priv: "92766a2f7932878c63850750ada55936a867674ddd15bfcde405d0cb9d8c7424epr",
				sig: "5BpRZ7odvkuCajN3LAYiazXCd9XRG7agqosAMX9ZeP1iS7tRQEJM9qFzK6K9MTUUB5Ggpr75XAHPiYBFLNPu89eTqn5A3",
			},
			{
				msg: "baehamzzi",
				priv: "c6fbbb48381066021905781add28b06efbef487002f93308bf8eead991b20d11epr",
				sig: "5BpRZ7Vmf1v5MhbDNGJpK5XjRgmsupFji9owmeBcBDddvnyvJDx4RQ626ce1vrwrd8kbZruLR135f4iNFYDK7SQ6HwrEy",
			},
			{
				msg: "dynamite",
				priv: "5e30e8ea3902df780fc32ff12d06f486ab5b08ec3d5ff5a02b083dfe3427460cepr",
				sig: "5BpRZ75nQu9dVLprFmJswohLVEaEWzn6ih9Vs7J3gkeWJhjtmq54gsGFUXcfKPNGkSYLBB2eDA7huLzuu2VfY7dEZEaFW",
			},
			{
				msg: "txt",
				priv: "836496353af1626dad98694f2dc66cba950d294b108010f1abca74aa52aaca9eepr",
				sig: "5BpRZ7byeMxBy428ExTX6dBfqiAQ7mZm1KsU32sAY5tJ6oF6Az69STyphyFwLPx2oNjRSzSYDdjC8ue6DVj7Ft6WwCz9L",
			},
		];

		tcs.forEach((tc) => {
			const kp = m2ether.fromPrivateKey(tc.priv);
			expect(kp.verify(kp.sign(tc.msg), tc.msg)).toBe(true);
		});
	});
});