import { Table } from "../keyvalue/table.js";
import { CacheReferenceType, KeyValueDataValueType, RelationalDataValueType } from "./type.js";
export interface KeyValueDataOption {
    value: KeyValueDataValueType;
    key: string;
    file: string;
    ttl: number;
    type?: string;
}
export interface KeyValueSetDataOption {
    value: KeyValueDataValueType;
    ttl: number;
}
export interface KeyValueJSONOption {
    value: KeyValueDataValueType;
    key: string;
    ttl: number;
    type: string;
}
export interface KeyValueDatabaseOption {
    path?: string;
    extension?: string;
    tables?: string[];
    cacheOption?: {
        limit?: number;
        cacheReference?: CacheReferenceType;
        sorted?: boolean;
    };
    storeOption?: {
        maxDataPerFile?: number;
    };
    methodOption?: {
        saveTime?: number;
        getTime?: number;
        allTime?: number;
        deleteTime?: number;
    };
    encryptOption?: {
        enabled?: boolean;
        securitykey?: string;
    };
}
export interface HashData {
    iv: string;
    data: string;
}
export interface RelationalDatabaseOptions {
    path?: string;
    extension?: string;
    tables: RelationalTableOptions;
    encryptOption?: {
        enabled?: boolean;
        securitykey?: string;
    };
    cacheOption?: {
        cacheReference?: CacheReferenceType;
        sorted?: boolean;
        limit?: number;
    };
    methodOption?: {
        saveTime?: number;
        getTime?: number;
        allTime?: number;
        deleteTime?: number;
    };
    storeOption?: {
        maxDataPerFile?: number;
        sorted?: boolean;
    };
}
export interface RelationalTableOptions {
    name: string;
    path: string;
    columnData: ColumnData[];
}
export interface ColumnData {
    name: string;
    primary: boolean;
    defaultValue?: RelationalDataValueType;
    type: RelationalDataValueType;
}
export interface RowData {
    name: string;
    column: string;
    value: RelationalDataValueType;
    file: string;
}
export interface TypedDatabaseEvents {
    ready(): void;
    tableReady(table: Table): void;
    debug(message: string): void;
}
export interface ColumnDatabaseOptions {
    tables: ColumnTableOptions;
    path?: string;
    extension?: string;
    cacheOption?: {
        cacheReference?: CacheReferenceType;
        sorted?: boolean;
        limit?: number;
    };
    methodOption?: {
        saveTime?: number;
        getTime?: number;
        allTime?: number;
        deleteTime?: number;
    };
    storeOption?: {
        maxDataPerFile?: number;
        sorted?: boolean;
    };
}
export interface ColumnTableOptions {
    name: string;
    columns: ColumnDbColumnData[];
}
export interface ColumnDbColumnData {
    name: string;
    primary: boolean;
    values: Map<string, RelationalDataValueType>;
    type: RelationalDataValueType;
}
//# sourceMappingURL=interface.d.ts.map