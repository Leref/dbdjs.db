import { WideColumnDataValueType } from "../typings/type.js";
import { WideColumnMemMap } from "./cacher.js";
import { Column } from "./column.js";
import { WideColumnData } from "./data.js";
import { WideColumn } from "./database.js";
export declare class WideColumnTable {
    name: string;
    columns: Column[];
    primary: Column;
    db: WideColumn;
    reference: Record<string, Map<WideColumnDataValueType, string>> | string;
    constructor(name: string, columns: Column[], db: WideColumn);
    connect(): Promise<void>;
    set(secondaryColumnData: {
        name: string;
        value: WideColumnDataValueType;
    }, primaryColumnData: {
        name: string;
        value: WideColumnDataValueType;
    }): Promise<void>;
    get logPath(): string;
    get(column: string, primary: WideColumnDataValueType): Promise<string | number | bigint | boolean | object | null | undefined>;
    delete(column: string, primary: WideColumnDataValueType): Promise<boolean | undefined>;
    all(column: string, filter: (value: WideColumnData, key?: WideColumnDataValueType, cacher?: WideColumnMemMap) => boolean, limit?: number): Promise<WideColumnData[] | undefined>;
    get ping(): string;
}
//# sourceMappingURL=table.d.ts.map