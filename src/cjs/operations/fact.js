const bs58 = require("bs58");

const { Item } = require("./item.js");

const { MAX_ITEMS_IN_FACT } = require("../mitum.config.js");

const { Hint } = require("../base/hint.js");
const { Token } = require("../base/token.js");
const { IBytesDict } = require("../base/interface.js");
const {
	EC_INVALID_FACT,
	EC_INVALID_ITEM,
	EC_INVALID_ITEMS,
	EC_NOT_IMPLEMENTED_METHOD,
	assert,
	error,
} = require("../base/error.js");

const { Address } = require("../key/address.js");

const { sum256 } = require("../utils/hash.js");
const { sortBuf } = require("../utils/string.js");

class Fact extends IBytesDict {
	constructor(hint, token) {
		super();
		this.hint = new Hint(hint);
		this.token = new Token(token);
		this.hash = null;
	}

	hashing() {
		return sum256(this.bytes());
	}

	get opHint() {
		throw error.nimplement(
			EC_NOT_IMPLEMENTED_METHOD,
			"unimplemented method opHint()"
		);
	}
}
exports.Fact = Fact;

class OperationFact extends Fact {
	constructor(hint, token, sender, items) {
		super(hint, token);
		this.sender = new Address(sender);

		assert(Array.isArray(items), error.type(EC_INVALID_ITEM, "not Array"));

		assert(
			items.length > 0 && items.length <= MAX_ITEMS_IN_FACT,
			error.range(EC_INVALID_ITEMS, "array size out of range")
		);

		const iarr = items.map((item) => {
			assert(
				item instanceof Item,
				error.instance(EC_INVALID_ITEM, "not Item instance")
			);

			return item.toString();
		});
		const iset = new Set(iarr);
		assert(
			iarr.length === iset.size,
			error.duplicate(EC_INVALID_FACT, "duplicate item in items")
		);

		this.items = items;
		this.hash = this.hashing();
	}

	bytes() {
		return Buffer.concat([
			this.token.bytes(),
			this.sender.bytes(),
			Buffer.concat(this.items.sort(sortBuf).map((item) => item.bytes())),
		]);
	}

	dict() {
		return {
			_hint: this.hint.toString(),
			hash: bs58.encode(this.hash),
			token: this.token.toString(),
			sender: this.sender.toString(),
			items: this.items.sort(sortBuf).map((item) => item.dict()),
		};
	}
}
exports.OperationFact = OperationFact;

class NodeFact extends Fact {
	constructor(hint, token) {
		super(hint, token);
	}
}
exports.NodeFact = NodeFact;