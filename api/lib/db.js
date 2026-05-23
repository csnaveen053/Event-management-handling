import { createClient } from "@libsql/client";
import { mkdirSync } from "node:fs";

function getDatabaseUrl() {
  if (process.env.TURSO_DATABASE_URL) return process.env.TURSO_DATABASE_URL;
  if (process.env.VERCEL) return "file:/tmp/events.db";
  return "file:.data/events.db";
}

const url = getDatabaseUrl();
if (url === "file:.data/events.db") {
  mkdirSync(".data", { recursive: true });
}
const authToken = process.env.TURSO_AUTH_TOKEN;

export const client = authToken
  ? createClient({ url, authToken })
  : createClient({ url });

let initialized = false;

export async function initDb() {
  if (initialized) return;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL
    )
  `);
  initialized = true;
}
