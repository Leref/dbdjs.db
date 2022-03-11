export type KeyValueDataValueType = string | number | object | null | boolean;
export type CacheReferenceType = "MEMORY" | "DISK";

export type RelationalDataValueType =
  | string
  | number
  | object
  | null
  | boolean
  | BigInt
  | BigBuffer;

export type BigBuffer = Buffer | ArrayBuffer | string | object | BigInt;
