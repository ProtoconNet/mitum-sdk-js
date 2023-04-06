exports.sortStringAsBuf = (a, b) =>
	Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toString()));

exports.sortBuf = (a, b) => Buffer.compare(a.bytes(), b.bytes());
