import pool from './pool.js';

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    console.log('Database connectivity verified');
  } finally {
    client.release();
  }
}
