"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const types_1 = require("util/types");
class Data {
    value;
    ttl;
    file;
    key;
    type;
    constructor(data) {
        this.key = data.key;
        this.value =
            data.type === "date" &&
                (typeof data.value === "string" ||
                    typeof data.value === "number" ||
                    (0, types_1.isDate)(data.value))
                ? new Date(data.value)
                : data.type === "bigint" &&
                    (typeof data.value === "string" || typeof data.value === "number")
                    ? BigInt(data.value)
                    : typeof data.value === "number" && data.value > Number.MAX_SAFE_INTEGER
                        ? BigInt(data.value)
                        : data.value;
        this.type =
            data.type ?? (this.value instanceof Date ? "date" : typeof this.value);
        this.ttl = data.ttl;
        this.file = data.file;
    }
    toJSON() {
        return {
            value: (0, types_1.isDate)(this.value)
                ? this.value.toISOString()
                : typeof this.value === "bigint"
                    ? this.value.toString()
                    : this.value,
            type: this.type,
            key: this.key,
            ttl: this.ttl,
        };
    }
}
exports.Data = Data;
//# sourceMappingURL=data.js.map