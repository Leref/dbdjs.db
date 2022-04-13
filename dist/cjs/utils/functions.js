"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.decryptColumnFile = exports.encryptColumnData = exports.decrypt = exports.encrypt = exports.JSONParser = void 0;
const crypto_1 = require("crypto");
const algorithm = "aes-256-ctr";
function JSONParser(readData) {
    let res;
    try {
        res = JSON.parse(readData);
    }
    catch {
        const index = readData.lastIndexOf("}");
        readData = `${readData.slice(0, index + 1)}`;
        try {
            res = JSON.parse(readData);
        }
        catch {
            readData += "}";
            res = JSON.parse(readData);
        }
    }
    return res;
}
exports.JSONParser = JSONParser;
function encrypt(readData, securitykey) {
    const iv = (0, crypto_1.randomBytes)(16);
    const cipher = (0, crypto_1.createCipheriv)(algorithm, securitykey, iv);
    const encrypted = Buffer.concat([cipher.update(readData), cipher.final()]);
    return {
        iv: iv.toString("hex"),
        data: encrypted.toString("hex"),
    };
}
exports.encrypt = encrypt;
function decrypt(hash, securitykey) {
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, securitykey, Buffer.from(hash.iv, "hex"));
    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hash.data, "hex")),
        decipher.final(),
    ]);
    return decrpyted.toString();
}
exports.decrypt = decrypt;
function encryptColumnData(data, securitykey, iv) {
    const cipher = (0, crypto_1.createCipheriv)(algorithm, securitykey, Buffer.from(iv, "hex"));
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted.toString("hex");
}
exports.encryptColumnData = encryptColumnData;
function decryptColumnFile(readData, iv, securitykey) {
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, securitykey, Buffer.from(iv, "hex"));
    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(readData, "hex")),
        decipher.final(),
    ]);
    return decrpyted.toString();
}
exports.decryptColumnFile = decryptColumnFile;
function stringify(data) {
    if (typeof data === "string") {
        return data;
    }
    else if (typeof data === "number") {
        return data.toString();
    }
    else if (typeof data === "boolean") {
        return data.toString();
    }
    else if (data instanceof Date) {
        return data.toISOString();
    }
    else if (typeof data === "object" && !(data instanceof Buffer || data instanceof ReadableStream)) {
        return JSON.stringify(data);
    }
    else if (typeof data === "bigint") {
        return data.toString();
    }
    else if (data instanceof Buffer) {
        return data.toString("hex");
    }
    else {
        return data.toString();
    }
}
exports.stringify = stringify;
//# sourceMappingURL=functions.js.map