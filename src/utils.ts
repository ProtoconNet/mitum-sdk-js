import { sha3_256, keccak256 as keccak_256 } from "js-sha3"
import { sha256 as nobleSha256 } from "@noble/hashes/sha256"

import bigInt from "big-integer"
import Int64 from "int64-buffer"

import { IBuffer, IString } from "./interfaces"
import { Assert, ECODE, MitumError } from "./error"

type HashFunction = (msg: string | Buffer) => Buffer

export const sha256: HashFunction = (msg) => Buffer.from(nobleSha256(msg))
export const sha3: HashFunction = (msg) => Buffer.from(sha3_256.create().update(msg).digest())
export const keccak256: HashFunction = (msg) => Buffer.from(keccak_256.create().update(msg).digest())

export const SortFunc = <T extends IBuffer, U extends IBuffer>(a: T, b: U) => 
    Buffer.compare(a.toBuffer(), b.toBuffer())

export class Big implements IBuffer, IString {
    readonly big: bigint

    constructor(big: string | number | Buffer | BigInt | Uint8Array) {
        switch (typeof big) {
            case "number":
            case "string":
            case "bigint":
                this.big = BigInt(big)
                break
            case "object":
                if (big instanceof Buffer || big instanceof Uint8Array) {
                    this.big = this.bufferToBig(big)
                } else {
                    throw MitumError.detail(ECODE.INVALID_BIG_INTEGER, "wrong big")
                }
                break
            default:
                throw MitumError.detail(ECODE.INVALID_BIG_INTEGER, "wrong big")
        }
    }

    static from(big: string | number | Buffer | BigInt | Uint8Array | Big) {
        return big instanceof Big ? big : new Big(big)
    }

    private bufferToBig(big: Buffer | Uint8Array): bigint {
        const res: string[] = []
        
        Uint8Array.from(big).forEach((n) => {
            let s = n.toString(16)
            s.length % 2 ? res.push("0" + s) : res.push(s)
        })
       
        return BigInt("0x" + res.join(""))
    }

    toBuffer(option?: "fill"): Buffer {
        const size = this.byteLen()

        if (option === "fill") {
            Assert.check(
                size <= 8,
                MitumError.detail(ECODE.INVALID_BIG_INTEGER, "big out of range")
            )

            return Buffer.from(new Int64.Uint64LE(this.toString()).toBuffer())
        }

        const buf = new Uint8Array(size)

        let n = bigInt(this.big)
        for (let i = size - 1; i >= 0; i--) {
            buf[i] = n.mod(256).valueOf()
            n = n.divide(256)
        }

        return Buffer.from(buf)
    }

    byteLen(): number {
        const bitLen = bigInt(this.big).bitLength()
        const quotient = bigInt(bitLen).divide(8)

        if (bitLen.valueOf() - quotient.valueOf() * 8 > 0) {
            return quotient.valueOf() + 1
        }

        return quotient.valueOf()
    }

    get v(): number {
        if (this.big <= BigInt(Number.MAX_SAFE_INTEGER)) {
            return parseInt(this.toString())
        }
        return -1
    }

    toString(): string {
        return this.big.toString()
    }
}

export class Float implements IBuffer, IString {
    readonly n: number

	constructor(n: number) {
		this.n = n
	}

    static from(n: number | Float) {
        return n instanceof Float ? n : new Float(n)
    }

    toBuffer(): Buffer {
        const b = Buffer.allocUnsafe(8)
        b.writeDoubleBE(this.n)
        return b
    }

    toString(): string {
        return "" + this.n
    }
}

export class TimeStamp implements IBuffer, IString {
    private t: Date

    constructor(t?: string | number | Date) {
        if (t === undefined) {
            this.t = new Date()
        } else {
            this.t = new Date(t)
        }
    }

    static from(t: string | number | Date | TimeStamp) {
        return t instanceof TimeStamp ? t : new TimeStamp(t)
    }

    toBuffer(): Buffer {
        return Buffer.from(this.UTC())
    }

    toString(): string {
        return this.ISO()
    }

    ISO(): string {
        return this.t.toISOString()
    }

    UTC(): string {
        const iso = this.t.toISOString()
        const t = iso.indexOf("T")

        let z = iso.indexOf("Z")
        let rtime

        if (z < 0) {
            z = iso.indexOf("+")
        }

        Assert.check(0 <= z, MitumError.detail(undefined, "no 'Z' in iso"))
        
        let _time = iso.substring(t + 1, z)

        const dotIdx = _time.indexOf(".")
        if (dotIdx < 0) {
            rtime = _time
        } else {
            const decimal = _time.substring(9, _time.length)
            const idx = decimal.lastIndexOf("0")
            if (idx < 0 || idx != decimal.length - 1) {
                rtime = _time
            } else {
                let startIdx = decimal.length - 1
                for (let i = decimal.length - 1; i > -1; i--) {
                    if (decimal[i] == "0") {
                        startIdx = i
                    } else {
                        break
                    }
                }

                if (startIdx == 0) {
                    rtime = _time.substring(0, dotIdx)
                } else {
                    rtime =
                        _time.substring(0, dotIdx) +
                        "." +
                        decimal.substring(0, startIdx)
                }
            }
        }

        return iso.substring(0, t) + " " + rtime + " +0000 UTC"
    }
}

export class FullTimeStamp extends TimeStamp {
    private r: string

	constructor(s: string) {
		super(s)

		const dot = s.indexOf(".")
		if (dot < 0) {
			this.r = ""
		} else {
			this.r = s.substring(dot, s.length - 1)
		}
	}

    static from(t: string | FullTimeStamp) {
        return t instanceof FullTimeStamp ? t : new FullTimeStamp(t)
    }

	toBuffer(option?: "super"): Buffer {
		return Buffer.from(option === "super" ? super.UTC() : this.UTC())
	}

	ISO(): string {
		const iso = super.ISO()
		if (this.r) {
			const idx = iso.indexOf(".")
			return iso.substring(0, idx) + this.r
		}
		return iso
	}

	UTC(): string {
		const utc = super.UTC()
		if (this.r) {
			const idx0 = utc.indexOf(".")
			const idx1 = utc.indexOf("+")
			return utc.substring(0, idx0) + this.r + " " + utc.substring(idx1)
		}
		return utc
	}
}