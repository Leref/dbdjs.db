import { ColumnDatabaseOptions, ColumnTableOptions } from "../typings/interface.js";
import { CacheReferenceType } from "../typings/type.js";
export declare class ColumnDatabase {
    options: {
        cacheOption: {
            cacheReference: CacheReferenceType;
            limit: number;
            sorted: boolean;
        };
        extension: string;
        methodOption: {
            saveTime: number;
            getTime: number;
            allTime: number;
            deleteTime: number;
        };
        path: string;
        storeOption: {
            maxDataPerFile: number;
            sorted: boolean;
        };
        tables: ColumnTableOptions;
    };
    constructor(options: ColumnDatabaseOptions);
    _resolve(options: ColumnDatabaseOptions): {
        cacheOption: {
            cacheReference: CacheReferenceType;
            limit: number;
            sorted: boolean;
        };
        extension: string;
        methodOption: {
            saveTime: number;
            getTime: number;
            allTime: number;
            deleteTime: number;
        };
        path: string;
        storeOption: {
            maxDataPerFile: number;
            sorted: boolean;
        };
        tables: ColumnTableOptions;
    };
}
//# sourceMappingURL=database.d.ts.map