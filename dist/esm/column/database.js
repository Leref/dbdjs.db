export class ColumnDatabase {
    options;
    constructor(options) {
        this.options = this._resolve(options);
    }
    _resolve(options) {
        return {
            cacheOption: {
                cacheReference: options.cacheOption?.cacheReference ?? "MEMORY",
                limit: options.cacheOption?.limit ?? 10000,
                sorted: options.cacheOption?.sorted ?? true,
            },
            extension: options.extension ?? "sql",
            methodOption: {
                saveTime: options.methodOption?.saveTime ?? 100,
                getTime: options.methodOption?.getTime ?? 5000,
                allTime: options.methodOption?.allTime ?? 5000,
                deleteTime: options.methodOption?.deleteTime ?? 100,
            },
            path: options.path ?? "./database",
            storeOption: {
                maxDataPerFile: options.storeOption?.maxDataPerFile ?? 50000,
                sorted: options.storeOption?.sorted ?? true,
            },
            tables: options.tables ?? [],
        };
    }
}
//# sourceMappingURL=database.js.map