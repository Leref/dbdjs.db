import {
  RelationalDatabaseOptions,
  RelationalTableOptions,
} from "../typings/interface.js";
import { CacheReferenceType } from "../typings/type.js";
import { Table } from "./table.js";

export class Relational {
  options: {
    path: string;
    extension: string;
    tables: RelationalTableOptions;
    cacheOption: {
      cacheReference: CacheReferenceType;
      limit: number;
      sorted: boolean;
    };
    encryptOption: { enabled: boolean; securitykey: string };
    methodOption: {
      allTime: number;
      deleteTime: number;
      getTime: number;
      saveTime: number;
    };
    storeOption: { maxDataPerFile: number; sorted: boolean };
  };
  tables : Map<string,Table> = new Map<string,Table>();
  constructor(options: RelationalDatabaseOptions) {
    this.options = this._resolve(options);
  }
  _resolve(options: RelationalDatabaseOptions) {
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
