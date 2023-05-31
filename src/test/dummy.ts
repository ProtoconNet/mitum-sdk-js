const currency = {
    PEN: {
        currency: "PEN",
        zero: "PEN-Xmca",
    },
    MCC: {
        currency: "MCC",
        zero: "MCC-Xmca",
    },
} as const

const nodePriv = {
    m1: "KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr",
    m2: "EYc4WdFjP9qkgfwJZfnsVXeh827rsNppm5HUSjSDeMFFmpr",
    m2ether: "f69f845b154048b5d1c4bff066cf286da6da2b127d9ac5004c2fb9a2d83f93d8epr",
} as const

const genesis = {
    m1: {
        address: "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca",
        private: "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr",
    },
    m2: {
        address: "2E5qNuz9HsXydeTTdG1a3SZtj1iBWNUyVyfHYNcs4gSgmca",
        private: "D4QPRNSTgYmgRymYVS1mLgyGtCbzeAPYhd5r4jNQahwampr",
    },
    m2ether: {
        address: "cbc14fe342eea61d5922f83a5d3bfcb06d120df9eca",
        private: "7b7926dc931b88442a5b2e18cf1b149fb673907f072942240416afa773ca03a9epr",
    },
} as const

const account1 = {
    public: "2122tJTiK183VbZFsecRgvaybcqM1wwGRLrsru9e5FaJMmpu",
    address: "AN91jfkYtje64GPrKPkGMrrPnb7iq9TZq1fBHxwML9wmmca",
} as const

const account2 = {
    public: "u8Ey4xJwzEgPTc2kMPZtiiXBTsg5AKwt4vuWpM4RpsQtmpu",
    address: "5f2WQP8Ckn7mRHrv9mkqdvC7vEjB3w7kurbRWurgT62Wmca",
} as const

const  accountEther = {
    public: "0477c8ea663217870e3a93a01ceb47ce0fcaef5e3f0459f161a7fc70be8b417846d7a01b24c0211e86f5d748ec346e9455f41037420f0038f5cf26eb6ec69bfc63epu",
    address: "fc44aa45090109854ffdcac424408271a57d631ceca"
} as const

export default {
    currency,
    nodePriv,
    genesis,
    account: {
        a: account1,
        b: account2,
        eth: accountEther,
    }
}