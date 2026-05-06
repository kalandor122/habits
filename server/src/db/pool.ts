import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'habits',
  user: process.env.POSTGRES_USER || 'habits',
  password: process.env.POSTGRES_PASSWORD || 'habits_secret',
});

pool.on('error', (err) => {
  console.error('Unexpected pool error', err);
});

export default pool;
