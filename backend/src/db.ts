import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";
import { config } from "./config.ts";

const { Pool } = pg;
const schemaPath = resolve(config.backendRoot, "schema.sql");

if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.databaseUrl.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
});

export async function initDatabase(): Promise<void> {
    await pool.query(readFileSync(schemaPath, "utf8"));
}

export async function runTransaction<T>(work: (client: pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const result = await work(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
