const { useV, useId, SIG_TYPE } = require("./utils/config.js");
const { TimeStamp, FullTimeStamp } = require("./utils/time.js");
const { sha256, sum256, keccak256 } = require("./utils/hash.js");
const { Big, Float } = require("./utils/number.js");
const { sortStringAsBuf, sortBuf } = require("./utils/string.js");

const {
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_KEY_ETHER_PRIVATE,
	SUFFIX_KEY_ETHER_PUBLIC,
	SUFFIX_ETHER_ACCOUNT_ADDRESS,
	SUFFIX_NODE_ADDRESS,
} = require("./alias/key.js");

const { ID, CurrencyID, ContractID } = require("./base/ID.js");
const { error, assert } = require("./base/error.js");
const { Hint } = require("./base/hint.js");
const { IBytes, IDict, IBytesDict } = require("./base/interface.js");
const { Token } = require("./base/token.js");

const m1 = require("./key/m1-keypair.js");
const m2 = require("./key/m2-keypair.js");
const m2ether = require("./key/m2-ether-keypair.js");

const { Address, ZeroAddress, ADDRESS_TYPE } = require("./key/address.js");
const { PublicKey, Keys, KEY_TYPE } = require("./key/key.js");
const { M1RandomN, M2RandomN, M2EtherRandomN } = require("./key/random.js");

const { Item } = require("./operations/item.js");
const { Fact, OperationFact, NodeFact } = require("./operations/fact.js");
const { FactSign, M1FactSign, M2FactSign, M2NodeFactSign } = require("./operations/factsign.js");

const { Seal } = require("./operations/seal.js");
const { Operation } = require("./operations/operation.js");

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
	m2ether: {
		...m2ether,
		randomN: M2EtherRandomN,
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
		SUFFIX_KEY_ETHER_PRIVATE,
		SUFFIX_KEY_ETHER_PUBLIC,
		SUFFIX_ETHER_ACCOUNT_ADDRESS,
		SUFFIX_NODE_ADDRESS,
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
	keccak256,
	sortStringAsBuf,
	sortBuf,
};

module.exports = {
	useV,
	useId,
	SIG_TYPE,
	alias,
	err,
	base,
	util,
	TimeStamp,
	FullTimeStamp,
	KPGen,
	KEY_TYPE,
	ADDRESS_TYPE,
	PubKey,
	Keys,
	Amount,
	Token,
	Address,
	ZeroAddress,
	Hint,
	Fact,
	OperationFact,
	NodeFact,
	FactSign,
	M1FactSign,
	M2FactSign,
	M2NodeFactSign,
	Item,
	ID,
	Big,
	Float,
	CurrencyID,
	ContractID,
	Operation,
	Seal,
	Signer,
	Currency,
};
