import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { env } from "@/lib/env";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Node 24's built-in sqlite has no native compile step (no Python/node-gyp needed).
const sqlite = new DatabaseSync(path.join(dbDir, env.SQLITE_FILE));
sqlite.exec("PRAGMA journal_mode = WAL;");

type Method = "all" | "get" | "run" | "values";

const run = (method: Method, sql: string, params: any[]): any[] => {
  const stmt = sqlite.prepare(sql);
  switch (method) {
    case "all":
    case "get": {
      const rows = stmt.all(...params) as Record<string, unknown>[];
      return method === "get" ? rows.slice(0, 1) : rows;
    }
    case "run": {
      const info = stmt.run(...params) as unknown as {
        lastInsertRowid: number | bigint;
        changes: number;
      };
      return [
        {
          meta: {
            last_insert_rowid: Number(info.lastInsertRowid),
            changes: info.changes,
          },
        },
      ];
    }
    case "values": {
      // stmt.raw() isn't on DatabaseSync in older node; map rows to arrays of values
      return stmt
        .all(...params)
        .map((r) => Object.values(r as Record<string, unknown>));
    }
  }
};

export const db = drizzle(
  async (sql, params, method) => {
    return { rows: run(method, sql, params) };
  },
  { schema },
);
