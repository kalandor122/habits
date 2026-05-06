import { Router, Request, Response } from 'express';
import pool from '../db/pool.js';

const router = Router();

router.get('/daily', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const result = await pool.query(
      `WITH dates AS (
        SELECT d::date AS date
        FROM generate_series(CURRENT_DATE - ($1 || ' days')::interval, CURRENT_DATE, '1 day'::interval) d
      ),
      per_habit AS (
        SELECT ds.date, h.id, h.daily_target,
          LEAST(COALESCE(SUM(c.count), 0), h.daily_target) AS done
        FROM dates ds
        CROSS JOIN habits h
        LEFT JOIN completions c ON c.habit_id = h.id AND c.completed_at::date = ds.date
        WHERE h.archived = false
        GROUP BY ds.date, h.id, h.daily_target
      )
      SELECT date,
        COALESCE(SUM(done), 0)::integer AS completed,
        COALESCE(SUM(daily_target), 0)::integer AS total,
        ROUND(
          COALESCE(SUM(done), 0)::decimal /
          NULLIF(COALESCE(SUM(daily_target), 0), 0) * 100, 1
        )::text AS pct
      FROM per_habit
      GROUP BY date
      ORDER BY date`,
      [days]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/year/:year', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const result = await pool.query(
      `WITH dates AS (
        SELECT d::date AS date
        FROM generate_series(($1 || '-01-01')::date, LEAST(($1 || '-12-31')::date, CURRENT_DATE), '1 day'::interval) d
      ),
      per_habit AS (
        SELECT ds.date, h.id, h.daily_target,
          LEAST(COALESCE(SUM(c.count), 0), h.daily_target) AS done
        FROM dates ds
        CROSS JOIN habits h
        LEFT JOIN completions c ON c.habit_id = h.id AND c.completed_at::date = ds.date
        WHERE h.archived = false
        GROUP BY ds.date, h.id, h.daily_target
      )
      SELECT date,
        COALESCE(SUM(done), 0)::integer AS completed,
        COALESCE(SUM(daily_target), 0)::integer AS total,
        ROUND(
          COALESCE(SUM(done), 0)::decimal /
          NULLIF(COALESCE(SUM(daily_target), 0), 0) * 100, 1
        )::text AS pct
      FROM per_habit
      GROUP BY date
      ORDER BY date`,
      [year]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/today', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `WITH per_habit AS (
        SELECT h.id, h.daily_target,
          LEAST(COALESCE(SUM(c.count), 0), h.daily_target) AS done
        FROM habits h
        LEFT JOIN completions c ON c.habit_id = h.id AND c.completed_at::date = CURRENT_DATE
        WHERE h.archived = false
        GROUP BY h.id, h.daily_target
      )
      SELECT
        COALESCE(SUM(done), 0)::integer AS completed,
        COALESCE(SUM(daily_target), 0)::integer AS total,
        ROUND(
          COALESCE(SUM(done), 0)::decimal /
          NULLIF(COALESCE(SUM(daily_target), 0), 0) * 100, 1
        )::text AS pct
      FROM per_habit`
    );
    res.json(result.rows[0] || { total: 0, completed: 0, pct: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/completion-detail', async (req: Request, res: Response) => {
  try {
    const from = req.query.from as string;
    const to = req.query.to as string;
    const result = await pool.query(
      `SELECT d::date::text AS date,
        COALESCE(c.habit_id, 0) AS habit_id,
        h.title,
        cat.name AS category,
        COUNT(c.id)::integer AS completions_count,
        h.daily_target
      FROM generate_series($1::date, $2::date, '1 day'::interval) d
      CROSS JOIN habits h
      LEFT JOIN categories cat ON cat.id = h.category_id
      LEFT JOIN completions c ON c.habit_id = h.id AND c.completed_at::date = d
      WHERE h.archived = false
      GROUP BY d, c.habit_id, h.title, cat.name, h.daily_target
      ORDER BY d, h.title`,
      [from, to]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/streak', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `WITH dates AS (
        SELECT d::date AS date
        FROM generate_series(CURRENT_DATE - 366, CURRENT_DATE, '1 day'::interval) d
      ),
      per_habit AS (
        SELECT ds.date, h.id, h.daily_target,
          LEAST(COALESCE(SUM(c.count), 0), h.daily_target) AS done
        FROM dates ds
        CROSS JOIN habits h
        LEFT JOIN completions c ON c.habit_id = h.id AND c.completed_at::date = ds.date
        WHERE h.archived = false
        GROUP BY ds.date, h.id, h.daily_target
      )
      SELECT date,
        COALESCE(SUM(done), 0)::integer AS completed
      FROM per_habit
      GROUP BY date
      ORDER BY date ASC`
    );

    const rows = result.rows;
    let streak = 0;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].completed > 0) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
