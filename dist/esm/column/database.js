import { existsSync, mkdirSync } from "fs";
import { TypedEmitter } from "tiny-typed-emitter";
import { DatabaseEvents } from "../typings/enums.js";
import { WideColumnError } from "./error.js";
import { WideColumnTable } from "./table.js";
export class WideColumn extends TypedEmitter {
    tables = new Map();
    options;
    constructor(options) {
        super();
        this.options = this._resolve(options);
    }
    _resolve(options) {
        if (!options.encryptOption?.securitykey) {
            throw new WideColumnError("DB#encryptOption.securitykey is required.");
        }
        return {
            cacheOption: {
                cacheReference: options.cacheOption?.cacheReference ?? "MEMORY",
                limit: options.cacheOption?.limit ?? 5000,
                sorted: options.cacheOption?.sorted ?? true,
            },
            extension: options.extension ?? ".sql",
            methodOption: {
                saveTime: options.methodOption?.saveTime ?? 100,
                getTime: options.methodOption?.getTime ?? 5000,
                allTime: options.methodOption?.allTime ?? 5000,
                deleteTime: options.methodOption?.deleteTime ?? 100,
            },
            path: options.path ?? "./database",
            storeOption: {
                maxDataPerFile: options.storeOption?.maxDataPerFile ?? 200,
            },
            tables: options.tables ?? [],
            encryptOption: {
                securitykey: options.encryptOption?.securitykey,
            },
        };
    }
    get securitykey() {
        return this.options.encryptOption.securitykey;
    }
    connect() {
        if (!existsSync(this.options.path))
            mkdirSync(this.options.path, { recursive: true });
        for (const table of this.options.tables) {
            const newTable = new WideColumnTable(table.name, table.columns, this);
            newTable.connect();
            this.tables.set(table.name, newTable);
        }
        this.emit(DatabaseEvents.READY);
    }
}
//# sourceMappingURL=database.js.map