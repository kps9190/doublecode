import type { IncomingMessage, ServerResponse } from "node:http";
import { config } from "./config.ts";
import type { RequestMeta } from "./types.ts";

export function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": config.corsOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Accept",
    });
    res.end(JSON.stringify(body));
}

export function sendEmpty(res: ServerResponse, statusCode: number): void {
    res.writeHead(statusCode, {
        "Access-Control-Allow-Origin": config.corsOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Accept",
    });
    res.end();
}

export function readJson<T>(req: IncomingMessage): Promise<T> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk: Buffer) => {
            body += chunk;
            if (body.length > 64_000) {
                reject(Object.assign(new Error("payload_too_large"), { statusCode: 413 }));
                req.destroy();
            }
        });
        req.on("end", () => {
            try {
                resolve(JSON.parse(body || "{}") as T);
            } catch {
                reject(Object.assign(new Error("invalid_json"), { statusCode: 400 }));
            }
        });
        req.on("error", reject);
    });
}

export function getRequestMeta(req: IncomingMessage): RequestMeta {
    const forwardedFor = req.headers["x-forwarded-for"];
    const ipAddress = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : (forwardedFor || req.socket.remoteAddress || "");

    return {
        ipAddress: String(ipAddress).split(",")[0].trim(),
        userAgent: String(req.headers["user-agent"] || ""),
    };
}
