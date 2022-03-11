import { KeyValueDataOption, KeyValueJSONOption } from "../typings/interface";
import { KeyValueDataValueType } from "../typings/type";

export class Data {
  value: KeyValueDataValueType;
  ttl: number;
  createdTimestamp: number;
  modifiedTimestamp: number;
  file: string;
  key: string;
  constructor(data: KeyValueDataOption) {
    this.key = data.key;
    this.value = data.value;
    this.ttl = data.ttl;
    this.createdTimestamp = data.createdTimestamp;
    this.modifiedTimestamp = data.modifiedTimestamp;
    this.file = data.file;
  }
  toJSON(): KeyValueJSONOption {
    return {
      value: this.value,
      key:this.key,
      ttl: this.ttl,
      createdTimestamp: this.createdTimestamp,
      modifiedTimestamp: this.modifiedTimestamp,
    };
  }
}
