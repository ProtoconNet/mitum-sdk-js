export type FS = {
    _hint?: string,
    node?: string,
    signer: string,
    signed_at: string,
    signature: string,
}

export type M1FS = {
    _hint: string,
    signer: string,
    signed_at: string,
    signature: string,
}
export type M2FS = {
    signer: string,
    signed_at: string,
    signature: string,
}
export type NodeFS = {
    node: string,
    signer: string,
    signed_at: string,
    signature: string,
}

export type FactJson = {
    _hint: string,
    token: string,
    hash: string,
    [i: string]: any,
}

export type OperationJson = {
    _hint: string,
    fact: FactJson,
    hash: string,
    memo?: string,
    fact_signs?: M1FS[],
    signs?: M2FS[]
}