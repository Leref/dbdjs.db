/// <reference types="node" />
export declare type KeyValueDataValueType = string | bigint | number | null | boolean | Array<KeyValueDataValueType> | ValidJSON | Date;
export declare type ValidJSON = {
    [x: string | number | symbol]: ValidJSON | number | string | Array<ValidJSON> | null | boolean | (unknown & {
        toJSON(): ValidJSON;
    });
};
export declare type CacheReferenceType = "MEMORY" | "DISK";
export declare type integer = number;
export declare type RelationalDataValueType = string | integer | number | object | BigBuffer;
export declare type BigBuffer = Buffer | ArrayBuffer | string | object | BigInt;
//# sourceMappingURL=type.d.ts.map