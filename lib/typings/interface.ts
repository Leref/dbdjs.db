import { Table } from "../keyvalue/table";
import { DatabaseEvents } from "./enums";
import {
  CacheReferenceType,
  KeyValueDataValueType,
  RelationalDataValueType,
} from "./type";

export interface KeyValueDataOption {
  value: KeyValueDataValueType;
  key: string;
  file: string;
  ttl: number;
  createdTimestamp: number;
  modifiedTimestamp: number;
}

export interface KeyValueSetDataOption {
  value: KeyValueDataValueType;
  file: string;
  ttl: number;
  createdTimestamp: number;
  modifiedTimestamp: number;
}

export interface KeyValueJSONOption {
  value: KeyValueDataValueType;
  key: string;
  ttl: number;
  createdTimestamp: number;
  modifiedTimestamp: number;
}

export interface KeyValueDatabaseOption {
  path?: string;
  extension?: string;
  tables?: string[];
  cacheOption?: {
    limit?: number;
    cacheReference?: CacheReferenceType;
    sorted?: boolean;
  };
  storeOption?: {
    maxDataPerFile?: number;
  };
  methodOption?: {
    saveTime?: number;
    getTime?: number;
    allTime?: number;
    deleteTime?: number;
  };
  timeOption?: {
    saveCreatedTimestamp?: boolean;
    saveModifiedTimestamp?: boolean;
  };
  encryptOption?: {
    enabled?: boolean;
    securitykey?: string;
  };
}

export interface HashData {
  iv: string;
  data: string;
}

export interface RelationalDatabaseOptions {
  path?: string;
  extension?:string;
  tables: RelationalTableOptions;
  encryptOption?: {
    enabled?: boolean;
    securitykey?: string;
  };
  cacheOption?: {
    cacheReference?: CacheReferenceType;
    sorted?: boolean;
    limit?: number;
  };
  methodOption?: {
    saveTime?: number;
    getTime?: number;
    allTime?: number;
    deleteTime?: number;
  };
  storeOption?: {
    maxDataPerFile?: number;
    sorted?: boolean;
  };
  timeOption?: {
    saveCreatedTimestamp?: boolean;
    saveModifiedTimestamp?: boolean;
  };
}
export interface RelationalTableOptions {
  name: string;
  path: string;
  columnData: ColumnData[];
}

export interface ColumnData {
  name: string;
  primary: boolean;
  defaultValue?: RelationalDataValueType;
  type: RelationalDataValueType;
}

export interface RowData {
  name: string;
  column: string;
  value: RelationalDataValueType;
  file: string;
}

export interface TypedDatabaseEvents {
  ready() : void;
  tableReady(table:Table) : void;
  debug(message:string) : void;
}