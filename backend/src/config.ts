import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(backendRoot, ".env");

if (existsSync(envPath)) {
    loadEnvFile(envPath);
}

function parseCorsOrigins(value: string | undefined): string[] {
    return (value || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}

export const config = {
    port: Number(process.env.PORT || 4000),
    backendRoot,
    databaseUrl: process.env.DATABASE_URL || "",
    passwordPepper: process.env.PASSWORD_PEPPER || "doublecode-dev-password-pepper",
    ipHashSecret: process.env.IP_HASH_SECRET || "doublecode-dev-ip-secret",
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
};
