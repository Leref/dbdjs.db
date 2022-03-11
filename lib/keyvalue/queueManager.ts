import { KeyValueJSONOption } from "../typings/interface";
import { Data } from "./data";

export class Queue {
  queue: {
    set: Map<string, Map<string, Data>>;
    get: Map<string, Record<string, Data | KeyValueJSONOption>>;
    delete: Map<string, Set<string>>;
    tempref?: Record<string, string>;
  };
  queued: { set: boolean; get: boolean; delete: boolean };
  constructor() {
    this.queue = {
      set: new Map<string, Map<string, Data>>(),
      get: new Map<string, Record<string, Data | KeyValueJSONOption>>(),
      delete: new Map<string, Set<string>>(),
    };
    this.queued = {
      set: false,
      get: false,
      delete: false,
    };
  }
  addToQueue(
    method: "set" | "get" | "delete",
    path: string,
    key: string,
    value?: Data,
  ) {
    if (!this.queue[method].get(path)) {
      if (method === "set") {
        if (!value) return;
        this.queue[method].set(path, new Map());
        this.queue[method].get(path)?.set(key, value);
      } else if (method === "get") {
        this.queue[method].set(path, {});
        const data = this.queue[method].get(path);
        if (!value) return;
        if (!data) return;
        else data[key] = value;
      } else {
        this.queue[method].set(path, new Set());
        this.queue[method].get(path)?.add(key);
      }
    } else {
      if (method === "set") {
        if (!value) return;
        this.queue[method].get(path)?.set(key, value);
      } else if (method === "get") {
        const data = this.queue[method].get(path);
        if (!value) return;
        if (!data) return;
        else data[key] = value;
      } else {
        this.queue[method].get(path)?.add(key);
      }
    }
  }
  deletePathFromQueue(method: "set" | "get" | "delete", path: string): boolean {
    return this.queue[method].delete(path);
  }
}
