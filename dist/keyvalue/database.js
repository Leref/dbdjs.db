"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValue = void 0;
const fs_1 = require("fs");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const enums_1 = require("../typings/enums");
const error_1 = require("./error");
const table_1 = require("./table");
class KeyValue extends tiny_typed_emitter_1.TypedEmitter {
    constructor(options) {
        super();
        this.tables = new Map();
        this.options = this._resolve(options);
    }
    _resolve(options) {
        return {
            path: options.path ?? "./database",
            extension: options.extension ?? ".sql",
            tables: options.tables ?? ["main"],
            cacheOption: {
                cacheReference: options.cacheOption?.cacheReference ?? "MEMORY",
                limit: 10000,
                sorted: options.cacheOption?.sorted ?? false,
            },
            encryptOption: {
                enabled: options.encryptOption?.enabled ?? false,
                securitykey: options.encryptOption?.securitykey ?? "",
            },
            methodOption: {
                allTime: options.methodOption?.allTime ?? 1000,
                deleteTime: options.methodOption?.deleteTime ?? 100,
                getTime: options.methodOption?.getTime ?? 1000,
                saveTime: options.methodOption?.saveTime ?? 100,
            },
            storeOption: {
                maxDataPerFile: options.storeOption?.maxDataPerFile ?? 10000,
            },
        };
    }
    connect() {
        if (!(0, fs_1.existsSync)(this.options.path)) {
            (0, fs_1.mkdirSync)(this.options.path, {
                recursive: true,
            });
        }
        for (const table of this.options.tables) {
            if (!(0, fs_1.existsSync)(`${this.options.path}/${table}`)) {
                (0, fs_1.mkdirSync)(`${this.options.path}/${table}`);
                (0, fs_1.writeFileSync)(`${this.options.path}/${table}/${table}_scheme_1.sql`, "{}");
            }
            const newtable = new table_1.Table(table, `${this.options.path}/${table}`, this);
            newtable.connect();
            this.tables.set(table, newtable);
        }
        this.emit(enums_1.DatabaseEvents.READY);
    }
    async set(table, key, value) {
        const tableClass = this.tables.get(table);
        if (!tableClass) {
            throw new error_1.KeyValueError(`[InvalidTable] :  Table ${table} not found!`);
        }
        return await tableClass.set(key, value);
    }
}
exports.KeyValue = KeyValue;
