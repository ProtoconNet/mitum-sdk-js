import bs58 from "bs58"

import { M1KeyPair, M2KeyPair } from "../../key"

test("test: keypair; random", () => {
    const m11 = M1KeyPair.random()
    const m12 = M1KeyPair.fromPrivateKey(m11.privateKey.toString())

    expect(m12.privateKey.toString()).toBe(m11.privateKey.toString())
    expect(m12.publicKey.toString()).toBe(m11.publicKey.toString())

    const m21 = M2KeyPair.random()
    const m22 = M2KeyPair.fromPrivateKey(m21.privateKey.toString())

    expect(m22.privateKey.toString()).toBe(m21.privateKey.toString())
    expect(m22.publicKey.toString()).toBe(m21.publicKey.toString())

    const m31 = M2KeyPair.random("ether")
    const m32 = M2KeyPair.fromPrivateKey(m31.privateKey.toString())

    expect(m31.privateKey.toString()).toBe(m31.privateKey.toString())
    expect(m32.publicKey.toString()).toBe(m31.publicKey.toString())
})

test("test: keypair; m1 from private key", () => {
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
    ]

    testKps.forEach((tc) => {
        const tkp = M1KeyPair.fromPrivateKey(tc.priv)

        expect(tkp.privateKey.toString()).toBe(tc.priv)
        expect(tkp.publicKey.toString()).toBe(tc.pub)
    })
})

test("test: keypair; m2 from private key", () => {
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
    ]

    testKps.forEach((tc) => {
        const tkp = M2KeyPair.fromPrivateKey(tc.priv)

        expect(tkp.privateKey.toString()).toBe(tc.priv)
        expect(tkp.publicKey.toString()).toBe(tc.pub)
    })
})

test("test: keypair; m2 ether from private key", () => {
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
    ]

    testKps.forEach((tc) => {
        const tkp = M2KeyPair.fromPrivateKey(tc.priv)

        expect(tkp.privateKey.toString()).toBe(tc.priv)
        expect(tkp.publicKey.toString()).toBe(tc.pub)
    })
})

test("test: keypair; m1 from seed", () => {
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
    ]

    testKps.forEach((tc) => {
        const tkp = M1KeyPair.fromSeed(tc.seed)

        expect(tkp.privateKey.toString()).toBe(tc.priv)
        expect(tkp.publicKey.toString()).toBe(tc.pub)
    })
})

test("test: keypair; m2 from seed", () => {
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
    ]

    testKps.forEach((tc) => {
        const tkp = M2KeyPair.fromSeed(tc.seed)

        expect(tkp.privateKey.toString()).toBe(tc.priv)
        expect(tkp.publicKey.toString()).toBe(tc.pub)
    })
})

test("test: keypair; m2 ether from seed", () => {
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
    ]

    testKps.forEach((tc) => {
        const tkp = M2KeyPair.fromSeed(tc.seed, "ether")

        expect(tkp.privateKey.toString()).toBe(tc.priv)
        expect(tkp.publicKey.toString()).toBe(tc.pub)
    })
})

test("test: keypair; m1 sign string msg", () => {
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
    ]

    tcs.forEach((tc) => {
        const kp = M1KeyPair.fromPrivateKey(tc.priv)
        const sig = bs58.encode(kp.sign(tc.msg))

        expect(kp.verify(sig, tc.msg))
        expect(kp.verify(tc.sig, tc.msg))

        expect(sig).toBe(tc.sig)
    })
})

test("test: keypair; m2 sign string msg", () => {
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
    ]

    tcs.forEach((tc) => {
        const kp = M2KeyPair.fromPrivateKey(tc.priv)
        const sig = bs58.encode(kp.sign(tc.msg))

        expect(kp.verify(sig, tc.msg))
        expect(kp.verify(tc.sig, tc.msg))

        expect(sig).toBe(tc.sig)
    })
})

test("test: keypair; m2 ether sign string msg", () => {
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
    ]

    tcs.forEach((tc) => {
        const kp = M2KeyPair.fromPrivateKey(tc.priv)
        expect(kp.verify(kp.sign(tc.msg), tc.msg)).toBe(true)
    })
})