import { KeyValueDataOption, KeyValueJSONOption } from "../typings/interface";
import { KeyValueDataValueType } from "../typings/type";
export declare class Data {
    value: KeyValueDataValueType;
    ttl: number;
    file: string;
    key: string;
    constructor(data: KeyValueDataOption);
    toJSON(): KeyValueJSONOption;
}
