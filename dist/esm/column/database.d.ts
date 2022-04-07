import { ColumnDatabaseOptions } from "../typings/interface.js";
export declare class ColumnDatabase {
    options: {
        cacheOption: {
            cacheReference: import("d:/projects-next/dbdjsdb/dbdjs.db/lib/index").CacheReferenceType;
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
        tables: import("d:/projects-next/dbdjsdb/dbdjs.db/lib/typings/interface").ColumnTableOptions;
    };
    constructor(options: ColumnDatabaseOptions);
    _resolve(options: ColumnDatabaseOptions): {
        cacheOption: {
            cacheReference: import("d:/projects-next/dbdjsdb/dbdjs.db/lib/index").CacheReferenceType;
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
        tables: import("d:/projects-next/dbdjsdb/dbdjs.db/lib/index").ColumnTableOptions;
    };
}
//# sourceMappingURL=database.d.ts.map