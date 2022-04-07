import { RelationalDatabaseOptions, RelationalTableOptions } from "../typings/interface.js";
import { CacheReferenceType } from "../typings/type.js";
import { Table } from "./table.js";
export declare class Relational {
    options: {
        path: string;
        extension: string;
        tables: RelationalTableOptions;
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
            sorted: boolean;
        };
    };
    tables: Map<string, Table>;
    constructor(options: RelationalDatabaseOptions);
    _resolve(options: RelationalDatabaseOptions): {
        path: string;
        extension: string;
        tables: RelationalTableOptions;
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
            sorted: boolean;
        };
    };
}
//# sourceMappingURL=database.d.ts.map