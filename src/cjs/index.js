const { useV, useId, SIG_TYPE } = require("./utils/config.js");
const { TimeStamp, FullTimeStamp } = require("./utils/time.js");
const { sha256, sum256 } = require("./utils/hash.js");
const { Big, Float } = require("./utils/number.js");
const { sortStringAsBuf, sortBuf } = require("./utils/string.js");

const {
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_ACCOUNT_ADDRESS,
} = require("./alias/key.js");

const { ID, CurrencyID, ContractID } = require("./base/ID.js");
const { error, assert } = require("./base/error.js");
const { Hint } = require("./base/hint.js");
const { IBytes, IDict, IBytesDict } = require("./base/interface.js");
const { Token } = require("./base/token.js");
const m1 = require("./key/m1-keypair.js");
const m2 = require("./key/m2-keypair.js");
const { PublicKey, Keys } = require("./key/key.js");
const { Address, M2RandomN, M1RandomN } = require("./key/address.js");
const { Item } = require("./operations/item.js");
const { Fact, OperationFact, NodeFact } = require("./operations/fact.js");
const { FactSign, M1FactSign, M2FactSign, M2NodeFactSign } = require("./operations/factsign.js");
const { Operation } = require("./operations/operation.js");
const { Seal } = require("./operations/seal.js");
const { Signer } = require("./operations/signer.js");
const { Amount } = require("./operations/currency/amount.js");
const {
	CreateAccountsItem,
	CreateAccountsFact,
} = require("./operations/currency/create-accounts.js");

const { KeyUpdaterFact } = require("./operations/currency/key-updater.js");

const {
	TransfersItem,
	TransfersFact,
} = require("./operations/currency/transfers.js");

const {
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
} = require("./operations/currency/currency-design.js");

const { CurrencyRegisterFact } = require("./operations/currency/currency-register.js");
const { CurrencyPolicyUpdaterFact } = require("./operations/currency/currency-policy-updater.js");

const {
	SuffrageInflationItem,
	SuffrageInflationFact,
} = require("./operations/currency/suffrage-inflation.js");

const {
	CreateContractAccountsItem,
	CreateContractAccountsFact,
} = require("./operations/currency/create-contract-accounts.js");

const {
	WithdrawsItem,
	WithdrawsFact,
} = require("./operations/currency/withdraws.js");

const KPGen = {
	m2: {
		...m2,
		randomN: M2RandomN,
	},
	...m1,
	randomN: M1RandomN,
};

const PubKey = PublicKey;

const Currency = {
	CreateAccountsItem,
	CreateAccountsFact,
	KeyUpdaterFact,
	TransfersItem,
	TransfersFact,
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
	CurrencyRegisterFact,
	CurrencyPolicyUpdaterFact,
	SuffrageInflationItem,
	SuffrageInflationFact,
	CreateContractAccountsItem,
	CreateContractAccountsFact,
	WithdrawsItem,
	WithdrawsFact,
};

const alias = {
	key: {
		SUFFIX_KEY_PRIVATE,
		SUFFIX_KEY_PUBLIC,
		SUFFIX_ACCOUNT_ADDRESS,
	},
};

const err = {
	...error,
	assert,
};

const base = {
	IBytes,
	IDict,
	IBytesDict,
};

const util = {
	sha256,
	sum256,
	sortStringAsBuf,
	sortBuf,
};

exports.usev = useV
exports.useId = useId
exports.SIG_TYPE = SIG_TYPE
exports.alias = alias
exports.err =err
exports.base = base
exports.util = util
exports.TimeStamp = TimeStamp
exports.FullTimeStamp = FullTimeStamp
exports.KPGen = KPGen
exports.PubKey = PubKey
exports.Keys = Keys
exports.Amount = Amount
exports.Token = Token
exports.Address = Address
exports.Hint = Hint
exports.Fact = Fact
exports.OperationFact = OperationFact
exports.NodeFact = NodeFact
exports.FactSign = FactSign
exports.M1FactSign = M1FactSign
exports.M2FactSign = M2FactSign
exports.M2NodeFactSign = M2NodeFactSign
exports.Item = Item
exports.ID = ID
exports.Big = Big
exports.Float = Float
exports.CurrencyID = CurrencyID
exports.ContractID = ContractID
exports.Operation = Operation
exports.Seal = Seal
exports.Signer = Signer
exports.Currency = Currency
