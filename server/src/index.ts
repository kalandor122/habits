import express from 'express';
import cors from 'cors';
import pool from './db/pool.js';
import { connect as connectMqtt } from './services/mqtt.js';
import habitsRouter from './routes/habits.js';
import completionsRouter from './routes/completions.js';
import categoriesRouter from './routes/categories.js';
import tagsRouter from './routes/tags.js';
import statsRouter from './routes/stats.js';

const app = express();
const PORT = parseInt(process.env.SERVER_PORT || '3001');

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/habits', habitsRouter);
app.use('/api/completions', completionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/stats', statsRouter);

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('PostgreSQL connection failed, retrying in 5s...');
    setTimeout(start, 5000);
    return;
  }

  connectMqtt();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
