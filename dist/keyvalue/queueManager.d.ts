import { KeyValueJSONOption } from "../typings/interface";
import { Cacher } from "./cacher";
import { Data } from "./data";
export declare class Queue {
    queue: {
        set: Map<string, Map<string, Data>>;
        get: Map<string, Record<string, Data | KeyValueJSONOption>>;
        delete: Map<string, Set<string>>;
        all: Cacher;
        tempref?: Record<string, string>;
    };
    queued: {
        set: boolean;
        get: boolean;
        delete: boolean;
        all: boolean;
    };
    constructor();
    addToQueue(method: "set" | "get" | "delete", path: string, key: string, value?: Data): void;
    deletePathFromQueue(method: "set" | "get" | "delete", path: string): boolean;
}
