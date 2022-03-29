export type KeyValueDataValueType =
  | string
  | bigint
  | number
  | null
  | boolean
  | Array<KeyValueDataValueType>
  | ValidJSON;

export type ValidJSON = {
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
export type integer = number;
export type RelationalDataValueType =
  | string
  | integer
  | number
  | object
  | BigBuffer;
export type BigBuffer = Buffer | ArrayBuffer | string | object | BigInt;
