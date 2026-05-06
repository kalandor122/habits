import { Router, Request, Response } from 'express';
import pool from '../db/pool.js';
import { publishCompletion } from '../services/mqtt.js';

const router = Router();

router.get('/today', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.habit_id, c.count, c.completed_at,
        h.title, h.daily_target, h.category_id, cat.name AS category_name
      FROM completions c
      JOIN habits h ON h.id = c.habit_id
      LEFT JOIN categories cat ON cat.id = h.category_id
      WHERE c.completed_at::date = CURRENT_DATE
      ORDER BY c.habit_id, c.completed_at
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/range', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const result = await pool.query(
      `SELECT c.id, c.habit_id, c.count, c.completed_at::date::text AS date,
        h.title, h.daily_target, h.category_id, cat.name AS category_name
       FROM completions c
       JOIN habits h ON h.id = c.habit_id
       LEFT JOIN categories cat ON cat.id = h.category_id
       WHERE c.completed_at::date >= $1 AND c.completed_at::date <= $2
       ORDER BY c.habit_id, c.completed_at`,
      [from, to]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { habit_id, count, date } = req.body;

    const habitResult = await pool.query(
      'SELECT h.title, c.name AS category_name FROM habits h LEFT JOIN categories c ON c.id = h.category_id WHERE h.id = $1',
      [habit_id]
    );
    if (!habitResult.rows.length) return res.status(404).json({ error: 'Habit not found' });

    let completedAt: string;
    if (date) {
      completedAt = `${date} ${new Date().toTimeString().slice(0, 8)}+00`;
    } else {
      completedAt = new Date().toISOString();
    }

    const result = await pool.query(
      `INSERT INTO completions (habit_id, count, completed_at) VALUES ($1, $2, $3) RETURNING *`,
      [habit_id, count || 1, completedAt]
    );

    const habit = habitResult.rows[0];
    publishCompletion({
      habit_id,
      title: habit.title,
      category: habit.category_name,
      timestamp: result.rows[0].completed_at,
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const { habit_id, date } = req.query;
    await pool.query(
      'DELETE FROM completions WHERE habit_id = $1 AND completed_at::date = $2::date',
      [habit_id, date]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM completions WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
