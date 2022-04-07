import { ColumnData, RelationalTableOptions } from "../typings/interface.js";
export declare class Table {
    name: string;
    path: string;
    columns: void;
    files: any;
    primaryColumn: ColumnData;
    constructor(options: RelationalTableOptions);
    _getFiles(): any;
    _resolve(column: RelationalTableOptions["columnData"]): void;
}
//# sourceMappingURL=table.d.ts.map