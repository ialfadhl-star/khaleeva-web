import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'khaleeva.db');
const SCHEMA_PATH = path.join(process.cwd(), 'lib', 'schema.sql');

// Next.js build workers each import this module in parallel, so on a brand
// new database several processes race to flip journal_mode to WAL and
// create the schema at the same instant. busy_timeout covers ordinary lock
// waits, but a first-time WAL transition / CREATE TABLE under a thundering
// herd of workers can still exceed it. Retry those two steps with backoff
// as a belt-and-suspenders on top of busy_timeout.
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function execWithRetry(database, sql, retries = 5) {
  for (let attempt = 0; ; attempt++) {
    try {
      database.exec(sql);
      return;
    } catch (err) {
      const busy = err && (err.errcode === 5 || err.errcode === 6);
      if (!busy || attempt >= retries) throw err;
      sleepSync(200 * (attempt + 1));
    }
  }
}

function createConnection() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const database = new DatabaseSync(DB_PATH);
  database.exec('PRAGMA busy_timeout = 5000;');
  execWithRetry(database, 'PRAGMA journal_mode = WAL;');
  database.exec('PRAGMA foreign_keys = ON;');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  execWithRetry(database, schema);
  return database;
}

// Reuse a single connection across Next.js dev hot-reloads.
const globalForDb = globalThis;
export const db = globalForDb.__khaleevaDb || createConnection();
if (process.env.NODE_ENV !== 'production') globalForDb.__khaleevaDb = db;

export function genOrderNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `KHV-${rand}`;
}

// node:sqlite returns rows as null-prototype objects, which React Server
// Components refuse to serialize when passed down to Client Components.
// Spread into a plain object (and do the same for any array of rows).
export function plain(row) {
  return row ? { ...row } : row;
}

export function plainAll(rows) {
  return rows.map((r) => ({ ...r }));
}

export function rowToProduct(row) {
  if (!row) return null;
  return {
    ...row,
    featured: !!row.featured,
    active: !!row.active,
    colors: row.colors ? row.colors.split(',').map((s) => s.trim()).filter(Boolean) : [],
    sizes: row.sizes ? row.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
  };
}
