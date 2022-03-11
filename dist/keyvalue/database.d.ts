import { TypedEmitter } from "tiny-typed-emitter";
import { KeyValueDatabaseOption, KeyValueDataOption } from "../typings/interface";
import { CacheReferenceType } from "../typings/type";
import { Table } from "./table";
export declare class KeyValue extends TypedEmitter {
    tables: Map<string, Table>;
    options: {
        path: string;
        extension: string;
        tables: string[];
        cacheOption: {
            cacheReference: CacheReferenceType;
            limit: number;
            sorted: boolean;
        };
        encryptOption: {
            enabled: boolean;
            securitykey: string;
        };
        methodOption: {
            allTime: number;
            deleteTime: number;
            getTime: number;
            saveTime: number;
        };
        storeOption: {
            maxDataPerFile: number;
        };
        timeOption: {
            saveCreatedTimestamp: boolean;
            saveModifiedTimestamp: boolean;
        };
    };
    constructor(options: KeyValueDatabaseOption);
    _resolve(options: KeyValueDatabaseOption): {
        path: string;
        extension: string;
        tables: string[];
        cacheOption: {
            cacheReference: CacheReferenceType;
            limit: number;
            sorted: boolean;
        };
        encryptOption: {
            enabled: boolean;
            securitykey: string;
        };
        methodOption: {
            allTime: number;
            deleteTime: number;
            getTime: number;
            saveTime: number;
        };
        storeOption: {
            maxDataPerFile: number;
        };
        timeOption: {
            saveCreatedTimestamp: boolean;
            saveModifiedTimestamp: boolean;
        };
    };
    connect(): void;
    set(table: string, key: string, value: KeyValueDataOption): Promise<void>;
}
