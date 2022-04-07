export class Relational {
    options;
    tables = new Map();
    constructor(options) {
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
                sorted: options.cacheOption?.sorted ?? true,
            },
            encryptOption: {
                enabled: options.encryptOption?.enabled ?? false,
                securitykey: options.encryptOption?.securitykey ?? "",
            },
            methodOption: {
                allTime: options.methodOption?.allTime ?? 1000,
                deleteTime: options.methodOption?.deleteTime ?? 100,
                getTime: options.methodOption?.getTime ?? 1,
                saveTime: options.methodOption?.saveTime ?? 100,
            },
            storeOption: {
                maxDataPerFile: options.storeOption?.maxDataPerFile ?? 10000,
                sorted: options.storeOption?.sorted ?? true,
            },
        };
    }
}
//# sourceMappingURL=database.js.map