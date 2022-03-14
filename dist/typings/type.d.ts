/// <reference types="node" />
export declare type KeyValueDataValueType = string | number | null | boolean | Array<KeyValueDataValueType> | ValidJSON;
declare type ValidJSON = {
    [x: string | number | symbol]: ValidJSON | number | string | Array<ValidJSON> | null | boolean | (unknown & {
        toJSON(): ValidJSON;
    });
};
export declare type CacheReferenceType = "MEMORY" | "DISK";
export declare type RelationalDataValueType = string | number | object | null | boolean | BigInt | BigBuffer;
export declare type BigBuffer = Buffer | ArrayBuffer | string | object | BigInt;
export {};
