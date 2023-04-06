export const sortStringAsBuf = (a, b) =>
	Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toString()));

export const sortBuf = (a, b) => Buffer.compare(a.bytes(), b.bytes());
