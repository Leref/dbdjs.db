import { TypedEmitter } from "tiny-typed-emitter";
import { ColumnDatabaseOptions, ColumnTableOptions, TypedDatabaseEvents } from "../typings/interface.js";
import { CacheReferenceType } from "../typings/type.js";
import { WideColumnTable } from "./table.js";
export declare class WideColumn extends TypedEmitter<TypedDatabaseEvents> {
    tables: Map<string, WideColumnTable>;
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
        };
        tables: ColumnTableOptions[];
        encryptOption: {
            securitykey: string;
        };
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
        };
        tables: ColumnTableOptions[];
        encryptOption: {
            securitykey: string;
        };
    };
    get securitykey(): string;
    connect(): void;
}
//# sourceMappingURL=database.d.ts.map