export interface IBuffer {
    toBuffer(): Buffer
}

export type HintedObject = {
    _hint?: string,
    [i: string]: any
}

export interface IHintedObject {
    toHintedObject(): HintedObject
}

export interface IString {
    toString(): string
}