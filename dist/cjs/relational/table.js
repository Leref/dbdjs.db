"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
class Table {
    name;
    path;
    columns;
    files;
    primaryColumn;
    constructor(options) {
        this.name = options.name;
        this.path = options.path;
        this.columns = this._resolve(options.columnData);
        this.files = this._getFiles();
    }
    _getFiles() {
        throw new Error("Method not implemented.");
    }
    _resolve(column) {
        const primaryColumn = column.find((x) => x.primary);
        if (!primaryColumn)
            return;
        if (!this.primaryColumn) {
            this.primaryColumn = primaryColumn;
        }
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map