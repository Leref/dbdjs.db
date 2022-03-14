import { readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { readFile, rename, rm, writeFile } from "fs/promises";
import { type } from "os";
import { DatabaseEvents } from "../typings/enums";
import {
  HashData,
  KeyValueDataOption,
  KeyValueJSONOption,
  KeyValueSetDataOption,
} from "../typings/interface";
import { decrypt, encrypt, JSONParser } from "../utils/functions";
import { Cacher } from "./cacher";
import { Data } from "./data";
import { KeyValue } from "./database";
import { Queue } from "./queueManager";

export class Table {
  name: string;
  path: string;
  db: KeyValue;
  queue: Queue = new Queue();
  files: string[];
  references: Map<string, string> | string;
  cache: Cacher;
  routers: Record<string, number> = {};
  constructor(name: string, path: string, db: KeyValue) {
    this.name = name;
    this.path = path;
    this.db = db;
    this.cache = new Cacher(this.db.options.cacheOption);
    this.references =
      this.db.options.cacheOption.cacheReference === "MEMORY"
        ? new Map<string, string>()
        : `${this.path}/$referencePath.json`;
    this.files = this._getFiles();
  }
  _getFiles() {
    return readdirSync(this.path).filter((x) => x !== "$referencePath.json");
  }
  async set(key: string, value: KeyValueSetDataOption) {
    const oldData = this.cache.get(key);
    if (oldData) {
      const newData = new Data({
        key,
        ...value,
        file: oldData.file,
      });
      this.cache.set(key, newData);
      this.queue.addToQueue("set", oldData.file, key, newData);
      this.routers[newData.file] += 1;
    } else {
      let file;
      if (this.references instanceof Map) {
        file = this.references.get(key);
        if (file) {
          const newData = new Data({ key, ...value, file: file });
          this.cache.set(key, newData);
          this.queue.addToQueue("set", file, key, newData);
        } else {
          file = this._currentFile();
          if (
            this.routers[file] >= this.db.options.storeOption.maxDataPerFile
          ) {
            this._createNewFile();
            file = this._currentFile();
          }
          const newData = new Data({ key, ...value, file });
          this.cache.set(key, newData);
          this.queue.addToQueue("set", newData.file, key, newData);
          this.routers[newData.file] += 1;
        }
      } else {
        if (!this.queue.queue.tempref) {
          this.queue.queue.tempref = this._getReferenceDataFromFile();
        }
        file = this.queue.queue.tempref?.[key];
        if (file) {
          const newData = new Data({ key, ...value, file: file });
          this.cache.set(key, newData);
          this.queue.addToQueue("set", file, key, newData);
        } else {
          file = this._currentFile();
          if (
            this.routers[file] >= this.db.options.storeOption.maxDataPerFile
          ) {
            this._createNewFile();
          }
          file = this._currentFile();
        }
        const newData = new Data({ key, ...value, file });
        this.cache.set(key, newData);
        this.queue.addToQueue("set", newData.file, key, newData);
        this.routers[newData.file] += 1;
      }
    }
    if (!this.queue.queued.set) {
      this.queue.queued.set = true;
      setTimeout(async () => {
        await this._update();
        delete this.queue.queue.tempref;
        this.queue.queued.set = false;
      }, this.db.options.methodOption.saveTime);
    }
  }
  async _update() {
    const encryptOption = this.db.options.encryptOption;
    const files = this.queue.queue.set;
    for (const [file, mapData] of files) {
      let readData = (await readFile(`${this.path}/${file}`)).toString();
      if (encryptOption.enabled) {
        const HashData = JSONParser<HashData>(readData);
        if (HashData.iv) {
          readData = decrypt(HashData, encryptOption.securitykey);
        } else {
          readData = "{}";
        }
      }
      const JSONData = JSONParser<Record<string, KeyValueJSONOption>>(readData);
      for (const [key, data] of mapData) {
        this.setReference(key, file);
        JSONData[key] = data.toJSON();
      }
      let writeData = JSON.stringify(JSONData);
      if (encryptOption.enabled) {
        writeData = JSON.stringify(
          encrypt(writeData, encryptOption.securitykey),
        );
      }
      await writeFile(`${this.path}/$temp_${file}`, writeData);
      await rm(`${this.path}/${file}`);
      await rename(`${this.path}/$temp_${file}`, `${this.path}/${file}`);

      this.queue.deletePathFromQueue("set", file);
    }
    this._createReferencePath();
  }
  _currentFile() {
    return this.files[this.files.length - 1];
  }
  connect() {
    const encryptOption = this.db.options.encryptOption;
    const files = this.files;
    if (!files.length) {
      this._createNewFile();
    }
    for (const file of files) {
      if (file.startsWith("$temp_")) {
        let JSONData: Record<string, KeyValueDataOption> = {};
        let tempdata = readFileSync(`${this.path}/${file}`);
        let readData = readFileSync(
          `${this.path}/${file.replace("$temp_", "")}`,
        );
        if (tempdata.byteLength > readData.byteLength) {
          if (encryptOption.enabled) {
            const HashData = JSONParser<HashData>(tempdata.toString());
            if (!HashData.iv) {
              this.routers[file] = 0;
              continue;
            }
            JSONData = JSONParser<Record<string, KeyValueDataOption>>(
              decrypt(HashData, encryptOption.securitykey),
            );
          }
        } else {
          JSONData = JSONParser<Record<string, KeyValueDataOption>>(
            readData.toString(),
          );
        }

        const keys = Object.keys(JSONData);
        this.routers[file] = keys.length;
        for (const key of keys) {
          this.cache.set(key, new Data({ ...JSONData[key], file }));
          this.setReference(key, file);
        }
      } else {
        const readData = readFileSync(`${this.path}/${file}`).toString();
        let JSONData;
        if (encryptOption.enabled) {
          const HashData = JSONParser<HashData>(readData);
          if (!HashData.iv) {
            this.routers[file] = 0;
            continue;
          }
          JSONData = JSONParser<Record<string, KeyValueDataOption>>(
            decrypt(HashData, encryptOption.securitykey),
          );
        } else {
          JSONData = JSONParser<Record<string, KeyValueDataOption>>(readData);
        }

        const keys = Object.keys(JSONData);
        this.routers[file] = keys.length;
        for (const key of keys) {
          this.cache.set(key, new Data({ ...JSONData[key], file }));
          this.setReference(key, file);
        }
      }
    }
    if (this.db.options.cacheOption.cacheReference === "DISK") {
      this._createReferencePath();
    }
    this.db.emit(DatabaseEvents.TABLE_READY,this);
  }
  _createNewFile() {
    const fileName = `${this.name}_scheme_${this.files.length + 1}${
      this.db.options.extension
    }`;
    this.files.push(fileName);
    writeFileSync(`${this.path}/${fileName}`, "{}");
    this.routers[fileName] = 0;
  }
  setReference(key: string, file: string) {
    if (this.references instanceof Map) {
      this.references.set(key, file);
    } else {
      if (!this.queue.queue.tempref) this.queue.queue.tempref = {};
      this.queue.queue.tempref[key] = file;
    }
  }
  _getReferenceDataFromFile() {
    let res: Record<string, string>;
    const encryptOption = this.db.options.encryptOption;
    if (typeof this.references !== "string") return;
    let readData = readFileSync(this.references).toString();
    if (encryptOption.enabled) {
      const HashData = JSONParser<HashData>(readData);
      readData = decrypt(HashData, encryptOption.securitykey);
    }
    return JSONParser<Record<string, string>>(readData);
  }
  _createReferencePath() {
    if (typeof this.references !== "string") return;
    const encryptOption = this.db.options.encryptOption;
    let data = JSON.stringify(this.queue.queue.tempref || {});
    if (encryptOption.enabled) {
      const HashData = encrypt(data, encryptOption.securitykey);
      data = JSON.stringify(HashData);
    }
    writeFileSync(this.references, data);
  }
  async get(key: string) {
    let data: Data | undefined = this.cache.get(key);
    if (!data) {
      if (this.references instanceof Map) {
        const file = this.references.get(key);
        if (!file) return;
        const tempdata = await this._get(key, file);
        if (!tempdata) return;
        data = new Data({ ...tempdata, file });
      } else {
        if (!this.queue.queue.tempref)
          this.queue.queue.tempref = this._getReferenceDataFromFile();
        const file = this.queue.queue.tempref?.[key];
        if (!file) return;
        const tempdata = await this._get(key, file);
        if (!tempdata) return;
        data = new Data({ ...tempdata, file });
      }
    }
    if (!this.queue.queued.get) {
      this.queue.queued.get = true;
      setTimeout(() => {
        this.queue.queue.get.clear();
        this.queue.queued.get = false;
      }, this.db.options.methodOption.getTime);
      setTimeout(() => {
        delete this.queue.queue.tempref;
      }, 5000);
    }
    return data;
  }
  async _get(key: string, file: string) {
    const encryptOption = this.db.options.encryptOption;
    if (!this.queue.queue.get.get(file)) {
      let readData = readFileSync(`${this.path}/${file}`).toString();
      if (encryptOption.enabled) {
        const HashData = JSONParser<HashData>(readData);
        if (!HashData.iv) return;
        readData = decrypt(HashData, encryptOption.securitykey);
      }
      const JSONData = JSONParser<Record<string, KeyValueJSONOption>>(readData);
      this.queue.queue.get.set(file, JSONData);
      return JSONData[key];
    } else {
      return this.queue.queue.get.get(file)?.[key];
    }
  }
  async all(filter?: (key: string, file: string) => boolean, limit = 10) {
    let res: Record<string, Data> = {};
    const encryptOption = this.db.options.encryptOption;
    if (!filter) {
      const files = this.files;
      for (const file of files) {
        if (limit <= 0) break;
        let readData = (await readFile(`${this.path}/${file}`)).toString();
        if (encryptOption.enabled) {
          const HashData = JSONParser<HashData>(readData);
          if (!HashData.iv) continue;
          readData = decrypt(HashData, encryptOption.securitykey);
        }
        const JSONData =
          JSONParser<Record<string, KeyValueJSONOption>>(readData);
        const keys = Object.keys(JSONData);
        if (limit < keys.length) {
          let i = 0;
          while (i < limit) {
            res[keys[i]] = new Data({ file, ...JSONData[keys[i]] });
            i++;
          }
          limit = 0;
          continue;
        } else {
          let i = 0;
          while (i < keys.length) {
            res[keys[i]] = new Data({ file, ...JSONData[keys[i]] });
            i++;
          }
          limit -= keys.length;
          continue;
        }
      }
      return res;
    } else {
      let files: Array<string> = [];
      if (this.references instanceof Map) {
        for (const [key, file] of this.references) {
          if (filter(key, file) && files.indexOf(file) === -1) files.push(file);
        }
      } else {
        let ref = this.queue.queue.tempref;
        if (!ref) ref = this._getReferenceDataFromFile();
        if (!ref) {
          files = this.files;
          ref = {};
        }
        for (const key of Array.isArray(ref) ? ref : Object.keys(ref)) {
          if (filter(key, ref[key]) && files.indexOf(ref[key]) === -1)
            files.push(ref[key]);
        }
      }
      for (const file of files) {
        if (limit <= 0) break;
        let readData = (await readFile(`${this.path}/${file}`)).toString();
        if (encryptOption.enabled) {
          const HashData = JSONParser<HashData>(readData);
          if (!HashData.iv) continue;
          readData = decrypt(HashData, encryptOption.securitykey);
        }
        const JSONData =
          JSONParser<Record<string, KeyValueJSONOption>>(readData);
        const keys = Object.keys(JSONData);
        let i = 0;
        while (i < keys.length) {
          if (limit <= 0) break;
          if (filter(keys[i], file)) {
            res[keys[i]] = new Data({ file, ...JSONData[keys[i]] });
            limit -= 1;
          }
          i++;
        }
      }
      return res;
    }
  }
  async delete(key: string) {
    let file;
    if (this.references instanceof Map) {
      file = this.references.get(key);
      if (!file) return;
    } else {
      const ref = this._getReferenceDataFromFile();
      file = ref?.[key];
    }
    if (!file) file = (await this.get(key))?.file;
    if (!file) return;
    if (!this.queue.queue.delete.get(file)) {
      this.queue.queue.delete.set(file, new Set());
    }
    this.queue.addToQueue("delete", file, key);
    if (!this.queue.queued.delete) {
      this.queue.queued.delete = true;
      setTimeout(async () => {
        await this._deleteUpdate();
        this.queue.queued.delete = false;
      }, this.db.options.methodOption.deleteTime);
    }
  }
  async _deleteUpdate() {
    const encryptOption = this.db.options.encryptOption;
    const files = this.queue.queue.delete;
    for (const [file, mapData] of files) {
      let readData = (await readFile(`${this.path}/${file}`)).toString();
      if (encryptOption.enabled) {
        const HashData = JSONParser<HashData>(readData);
        if (HashData.iv) {
          readData = decrypt(HashData, encryptOption.securitykey);
        } else {
          readData = "{}";
        }
      }
      const JSONData = JSONParser<Record<string, KeyValueJSONOption>>(readData);
      for (const key of mapData) {
        this.deleteReference(key);
        delete JSONData[key];
      }
      if (Object.keys(JSONData).length === 0) {
        await rm(`${this.path}/${file}`, {
          recursive: true,
        });
      } else {
        let writeData = JSON.stringify(JSONData);
        if (encryptOption.enabled) {
          if (Object.keys(writeData).length === 0) {
            writeData = "{}";
          } else {
            writeData = JSON.stringify(
              encrypt(writeData, encryptOption.securitykey),
            );
          }
        }
        await writeFile(`${this.path}/$temp_${file}`, writeData);
        await rm(`${this.path}/${file}`);
        await rename(`${this.path}/$temp_${file}`, `${this.path}/${file}`);
      }
      this.queue.deletePathFromQueue("delete", file);
    }
    this._createReferencePath();
  }
  deleteReference(key: string) {
    if (this.references instanceof Map) {
      this.references.delete(key);
    } else {
      if (this.queue.queue.tempref) delete this.queue.queue.tempref[key];
    }
  }
  clear() {
    this.cache.clear();
    rmSync(this.path, {
      recursive: true,
    });
  }
}
