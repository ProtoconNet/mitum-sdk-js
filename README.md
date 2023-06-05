# mitum-sdk

__mitum-sdk__ is a SDK written in typescript that helps create operations for mitum models.

* Mitum Currency
* Mitum Currency Extension

__mitum-sdk__ supports both types of cjs and esm.

## Installation

This project has been developed in the following environments:

```sh
$ node --version
v19.8.1

$ npm --version
9.5.1

$ tsc --version
Version 5.0.4

$ ts-node --version
v10.9.1
```

You can install and build this package locally using this command:

```sh
$ npm i

$ npm run build
```

You can install __mitum-sdk__ using this command:

```sh
$ npm i mitum-sdk
```

## Publishing

If you want to publish this package on npm, build the package first before publishing.

```sh
$ npm run build

$ npm publish
```

## Test

You can test __mitum-sdk__ using this command:

```sh

> mitum-sdk@0.2.0 test
> jest

 PASS  ...
 PASS  ...
 ...
 PASS  ...

Test Suites: 18 passed, 18 total
Tests:       56 passed, 56 total
Snapshots:   0 total
Time:        8.015 s
Ran all test suites.
```

## Index

||Title|
|---|---|
|1|[Generate KeyPairs](#generate-keypairs)|
|-|[Random KeyPair](#random-keypair)|
|-|[From private key](#from-private-key)|
|-|[From seed](#from-seed)|
|2|[Get address from public keys](#get-address-from-public-keys)|
|3|[Generate currency operations](#generate-currency-operations)|
|-|[create-account](#create-account)|
|-|[key-updater](#key-updater)|
|-|[transfer](#transfer)|
|-|[currency-register](#currency-register)|
|-|[currency-policy-updater](#currency-policy-updater)|
|-|[suffrage-inflation](#suffrage-inflation)|
|-|[create-contract-account](#create-contract-account)|
|-|[withdraw](#withdraw)|
|4|[Generate seal](#generate-seal)|
|5|[Add sign to operation json](#add-sign-to-operation-json)|
|+|[Appendix](#appendix)|
|+|[License](#license)|

To set the mitum version of all hints and the network id, refer to [Set version of hints](#set-version-of-hints) and [Set network id of operations](#set-network-id-of-operations).

## Generate KeyPairs

__mitum-sdk__ supports two signature methods:

- mitum1: m1 (btc)
- mitum2: m2 (btc, ether)

You can generate key pairs in the following ways:

* Generate a random KeyPair
* Generate a KeyPair from a private key
* Generate a KeyPair from a seed

* btc private key: [key]mpr
* btc public key: [key]mpu 

* ether private key: [key]epr
* ether public key: [key]epu

The following functions are prepared for key pair generation.

```js
import { M1KeyPair, M2KeyPair, M1RandomN, M2RandomN, M2EtherRandomN } from "mitum-sdk";

// m1 btc key pair
var ekp1 = M1KeyPair.random();
var ekp2 = M1KeyPair.fromPrivateKey(/* string private key */);
var ekp3 = M1KeyPair.fromSeed(/* string seed */);
var ekp4 = M1RandomN(/* the number of keypairs */);

// m2 btc key pair
const { m2 } = KPGen;
var skp1 = M2KeyPair.random();
var skp2 = M2KeyPair.fromPrivateKey(/* string private key */);
var skp3 = M2KeyPair.fromSeed(/* string seed */);
var skp4 = M2RandomN(/* the number of keypairs */);

// m2 ether key pair
const { m2ether } = KPGen;
var ukp1 = M2KeyPair.random("ether");
var ukp2 = M2KeyPair.fromPrivateKey(/* string private key */);
var ukp3 = M2KeyPair.fromSeed(/* string seed */, "ether");
var ukp4 = M2EtherRandomN(/* the number of keypairs */);
```

### Random KeyPair

#### Get a random KeyPair

```js
import { M1KeyPair, /* M2KeyPair */ } from "mitum-sdk";

const keypair = M1KeyPair.random(); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // KwSKzHfNFKELkWs5gqbif1BqQhQjGhruKubqqU7AeKu5JPR36vKrmpr
const pubStr = pub.toString(); // 22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu
```

#### Get N random KeyPairs with an address

```js
import { M1RandomN, /* M2RandomN, M2EtherRandomN */ } from "mitum-sdk";

const n = 5

// keys: Keys[Keys] instance; with 5 MKey(pub, weight) and threshold
// keypairs: Array; 5 KeyPair(priv, pub)
const { keys, keypairs } = M1RandomN(5);

const address = keys.address // Address instance
```

### From private key

```js
import { M1KeyPair, /* M2KeyPair */} from "mitum-sdk";

const keypair = M1KeyPair.fromPrivateKey("KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // KwkuLfcHsxY3yGLT2wYWNgbuGD3Q1j3c7DJvaRLfmT8ujmayJUaJmpr
const pubStr = pub.toString(); // r3W57ffVSjnyMFQ6132ZoPj1jnbFhoSFCnDYYRq2tXQVmpu
```

### From seed

The seed string length must be at least __36__.

```js
import { M1KeyPair, /* M2KeyPair */ } from "mitum-sdk";

const keypair = M1KeyPair.fromSeed("Hello, world! ㅍㅅㅍ~ Hello, world! ㅍㅅㅍ~"); // KeyPair instance

const priv = keypair.privateKey; // Key instance
const pub = keypair.publicKey; // Key instance

const priveStr = priv.toString(); // L1BpsqZVzgMhkVCCvR1pyFLHNxBPYi5758uFzPdeLpjejfLxzd7Xmpr
const pubStr = pub.toString(); // j3XadE7SLSDS5B7hgTrXmAvZBGWE38WDNyLQKWxn6N96mpu
```

## Get address from public keys

Each general account in __Mitum Currency__ consists of the following elements:

* public keys
* weights: each weight is paired with a public key
* threshold
* address

The address is calculated based on the account's `public key`s, `weight`s, and `threshold`.

In the case of a __multi-sig__ account, the sum of the weights of all public keys that signed the operation must be greater than or equal to the threshold. Otherwise, the operation will not be processed.

Each weight and threshold range is __0 < weight, threshold <= 100__.
An account can have up to __10 public keys__.

* __btc__ address: [address]mca 
* __ether__ address: [address]eca 
* zero address: [address]-Xmca

To obtain an address from public keys, you must use the following classes:

```js
import { PubKey, Keys } from "mitum-sdk";

var pub = new PubKey(/* public key; string */, /* weight; number */);
var keys = new Keys(/* pub keys; PubKey Array */, /* threshold; number */);
var address = keys.address.toString(); // btc
var etherAddress = keys.etherAddress.toString(); // ether
```

Let's do the following as an example.

* 5 public keys
* each weight: 20
* threshold: 60

Since __20 * 3 = 60__, you must sign the operation with at least __three keys__ when using this account to transfer the operation.

```js
import { PubKey, Keys } from "mitum-sdk";

const pubs = [
  	{
    	weight: 20,
		key: "23RWZ9McmTt5EpPYdLBeGYDn7nwyEB6qiPdU8DMjZ3dnkmpu",
	},
	{
		weight: 20,
		key: "vcsQ2fYSU5YVW5zRtpACXSLHtppkjCUo3tJ5witmAyZPmpu",
	},
	{
		weight: 20,
		key: "23jEC2vNwdfJn7PAKcFjy5CTVmELWdiAm6ZENEMr62cnsmpu",
	},
	{
		weight: 20,
		key: "282UNbzEAZQf3GdWJRPUrSaHWF88u297WTQbxfkytpcTsmpu",
	},
	{
	  	weight: 20,
		key: "bkPHGdsHSzRGe3NZ2hkzTSPyJx42BRaXetzy1bgBmbaAmpu",
	},
];
const threshold = 60;

const mpubs = pubs.map(pub => new PubKey(pub.key, pub.weight));
const mkeys = new Keys(mpubs, threshold); // Keys[Keys] instance

const address = mkeys.address; // (btc) Address instance
const stringAddress = address.toString(); // btc type string address

const etherAddress = mkeys.etherAddress; // (ether) Address instance
const etherStringAddress = etherAddress.toString(); // ether type string address
```

## Generate Currency Operations

__Mitum Currency__ can handle a total of six operations.

You can use this package to create the following operations:

For general accounts:

* create-account
* key-updater
* transfer

For contract accounts:

* create-contract-account
* withdraw
  
For node:

* currency-register
* currency-policy-updater
* suffrage-inflation

See [Appendix](#appendix) for other instructions on how to use `Operation`.

If you are wondering how to enter the `memo` field when creating an operation, please refer to part, [Is memo essential for operation generation?](#is-memo-essential-for-operation-generation).

### create-account

__create-account__ is an operation to create a new general account.

The rules for account creation are as described in [2. Get address from public keys](#get-address-from-public-keys).

First, suppose you create an account with the following settings:
 
* 5 public keys
* each weight: 20
* threshold: 100
* initial balance: 1000 MCC, 500 PEN

```js
import { TimeStamp, M1RandomN, Amount, Currency, Operation } from "mitum-sdk";

// create 5 new public keys
const { keys, keypairs } = M1RandomN(5);

const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "500");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount]);
const fact = new Currency.CreateAccountsFact(token, senderAddress, [item]);

const operation = new Operation(fact);
operation.sign(senderPrivate);

// see appendix
// operation.export(/* file path; string */);
// operation.request(/* digest api address; string */, /* headers; obj */);
```

`M1RandomN(n)`, `M2RandomN(n)` and `M2EtherRandomN(n)` always return `Keys` with a threshold __100__.

To generate `Keys` with thresholds and weights, use `PubKey` and `Keys` as follows:

```js
import { /* M1KeyPair, */ PubKey, Keys, Currency } from "mitum-sdk";

// const randomPub = M1KeyPair.random().publicKey.toString();

const pub1 = "your public key1";
const pub2 = "your public key2";
...

const key1 = new PubKey(pub1, /* weight; number */);
const key2 = new PubKey(pub2, /* weight; number */);
...

const keys = new Keys([key1, key2, ...], /* threshold; number */)

const item = new Currency.CreateAccountsItem(keys, /* amounts; Amount Array */);
```

The example above is for mitum1.

When creating an item for sending to __mitum2__, you must specify the `address-type` as follows.

If you are creating an item for __mitum1__, put emtpy string in the `address-type` or leave it blank at all.

```js
import { ..., Currency, ADDRESS_TYPE } from "mitum-sdk";

const m1Item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount]); // m1 btc type account
// const m1Item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount], '');
// const m1Item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount], null);

const m2Item = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount], "btc"); // m2 btc type account
const m2etherItem = new Currency.CreateAccountsItem(keys, [mccAmount, penAmount], "ether"); // m2 ether type account
```

### key-updater

__key-updater__ is an operation to replace keys from an existing regular account with other keys.

See [2. Get address from public keys](#get-address-from-public-keys) for rules for the new key set.

First, suppose you add a new key to your account as follows:

* currency account keys: only 1 key (weight: 100; threshold: 100)
* account keys after updating: 2 key (one is old, one is new; each weight: 50, threshold: 100)
* currency to pay the fee: MCC

```js
import { TimeStamp, PubKey, Keys, Currency, Operation } from "mitum-sdk";

const pub1 = "22PVZv7Cizt7T2VUkL4QuR7pmfrprMqnFDEXFkDuJdWhSmpu"; // new pub1
const pub2 = "yX3YBvu597eNgwuuJpsnZunZcDkABVeqfmiyveKuNregmpu"; // new pub2
const keys = [new PubKey(pub1, 50), new PubKey(pub2, 50)];

const token = new TimeStamp().UTC(); // any unique string
const targetAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const targetPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const fact = new Currency.KeyUpdaterFact(token, targetAddress, new Keys(keys, 100), "MCC");

const operation = new Operation(fact);
operation.sign(targetPrivate);
```

### transfer

__transfer__ is an operation to transfer tokens to another account.

For each type of token(aka. currency id), a fee based on the token policy is withdrawn together.

Suppose you transfer tokens to a general account as follows:

* receiver: 8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca
* tokens to transfer: 1000 MCC, 100 PEN

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

const receiver = "8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca";
const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "100");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.TransfersItem(receiver, [mccAmount, penAmount]);
const fact = new Currency.TransfersFact(token, senderAddress, [item]);

const operation = new Operation(fact);
operation.sign(senderPrivate);
```

### currency-register

__current-register__ is the operation to register the currency id and policy of the new token.

When registering a new token, you can choose one of the fee policies:

* nil (no fee)
* fixed (fixed fee)
* ratio (proportional fee)

__(1) Feeer__

First, you need to create a `feeer` that contains the contents of each fee policy.

```js
import { Currency } from "mitum-sdk";

const feeReceiver = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca"; // receiver address to receive fees;

/* nil */
const nilFeeer = new Currency.NilFeeer();

/* fixed */
const fee = "10";
const fixedFeeer = new Currency.FixedFeeer(feeReceiver, fee);

/* ration */
const feeRatio = 0.5; // 0 <= fee ratio <= 1; float
const minFee = "1"; // minimum fee
const maxFee = "10000"; // maximum fee
const ratioFeeer = new Currency.RatioFeeer(feeReceiver, feeRatio , minFee, maxFee);
```

__(2) Operation__

Then, create an operation.

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

// creating feeer
// ...
// done!

const currency = "MCC"; // currency id to register
const minBalance = "33"; // new account min balance(amount)
const initialSupply = "999999999999999999999999999999999999";
const genesis = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca"; // genesis account address

const policy = new Currency.CurrencyPolicy(minBalance, feeer); // feeer: NilFeeer || FixedFeeer || RatioFeeer 
const amount = new Amount(currency, initialSupply);
const design = new Currency.CurrencyDesign(amount, genesis, policy);

const token = new TimeStamp().UTC(); // any unique string
const fact = new Currency.CurrencyRegisterFact(token, design);

const operation = new Operation(fact);
operation.sign("KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr", { node: "node0sas" }); // node private, node address
```

### currency-policy-updater

__currency-policy-updater__ is an operation that allows you to update policies of already registered tokens.

Here, the way to create a feeer is the same as [currency-register](#currency-register).

```js
import { TimeStamp, Currency, Operation } from "mitum-sdk";

const currency = "MCC"; // currency id to update `policy`

// creating feeer
// ...
// done!

const minBalance = "33"; // new account min balance(amount)
const policy = new Currency.CurrencyPolicy(minBalance, feeer); // feeer: NilFeeer || FixedFeeer || RatioFeeer 

const token = new TimeStamp().UTC(); // any unique string
const fact = new Currency.CurrencyPolicyUpdaterFact(token, currency, policy);

const operation = new Operation(fact);
operation.sign("KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr", { node: "node0sas" }); // node private, node address
```

### suffrage-inflation

__suffrage-inflation__ is an operation to supply additional tokens to the network.

You can specify accounts to deposit additional supplies to that account.

Assume that you supply tokens as follows:

* supply MCC: receiver1, 10000000 tokens
* supply PEN: receiver2, 500000 tokens
* supply TXT: receiver3, 999998888 tokens
* supply BTS: receiver4, 292929292 tokens
* supply TST: receiver5, 999991888 tokens

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

const receiver1 = "receiver1's account address";
...
const receiver5 = "receiver5's account address";

const mcc = new Amount("MCC", "10000000");
const pen = new Amount("PEN", "500000");
const txt = new Amount("TXT", "999998888");
const bts = new Amount("BTS", "292929292");
const tst = new Amount("TST", "999991888");

const imcc = new Currency.SuffrageInflationItem(receiver1, mcc);
const ipen = new Currency.SuffrageInflationItem(receiver2, pen);
const itxt = new Currency.SuffrageInflationItem(receiver3, txt);
const ibts = new Currency.SuffrageInflationItem(receiver4, bts);
const itst = new Currency.SuffrageInflationItem(receiver5, tst);


const token = new TimeStamp().UTC(); // any unique string
const fact = new Currency.SuffrageInflationFact(token, [imcc, ipen, itxt, ibts, itst]);

const operation = new Operation(fact);
operation.sign("KxaTHDAQnmFeWWik5MqWXBYkhvp5EpWbsZzXeHDdTDb5NE1dVw8wmpr", { node: "node0sas" }); // node private, node address
```

### create-contract-account

__create-contract-account__ is an operation to create a new contract account provided by __Mitum Currency Extension__.

The rules for contract account creation are as described in [2. Get address from public keys](#get-address-from-public-keys). (exactly the same as general account)

First, suppose you create a contract account with the following settings:

* 5 public keys
* each weight: 20
* threshold: 100
* initial balance: 1000 MCC, 500 PEN

Here, the weight and threshold are only used to generate the account address and do not affect the behavior of the account at all after the account is registered.

```js
import { TimeStamp, M1RandomN, Amount, Currency, Operation } from "mitum-sdk";

// create 5 new public keys
const { keys, keypairs } = M1RandomN(5); // use M2RandomN(5) for m2 key pairs

const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "500");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount]);
const fact = new Currency.CreateContractAccountsFact(token, senderAddress, [item]);

const operation = new Operation(fact);
operation.sign(senderPrivate);
```

Like __create-account__, the item creation method of __create-contact-account__ for mitum1 and mitum2 is distinguished.

The method of creating an item is exactly the same as __create-account__.

```js
import { ..., Currency } from "mitum-sdk";

const m1Item = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount]); // contract account with m1 btc type address
// const m1Item = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount], '');
// const m1Item = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount], null);

const m2Item = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount], "btc"); // contract account with m2 btc type address
const m2etherItem = new Currency.CreateContractAccountsItem(keys, [mccAmount, penAmount], "ether"); // contract account with m2 ether type address
```

### withdraw

__withdraw__ is an operation for withdrawing tokens from a contract account.

Overall, it is similar to __transfer__.

Suppose your contract account is __DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqdmca__ and you want to withdraw the token from this account as follows:

* contract account: DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca
* tokens to transfer: 1000 MCC, 100 PEN

```js
import { TimeStamp, Amount, Currency, Operation } from "mitum-sdk";

const contractAccount = "8iRVFAPiHKaeznfN3CmNjtFtjYSPMPKLuL6qkaJz8RLumca";
const mccAmount = new Amount("MCC", "1000");
const penAmount = new Amount("PEN", "100");

const token = new TimeStamp().UTC(); // any unique string
const senderAddress = "DBa8N5of7LZkx8ngH4mVbQmQ2NHDd6gL2mScGfhAEqddmca";
const senderPrivate = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const item = new Currency.WithdrawsItem(contractAccount, [mccAmount, penAmount]);
const fact = new Currency.WithdrawsFact(token, senderAddress, [item]);

const operation = new Operation(fact);
operation.sign(senderPrivate);
```

## Generate Seal

__seal__ is not used in mitum2. Therefore, only operations with __sig-type: Mitum1__ can be added to seal.

Here's how to create a seal:

```js
import { Seal } from "mitum-sdk";

const nodePrivateKey = "KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr";

const seal = new Seal([operation0, operation1, operation2, ...]); // Operation instances or json objects
seal.sign(nodePrivateKey);

// seal.dict(); seal object
```

## Add sign to operation json

You can add a new signature to a operation json using __Signer__ class.

```js
import { Signer } from "mitum-sdk";

const json = { /* your operation json object */ };

const signer = new Signer("KzFERQKNQbPA8cdsX5tCiCZvR4KgBou41cgtPk69XueFbaEjrczbmpr");

const general = signer.sign(json); // m1 and m2 general operation
const m2node = signer.sign(json, { node: "node address" }); // m2 node operation
```

## Appendix

### Is memo essential for operation generation?

For the operation of __mitum1__, the `memo` field is required and is always included in the seed bytes when the operation hash is created.

If there's no `memo` field or the value is `null`, it is considered an empty string.

On the other hand, for operation of __mitum2__, the `memo` field is considered an extra field and a field name other than `memo` is also available.

However, in this case, when you create an operation hash, all extra fields are not included in the seed bytes at all.

In other words, `memo` in __mitum1__ affects the operating hash value, but not at all in __mitum2__.

When you create an operation with __mitum-sdk__, if the `memo` value is empty or if you don't need it at all, you can omit the parameter, and you only need to insert the value if necessary.

For example:

```js
const operation = new Operation(fact); // memo = null || memo = ''
const operation = new Operation(fact, memo); // memo -> not empty
```

### Set version of hints

To change the mitum version of every objects, add the following code to the part where the app is initialized or required.

The default version is `v0.0.1`.

```js
import { Version } from "mitum-sdk";

Version.set("v0.0.2");
// Version.get();
```

### Set network id of operations

To apply your network id to operations, add the following code to the part where the app is initialized or required.

The default id is `mitum`.

```js
import { NetworkID } from "mitum-sdk";

NetworkID.set("mainnet");
// NetworkID.get();
```

### Options and other methods for __Operation__

If your operation is for mitum1 and accounts of mitum2, you don't need to include the option for the code `sign(priv, option)`.
Just leave it `null`.

However, if the operation is a node operation(not account operation) of mitum2, you must include the option `{ node: "node address; string" }`.

```js
const operation = new Operation(/* fact, etc... */);

/* mitum1(account, node), mitum2(account) */
operation.sign(/* sender's private key */);
operation.sign(/* sender's private key */, null);

/* mitum2(node) */
operation.sign(/* sender's private key */, { node: "node addres" });
```

* Set fact-signs without signing

All fact-signs must have the same instance type(M1FactSign | M2FactSign | M2NodeFactSign).

```js
operation.setFactSigns(/* FactSign instances */);
```

`FactSign` can be created by...

```js
import { FactSign } from "mitum-sdk";

const m1fs = new M1FactSign(/* signer */, /* signature; buffer */, /* signed_at */);
const m2fs = new M2FactSign(/* signer */, /* signature; buffer */, /* signed_at */);
const m2nodefs = new M2NodeFactSign(/* node address */, /* signer */, /* signature; buffer */, /* signed_at */);
```

* Send the operation directly to the network via Digest API.

```js
operation.request(/* digest api address */, /* headers */); // `headers` can be null or undefined
```

* You can export operation json to a file.

```js
operation.export(/* file path */);
```

The `request` and `export` methods are also available in __Seal__ instance.

## License

[GNU GENERAL PUBLIC LICENSE Version 3](LICENSE)
