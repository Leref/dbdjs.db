import { existsSync, mkdirSync, writeFileSync } from "fs";
import { TypedEmitter } from "tiny-typed-emitter";
import { DatabaseEvents } from "../typings/enums";
import {
  KeyValueDatabaseOption,
  KeyValueDataOption,
  TypedDatabaseEvents,
} from "../typings/interface";
import { CacheReferenceType } from "../typings/type";
import { KeyValueError } from "./error";
import { Table } from "./table";

export class KeyValue extends TypedEmitter<TypedDatabaseEvents> {
  tables: Map<string, Table> = new Map<string, Table>();
  options: {
    path: string;
    extension: string;
    tables: string[];
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
    storeOption: { maxDataPerFile: number };
    timeOption: {
      saveCreatedTimestamp: boolean;
      saveModifiedTimestamp: boolean;
    };
  };

  constructor(options: KeyValueDatabaseOption) {
    super();
    this.options = this._resolve(options);
  }
  _resolve(options: KeyValueDatabaseOption) {
    return {
      path: options.path ?? "./database",
      extension: options.extension ?? ".sql",
      tables: options.tables ?? ["main"],
      cacheOption: {
        cacheReference: options.cacheOption?.cacheReference ?? "MEMORY",
        limit: 10000,
        sorted: options.cacheOption?.sorted ?? false,
      },
      encryptOption: {
        enabled: options.encryptOption?.enabled ?? false,
        securitykey: options.encryptOption?.securitykey ?? "",
      },
      methodOption: {
        allTime: options.methodOption?.allTime ?? 1000,
        deleteTime: options.methodOption?.deleteTime ?? 100,
        getTime: options.methodOption?.getTime ?? 1000,
        saveTime: options.methodOption?.saveTime ?? 100,
      },
      storeOption: {
        maxDataPerFile: options.storeOption?.maxDataPerFile ?? 10000,
      },
      timeOption: {
        saveCreatedTimestamp: options.timeOption?.saveCreatedTimestamp ?? false,
        saveModifiedTimestamp:
          options.timeOption?.saveModifiedTimestamp ?? false,
      },
    };
  }
  connect() {
    if (!existsSync(this.options.path)) {
      mkdirSync(this.options.path, {
        recursive: true,
      });
    }
    for (const table of this.options.tables) {
      if (!existsSync(`${this.options.path}/${table}`)) {
        mkdirSync(`${this.options.path}/${table}`);
        writeFileSync(
          `${this.options.path}/${table}/${table}_scheme_1.sql`,
          "{}",
        );
      }
      const newtable = new Table(table, `${this.options.path}/${table}`, this);
      newtable.connect();
      this.tables.set(table, newtable);
    }
    this.emit(DatabaseEvents.READY)
  }
  async set(table: string, key: string, value: KeyValueDataOption) {
    const tableClass = this.tables.get(table);
    if (!tableClass) {
      throw new KeyValueError(`[InvalidTable] :  Table ${table} not found!`);
    }
    return await tableClass.set(key, value);
  }
}
