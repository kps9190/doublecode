import { dirname, resolve } from "node:path";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(backendRoot, ".env");

if (existsSync(envPath)) {
    loadEnvFile(envPath);
}

export const config = {
    port: Number(process.env.PORT || 4000),
    backendRoot,
    databasePath: resolve(backendRoot, process.env.SQLITE_DB_PATH || "data/feedback.sqlite"),
    passwordPepper: process.env.PASSWORD_PEPPER || "doublecode-dev-password-pepper",
    ipHashSecret: process.env.IP_HASH_SECRET || "doublecode-dev-ip-secret",
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
