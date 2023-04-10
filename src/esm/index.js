import { useV, useId, SIG_TYPE } from "./utils/config.js";
import { TimeStamp, FullTimeStamp } from "./utils/time.js";
import { sha256, sum256, keccak256 } from "./utils/hash.js";
import { Big, Float } from "./utils/number.js";
import { sortStringAsBuf, sortBuf } from "./utils/string.js";

import {
	SUFFIX_KEY_PRIVATE,
	SUFFIX_KEY_PUBLIC,
	SUFFIX_ACCOUNT_ADDRESS,
	SUFFIX_KEY_ETHER_PRIVATE,
	SUFFIX_KEY_ETHER_PUBLIC,
	SUFFIX_ETHER_ACCOUNT_ADDRESS,
	SUFFIX_NODE_ADDRESS,
} from "./alias/key.js";

import { ID, CurrencyID, ContractID } from "./base/ID.js";
import { error, assert } from "./base/error.js";
import { Hint } from "./base/hint.js";
import { IBytes, IDict, IBytesDict } from "./base/interface.js";
import { Token } from "./base/token.js";

import { m1 } from "./key/m1-keypair.js";
import { m2 } from "./key/m2-keypair.js";
import { m2ether } from "./key/m2-ether-keypair.js";
import { PublicKey, Keys, KEY_TYPE } from "./key/key.js";
import { Address, M2RandomN, M1RandomN, M2EtherRandomN, ADDRESS_TYPE } from "./key/address.js";

import { Item } from "./operations/item.js";
import { Fact, OperationFact, NodeFact } from "./operations/fact.js";
import { FactSign, M1FactSign, M2FactSign, M2NodeFactSign } from "./operations/factsign.js";
import { Operation } from "./operations/operation.js";
import { Seal } from "./operations/seal.js";

import { Signer } from "./operations/signer.js";

import { Amount } from "./operations/currency/amount.js";
import {
	M1CreateAccountsItem,
	M2CreateAccountsItem,
	CreateAccountsFact,
} from "./operations/currency/create-accounts.js";

import { M1KeyUpdaterFact, M2KeyUpdaterFact } from "./operations/currency/key-updater.js";

import {
	TransfersItem,
	TransfersFact,
} from "./operations/currency/transfers.js";

import {
	CurrencyDesign,
	CurrencyPolicy,
	NilFeeer,
	FixedFeeer,
	RatioFeeer,
} from "./operations/currency/currency-design.js";

import { CurrencyRegisterFact } from "./operations/currency/currency-register.js";

import { CurrencyPolicyUpdaterFact } from "./operations/currency/currency-policy-updater.js";

import {
	SuffrageInflationItem,
	SuffrageInflationFact,
} from "./operations/currency/suffrage-inflation.js";

import {
	M1CreateContractAccountsItem,
	M2CreateContractAccountsItem,
	CreateContractAccountsFact,
} from "./operations/currency/create-contract-accounts.js";

import {
	WithdrawsItem,
	WithdrawsFact,
} from "./operations/currency/withdraws.js";

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
	M1CreateAccountsItem,
	M2CreateAccountsItem,
	CreateAccountsFact,
	M1KeyUpdaterFact,
	M2KeyUpdaterFact,
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
	M1CreateContractAccountsItem,
	M2CreateContractAccountsItem,
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

export {
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
