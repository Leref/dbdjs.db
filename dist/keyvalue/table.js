"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const enums_1 = require("../typings/enums");
const functions_1 = require("../utils/functions");
const cacher_1 = require("./cacher");
const data_1 = require("./data");
const queueManager_1 = require("./queueManager");
class Table {
    constructor(name, path, db) {
        this.queue = new queueManager_1.Queue();
        this.routers = {};
        this.ready = false;
        this.readyTimestamp = -1;
        this.name = name;
        this.path = path;
        this.db = db;
        this.cache = new cacher_1.Cacher(this.db.options.cacheOption);
        this.references =
            this.db.options.cacheOption.cacheReference === "MEMORY"
                ? new Map()
                : `${this.path}/$referencePath.json`;
        this.files = this._getFiles();
    }
    _getFiles() {
        return (0, fs_1.readdirSync)(this.path).filter((x) => x !== "$referencePath.json");
    }
    async set(key, value) {
        const oldData = this.cache.get(key);
        if (oldData) {
            const newData = new data_1.Data({
                key,
                ...value,
                file: oldData.file,
            });
            this.cache.set(key, newData);
            this.queue.addToQueue("set", oldData.file, key, newData);
            this.routers[newData.file] += 1;
        }
        else {
            let file;
            if (this.references instanceof Map) {
                file = this.references.get(key);
                if (file) {
                    const newData = new data_1.Data({ key, ...value, file: file });
                    this.cache.set(key, newData);
                    this.queue.addToQueue("set", file, key, newData);
                }
                else {
                    file = this._currentFile();
                    if (this.routers[file] >= this.db.options.storeOption.maxDataPerFile) {
                        this._createNewFile();
                        file = this._currentFile();
                    }
                    const newData = new data_1.Data({ key, ...value, file });
                    this.cache.set(key, newData);
                    this.queue.addToQueue("set", newData.file, key, newData);
                    this.routers[newData.file] += 1;
                }
            }
            else {
                if (!this.queue.queue.tempref) {
                    this.queue.queue.tempref = this._getReferenceDataFromFile();
                }
                file = this.queue.queue.tempref?.[key];
                if (file) {
                    const newData = new data_1.Data({ key, ...value, file: file });
                    this.cache.set(key, newData);
                    this.queue.addToQueue("set", file, key, newData);
                }
                else {
                    file = this._currentFile();
                    if (this.routers[file] >= this.db.options.storeOption.maxDataPerFile) {
                        this._createNewFile();
                    }
                    file = this._currentFile();
                }
                const newData = new data_1.Data({ key, ...value, file });
                this.cache.set(key, newData);
                this.queue.addToQueue("set", newData.file, key, newData);
                this.routers[newData.file] += 1;
            }
        }
        if (!this.queue.queued.set) {
            this.queue.queued.set = true;
            const timeout = setTimeout(async () => {
                await this._update();
                delete this.queue.queue.tempref;
                this.queue.queued.set = false;
                clearTimeout(timeout);
            }, this.db.options.methodOption.saveTime);
        }
    }
    async _update() {
        const encryptOption = this.db.options.encryptOption;
        const files = this.queue.queue.set;
        for (const [file, mapData] of files) {
            let readData = (await (0, promises_1.readFile)(`${this.path}/${file}`)).toString();
            if (encryptOption.enabled) {
                const HashData = (0, functions_1.JSONParser)(readData);
                if (HashData.iv) {
                    readData = (0, functions_1.decrypt)(HashData, encryptOption.securitykey);
                }
                else {
                    readData = "{}";
                }
            }
            const JSONData = (0, functions_1.JSONParser)(readData);
            for (const [key, data] of mapData) {
                this.setReference(key, file);
                JSONData[key] = data.toJSON();
            }
            let writeData = JSON.stringify(JSONData);
            if (encryptOption.enabled) {
                writeData = JSON.stringify((0, functions_1.encrypt)(writeData, encryptOption.securitykey));
            }
            await (0, promises_1.writeFile)(`${this.path}/$temp_${file}`, writeData);
            await (0, promises_1.rm)(`${this.path}/${file}`);
            await (0, promises_1.rename)(`${this.path}/$temp_${file}`, `${this.path}/${file}`);
            this.queue.deletePathFromQueue("set", file);
        }
        this._createReferencePath();
    }
    _currentFile() {
        return this.files[this.files.length - 1];
    }
    connect() {
        const encryptOption = this.db.options.encryptOption;
        const start = performance.now();
        const files = this.files;
        if (!files.length) {
            this._createNewFile();
            this.db._debug("ADDTABLEFILE", `created Table ${this.name} file`);
        }
        for (const file of files) {
            if (file.startsWith("$temp_")) {
                let JSONData = {};
                let tempdata = (0, fs_1.readFileSync)(`${this.path}/${file}`);
                let readData = (0, fs_1.readFileSync)(`${this.path}/${file.replace("$temp_", "")}`);
                if (tempdata.byteLength > readData.byteLength) {
                    if (encryptOption.enabled) {
                        const HashData = (0, functions_1.JSONParser)(tempdata.toString());
                        if (!HashData.iv) {
                            this.routers[file] = 0;
                            continue;
                        }
                        JSONData = (0, functions_1.JSONParser)((0, functions_1.decrypt)(HashData, encryptOption.securitykey));
                    }
                }
                else {
                    JSONData = (0, functions_1.JSONParser)(readData.toString());
                }
                const keys = Object.keys(JSONData);
                this.routers[file] = keys.length;
                for (const key of keys) {
                    if (JSONData[key].ttl) {
                        const timeout = setTimeout(() => {
                            this.delete(key);
                            clearTimeout(timeout);
                        }, JSONData[key].ttl).unref();
                    }
                    this.cache.manualSet(key, new data_1.Data({ ...JSONData[key], file }));
                    this.setReference(key, file);
                }
            }
            else {
                const readData = (0, fs_1.readFileSync)(`${this.path}/${file}`).toString();
                let JSONData;
                if (encryptOption.enabled) {
                    const HashData = (0, functions_1.JSONParser)(readData);
                    if (!HashData.iv) {
                        this.routers[file] = 0;
                        continue;
                    }
                    JSONData = (0, functions_1.JSONParser)((0, functions_1.decrypt)(HashData, encryptOption.securitykey));
                }
                else {
                    JSONData = (0, functions_1.JSONParser)(readData);
                }
                const keys = Object.keys(JSONData);
                this.routers[file] = keys.length;
                for (const key of keys) {
                    this.cache.manualSet(key, new data_1.Data({ ...JSONData[key], file }));
                    this.setReference(key, file);
                }
            }
        }
        this.cache.sort();
        if (this.db.options.cacheOption.cacheReference === "DISK") {
            this._createReferencePath();
        }
        this.db.emit(enums_1.DatabaseEvents.TABLE_READY, this);
        this.ready = true;
        this.readyTimestamp = Date.now();
        this.db._debug("TABLE_READY", `
      |----------------|------------------------|
      | connectionTime | ${(performance.now() - start).toFixed(5)}ms |
      | readyTimestamp | ${this.readyTimestamp} |`);
    }
    _createNewFile() {
        const fileName = `${this.name}_scheme_${this.files.length + 1}${this.db.options.extension}`;
        this.files.push(fileName);
        (0, fs_1.writeFileSync)(`${this.path}/${fileName}`, "{}");
        this.routers[fileName] = 0;
    }
    setReference(key, file) {
        if (this.references instanceof Map) {
            this.references.set(key, file);
        }
        else {
            if (!this.queue.queue.tempref)
                this.queue.queue.tempref = {};
            this.queue.queue.tempref[key] = file;
        }
    }
    _getReferenceDataFromFile() {
        let res;
        const encryptOption = this.db.options.encryptOption;
        if (typeof this.references !== "string")
            return;
        let readData = (0, fs_1.readFileSync)(this.references).toString();
        if (encryptOption.enabled) {
            const HashData = (0, functions_1.JSONParser)(readData);
            readData = (0, functions_1.decrypt)(HashData, encryptOption.securitykey);
        }
        return (0, functions_1.JSONParser)(readData);
    }
    _createReferencePath() {
        if (typeof this.references !== "string")
            return;
        const encryptOption = this.db.options.encryptOption;
        let data = JSON.stringify(this.queue.queue.tempref || {});
        if (encryptOption.enabled) {
            const HashData = (0, functions_1.encrypt)(data, encryptOption.securitykey);
            data = JSON.stringify(HashData);
        }
        (0, fs_1.writeFileSync)(this.references, data);
    }
    async get(key) {
        let data = this.cache.get(key);
        if (!data) {
            if (this.references instanceof Map) {
                const file = this.references.get(key);
                if (!file)
                    return;
                const tempdata = await this._get(key, file);
                if (!tempdata)
                    return;
                data = new data_1.Data({ ...tempdata, file });
            }
            else {
                if (!this.queue.queue.tempref)
                    this.queue.queue.tempref = this._getReferenceDataFromFile();
                const file = this.queue.queue.tempref?.[key];
                if (!file)
                    return;
                const tempdata = await this._get(key, file);
                if (!tempdata)
                    return;
                data = new data_1.Data({ ...tempdata, file });
            }
        }
        if (!this.queue.queued.get) {
            this.queue.queued.get = true;
            const timeout = setTimeout(() => {
                this.queue.queue.get.clear();
                this.queue.queued.get = false;
                clearTimeout(timeout);
            }, this.db.options.methodOption.getTime).unref();
            const refTimeout = setTimeout(() => {
                delete this.queue.queue.tempref;
                clearTimeout(refTimeout);
            }, 5000).unref();
        }
        return data;
    }
    async _get(key, file) {
        const encryptOption = this.db.options.encryptOption;
        if (!this.queue.queue.get.get(file)) {
            let readData = (0, fs_1.readFileSync)(`${this.path}/${file}`).toString();
            if (encryptOption.enabled) {
                const HashData = (0, functions_1.JSONParser)(readData);
                if (!HashData.iv)
                    return;
                readData = (0, functions_1.decrypt)(HashData, encryptOption.securitykey);
            }
            const JSONData = (0, functions_1.JSONParser)(readData);
            this.queue.queue.get.set(file, JSONData);
            return JSONData[key];
        }
        else {
            return this.queue.queue.get.get(file)?.[key];
        }
    }
    async all(filter, limit = 10, sortType = "desc") {
        limit =
            limit === Infinity
                ? Object.values(this.routers).reduce((a, b) => a + b)
                : limit;
        let res = [];
        const encryptOption = this.db.options.encryptOption;
        if (this.queue.queued.all) {
            if (!filter) {
                res = [...this.queue.queue.all.data.values()];
                res =
                    sortType === "desc"
                        ? res.slice(0, limit)
                        : res.reverse().slice(0, limit);
                return res;
            }
            else {
                res = this.queue.queue.all.filter((_, key) => filter(key));
                res =
                    sortType === "desc"
                        ? res.slice(0, limit)
                        : res.reverse().slice(0, limit);
                return res;
            }
        }
        else {
            this.queue.queued.all = true;
            this.files.forEach((file) => {
                const readData = (0, fs_1.readFileSync)(`${this.path}/${file}`).toString();
                let JSONData;
                if (encryptOption.enabled) {
                    const HashData = (0, functions_1.JSONParser)(readData);
                    if (!HashData.iv) {
                        JSONData = {};
                    }
                    else {
                        JSONData = (0, functions_1.JSONParser)((0, functions_1.decrypt)(HashData, encryptOption.securitykey));
                    }
                }
                else {
                    JSONData = (0, functions_1.JSONParser)(readData);
                }
                const keys = Object.keys(JSONData);
                for (const key of keys) {
                    const data = new data_1.Data({ ...JSONData[key], file });
                    this.queue.queue.all.manualSet(key, data);
                }
            });
            this.queue.queue.all.sort();
            const timeout = setTimeout(() => {
                this.queue.queue.all.clear();
                this.queue.queued.all = false;
                clearTimeout(timeout);
            }, this.db.options.methodOption.allTime).unref();
            if (!filter) {
                res = [...this.queue.queue.all.data.values()];
                res =
                    sortType === "desc"
                        ? res.slice(0, limit)
                        : res.reverse().slice(0, limit);
                return res;
            }
            else {
                res = this.queue.queue.all.filter((_, key) => filter(key));
                res =
                    sortType === "desc"
                        ? res.slice(0, limit)
                        : res.reverse().slice(0, limit);
                return res;
            }
        }
    }
    async delete(key) {
        let file;
        if (this.references instanceof Map) {
            file = this.references.get(key);
            if (!file)
                return;
        }
        else {
            const ref = this._getReferenceDataFromFile();
            file = ref?.[key];
        }
        if (!file)
            file = (await this.get(key))?.file;
        if (!file)
            return;
        if (!this.queue.queue.delete.get(file)) {
            this.queue.queue.delete.set(file, new Set());
        }
        this.queue.addToQueue("delete", file, key);
        if (!this.queue.queued.delete) {
            this.queue.queued.delete = true;
            const timeout = setTimeout(async () => {
                await this._deleteUpdate();
                this.queue.queued.delete = false;
                clearTimeout(timeout);
            }, this.db.options.methodOption.deleteTime).unref();
        }
    }
    async _deleteUpdate() {
        const encryptOption = this.db.options.encryptOption;
        const files = this.queue.queue.delete;
        for (const [file, mapData] of files) {
            let readData = (await (0, promises_1.readFile)(`${this.path}/${file}`)).toString();
            if (encryptOption.enabled) {
                const HashData = (0, functions_1.JSONParser)(readData);
                if (HashData.iv) {
                    readData = (0, functions_1.decrypt)(HashData, encryptOption.securitykey);
                }
                else {
                    readData = "{}";
                }
            }
            const JSONData = (0, functions_1.JSONParser)(readData);
            for (const key of mapData) {
                this.deleteReference(key);
                delete JSONData[key];
            }
            if (Object.keys(JSONData).length === 0) {
                await (0, promises_1.rm)(`${this.path}/${file}`, {
                    recursive: true,
                });
            }
            else {
                let writeData = JSON.stringify(JSONData);
                if (encryptOption.enabled) {
                    if (Object.keys(writeData).length === 0) {
                        writeData = "{}";
                    }
                    else {
                        writeData = JSON.stringify((0, functions_1.encrypt)(writeData, encryptOption.securitykey));
                    }
                }
                await (0, promises_1.writeFile)(`${this.path}/$temp_${file}`, writeData);
                await (0, promises_1.rm)(`${this.path}/${file}`);
                await (0, promises_1.rename)(`${this.path}/$temp_${file}`, `${this.path}/${file}`);
            }
            this.queue.deletePathFromQueue("delete", file);
        }
        this._createReferencePath();
    }
    deleteReference(key) {
        if (this.references instanceof Map) {
            this.references.delete(key);
        }
        else {
            if (this.queue.queue.tempref)
                delete this.queue.queue.tempref[key];
        }
    }
    clear() {
        this.cache.clear();
        (0, fs_1.rmSync)(this.path, {
            recursive: true,
        });
    }
    get ping() {
        const randomFile = this.files[Math.floor(Math.random() * this.files.length)];
        const start = performance.now();
        (0, fs_1.readFileSync)(`${this.path}/${randomFile}`);
        return performance.now() - start;
    }
}
exports.Table = Table;
