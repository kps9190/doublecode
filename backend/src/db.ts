import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { config } from "./config.ts";

const schemaPath = resolve(config.backendRoot, "schema.sql");

mkdirSync(dirname(config.databasePath), { recursive: true });

export const db = new DatabaseSync(config.databasePath);
db.exec("PRAGMA foreign_keys = ON");
db.exec(readFileSync(schemaPath, "utf8"));

export function runTransaction<T>(work: () => T): T {
    try {
        db.exec("BEGIN");
        const result = work();
        db.exec("COMMIT");
        return result;
    } catch (error) {
        db.exec("ROLLBACK");
        throw error;
    }
}
