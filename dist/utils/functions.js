"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = exports.JSONParser = void 0;
const crypto_1 = require("crypto");
const algorithm = "aes-256-ctr";
function JSONParser(readData) {
    let res;
    try {
        res = JSON.parse(readData);
    }
    catch {
        const index = readData.lastIndexOf("}");
        readData = `${readData.slice(0, index + 1)}}`;
        res = JSON.parse(readData);
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
