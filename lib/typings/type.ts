export type KeyValueDataValueType =
  | string
  | number
  | null
  | boolean
  | Array<KeyValueDataValueType>
  | ValidJSON;

type ValidJSON = {
  [x: string | number | symbol]:
    | ValidJSON
    | number
    | string
    | Array<ValidJSON>
    | null
    | boolean
    | (unknown & { toJSON(): ValidJSON });
};
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
