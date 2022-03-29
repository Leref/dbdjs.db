"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
class Data {
    constructor(data) {
        this.key = data.key;
        this.value =
            data.type === "bigint" && (typeof data.value === "string" || typeof data.value === "number") ? BigInt(data.value) : typeof data.value === "number" && data.value > Number.MAX_SAFE_INTEGER
                ? BigInt(data.value)
                : data.value;
        this.type = data.type || typeof this.value;
        this.ttl = data.ttl;
        this.file = data.file;
    }
    toJSON() {
        return {
            value: typeof this.value === "bigint" ? this.value.toString() : this.value,
            type: this.type,
            key: this.key,
            ttl: this.ttl,
        };
    }
}
exports.Data = Data;
