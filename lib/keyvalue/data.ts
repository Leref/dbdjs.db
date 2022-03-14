import { KeyValueDataOption, KeyValueJSONOption } from "../typings/interface";
import { KeyValueDataValueType } from "../typings/type";

export class Data {
  value: KeyValueDataValueType;
  ttl: number;
  file: string;
  key: string;
  constructor(data: KeyValueDataOption) {
    this.key = data.key;
    this.value = data.value;
    this.ttl = data.ttl;
    this.file = data.file;
  }
  toJSON(): KeyValueJSONOption {
    return {
      value: this.value,
      key:this.key,
      ttl: this.ttl,
    };
  }
}
