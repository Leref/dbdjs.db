import { ColumnData, RelationalTableOptions } from "../typings/interface.js";

export class Table {
  name: string;
  path: string;
  columns: void;
  files: any;
  primaryColumn!: ColumnData;
  constructor(options: RelationalTableOptions) {
    this.name = options.name;
    this.path = options.path;
    this.columns = this._resolve(options.columnData);
    this.files = this._getFiles();
  }
  _getFiles(): any {
    throw new Error("Method not implemented.");
  }
  _resolve(column: RelationalTableOptions["columnData"]) {
    const primaryColumn = column.find((x) => x.primary);
    if (!primaryColumn) return;
    if (!this.primaryColumn) {
      this.primaryColumn = primaryColumn;
    }
  }
}
