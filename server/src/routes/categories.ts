import { Router, Request, Response } from 'express';
import pool from '../db/pool.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING *',
      [name, color || '#22c55e']
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'Category already exists' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
