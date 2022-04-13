import { WideColumnMemMap } from "./cacher.js";
import { ColumnDbColumnData } from "../typings/interface.js";
import { WideColumnDataValueType, WideColumnTypes } from "../typings/type.js";
import { WideColumnTable } from "./table.js";
import { WideColumnData } from "./data.js";
export declare class Column {
    name: string;
    routers: Record<string, number>;
    type: WideColumnTypes;
    primary: boolean;
    sortOrder: "ASC" | "DESC";
    memMap?: WideColumnMemMap;
    table: WideColumnTable;
    path: string;
    files: string[];
    logIv: string;
    constructor(options: ColumnDbColumnData);
    setFiles(): void;
    setTable(table: WideColumnTable): void;
    setPath(path: string): void;
    setCache(): void;
    _getFiles(): string[];
    loadData(): Promise<void>;
    parse(value: string): WideColumnDataValueType;
    matchType(data: WideColumnDataValueType): boolean;
    set(key: WideColumnDataValueType, value: WideColumnData): Promise<void>;
    updateLogs(method: "set" | "delete", value: WideColumnData | string): Promise<void>;
    readIvfromLog(): Promise<string>;
    flush(mem?: WideColumnMemMap): Promise<void>;
    newLogCycle(): void;
    get logPath(): string;
    _createNewFile(): void;
    getAllData(): Promise<WideColumnMemMap>;
    eval(str: string): Promise<any>;
    delete(primary: WideColumnDataValueType): Promise<boolean | undefined>;
}
//# sourceMappingURL=column.d.ts.map