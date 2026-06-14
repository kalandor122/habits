import { readFileSync } from 'fs';
import { join } from 'path';
import pool from './pool.js';

export async function initDatabase() {
  const schemaPath = join(import.meta.dirname, '..', '..', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log('Database schema initialized');
  } finally {
    client.release();
  }
}
