import { HashData } from "../typings/interface";
export declare function JSONParser<T>(readData: string): T;
export declare function encrypt(readData: string, securitykey: string): {
    iv: string;
    data: string;
};
export declare function decrypt(hash: HashData, securitykey: string): string;
