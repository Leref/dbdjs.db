"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
class Data {
    constructor(data) {
        this.key = data.key;
        this.value = data.value;
        this.ttl = data.ttl;
        this.file = data.file;
    }
    toJSON() {
        return {
            value: this.value,
            key: this.key,
            ttl: this.ttl,
        };
    }
}
exports.Data = Data;
