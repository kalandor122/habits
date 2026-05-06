import { Router, Request, Response } from 'express';
import pool from '../db/pool.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT h.*, c.name AS category_name, c.color AS category_color,
        COALESCE(
          json_agg(json_build_object('id', t.id, 'name', t.name))
          FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) AS tags
      FROM habits h
      LEFT JOIN categories c ON c.id = h.category_id
      LEFT JOIN habit_tags ht ON ht.habit_id = h.id
      LEFT JOIN tags t ON t.id = ht.tag_id
      WHERE h.archived = false
      GROUP BY h.id, c.name, c.color
      ORDER BY h.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, category_id, tags: tagIds, daily_target } = req.body;
    const result = await pool.query(
      `INSERT INTO habits (title, category_id, daily_target) VALUES ($1, $2, $3)
       RETURNING *`,
      [title, category_id || null, daily_target || 1]
    );
    const habit = result.rows[0];

    if (tagIds?.length) {
      for (const tagId of tagIds) {
        await pool.query(
          'INSERT INTO habit_tags (habit_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [habit.id, tagId]
        );
      }
    }

    res.status(201).json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category_id, daily_target, archived } = req.body;
    const result = await pool.query(
      `UPDATE habits SET title = COALESCE($1, title), category_id = COALESCE($2, category_id),
       daily_target = COALESCE($3, daily_target), archived = COALESCE($4, archived)
       WHERE id = $5 RETURNING *`,
      [title, category_id, daily_target, archived, id]
    );

    if (req.body.tags !== undefined) {
      await pool.query('DELETE FROM habit_tags WHERE habit_id = $1', [id]);
      for (const tagId of req.body.tags) {
        await pool.query(
          'INSERT INTO habit_tags (habit_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [id, tagId]
        );
      }
    }

    res.json(result.rows[0] || { error: 'Not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('UPDATE habits SET archived = true WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
