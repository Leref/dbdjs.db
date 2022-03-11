import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { HashData, KeyValueJSONOption } from "../typings/interface";
const algorithm = "aes-256-ctr";
export function JSONParser<T>(readData: string) {
  let res: T ;
  try {
    res = JSON.parse(readData);
  } catch {
    const index = readData.lastIndexOf("}");
    readData = `${readData.slice(0, index + 1)}}`;
    res = JSON.parse(readData);
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
