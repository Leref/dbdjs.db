"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
class Data {
    constructor(data) {
        this.key = data.key;
        this.value = data.value;
        this.ttl = data.ttl;
        this.createdTimestamp = data.createdTimestamp;
        this.modifiedTimestamp = data.modifiedTimestamp;
        this.file = data.file;
    }
    toJSON() {
        return {
            value: this.value,
            key: this.key,
            ttl: this.ttl,
            createdTimestamp: this.createdTimestamp,
            modifiedTimestamp: this.modifiedTimestamp,
        };
    }
}
exports.Data = Data;
