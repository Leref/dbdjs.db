import { KeyValueJSONOption } from "../typings/interface";
import { Data } from "./data";
export declare class Queue {
    queue: {
        set: Map<string, Map<string, Data>>;
        get: Map<string, Record<string, Data | KeyValueJSONOption>>;
        delete: Map<string, Set<string>>;
        tempref?: Record<string, string>;
    };
    queued: {
        set: boolean;
        get: boolean;
        delete: boolean;
    };
    constructor();
    addToQueue(method: "set" | "get" | "delete", path: string, key: string, value?: Data): void;
    deletePathFromQueue(method: "set" | "get" | "delete", path: string): boolean;
}
