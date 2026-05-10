import pool from './pool.js';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#22c55e'
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS habits (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  daily_target INTEGER NOT NULL DEFAULT 1,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_tags (
  habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (habit_id, tag_id)
);

CREATE TABLE IF NOT EXISTS completions (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_completions_habit_date ON completions(habit_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(completed_at);

CREATE OR REPLACE VIEW vw_daily_completion AS
WITH dates AS (
  SELECT d::date AS date
  FROM generate_series(
    (SELECT date_trunc('year', MIN(completed_at)) FROM completions),
    CURRENT_DATE,
    '1 day'::interval
  ) d
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
  ) AS completion_pct
FROM per_habit
GROUP BY date
ORDER BY date;

INSERT INTO categories (name, color) VALUES
  ('Health', '#22c55e'),
  ('Productivity', '#3b82f6'),
  ('Learning', '#a855f7'),
  ('Mindfulness', '#f59e0b')
ON CONFLICT (name) DO NOTHING;
`;

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('Database schema initialized');
  } finally {
    client.release();
  }
}
