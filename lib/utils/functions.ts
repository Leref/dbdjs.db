import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { HashData, KeyValueJSONOption } from "../typings/interface";
import { WideColumnDataValueType } from "../typings/type";
const algorithm = "aes-256-ctr";
export function JSONParser<T>(readData: string) {
  let res: T;
  try {
    res = JSON.parse(readData);
  } catch {
    const index = readData.lastIndexOf("}");
    readData = `${readData.slice(0, index + 1)}`;
    try {
      res = JSON.parse(readData);
    } catch {
      readData += "}";
      res = JSON.parse(readData);
    }
  }
  return res;
}

export function encrypt(readData: string, securitykey: string) {
  const iv = randomBytes(16);

  const cipher = createCipheriv(algorithm, securitykey, iv);

  const encrypted = Buffer.concat([cipher.update(readData), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
  };
}

export function decrypt(hash: HashData, securitykey: string) {
  const decipher = createDecipheriv(
    algorithm,
    securitykey,
    Buffer.from(hash.iv, "hex"),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.data, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export function encryptColumnData(
  data: string,
  securitykey: string,
  iv: string,
) {
  const cipher = createCipheriv(algorithm, securitykey, Buffer.from(iv, "hex"));

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  return encrypted.toString("hex");
}

export function decryptColumnFile(
  readData: string,
  iv: string,
  securitykey: string,
) {
  const decipher = createDecipheriv(
    algorithm,
    securitykey,
    Buffer.from(iv, "hex"),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(readData, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export function stringify(data:WideColumnDataValueType) {
  if(typeof data === "string") {
    return data;
  } else if(typeof data === "number") {
    return data.toString();
  } else if(typeof data === "boolean") {
    return data.toString();
  } else if(data instanceof Date) {
    return data.toISOString();
  } else if(typeof data === "object" && !(data instanceof Buffer || data instanceof ReadableStream)) {
    return JSON.stringify(data);
  } else if(typeof data === "bigint") {
    return data.toString();
  } else if(data instanceof Buffer){
    return data.toString("hex");
  } else {
    return data.toString();
  }

}