import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { config } from "./config.ts";

const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = scryptSync(`${password}${config.passwordPepper}`, salt, KEY_LENGTH).toString("hex");
    return `${HASH_PREFIX}:${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
    const [prefix, salt, hash] = storedHash.split(":");
    if (prefix !== HASH_PREFIX || !salt || !hash) return false;

    const expected = Buffer.from(hash, "hex");
    const actual = Buffer.from(scryptSync(`${password}${config.passwordPepper}`, salt, KEY_LENGTH).toString("hex"), "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashIp(ipAddress: string): string | null {
    if (!ipAddress) return null;
    return createHash("sha256")
        .update(`${config.ipHashSecret}:${ipAddress}`)
        .digest("hex");
}
