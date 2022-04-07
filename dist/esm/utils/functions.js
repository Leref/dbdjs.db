import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
const algorithm = "aes-256-ctr";
export function JSONParser(readData) {
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
export function encrypt(readData, securitykey) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, securitykey, iv);
    const encrypted = Buffer.concat([cipher.update(readData), cipher.final()]);
    return {
        iv: iv.toString("hex"),
        data: encrypted.toString("hex"),
    };
}
export function decrypt(hash, securitykey) {
    const decipher = createDecipheriv(algorithm, securitykey, Buffer.from(hash.iv, "hex"));
    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hash.data, "hex")),
        decipher.final(),
    ]);
    return decrpyted.toString();
}
//# sourceMappingURL=functions.js.map