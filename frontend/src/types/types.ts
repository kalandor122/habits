export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Habit {
  id: number;
  title: string;
  category_id: number | null;
  category_name: string | null;
  category_color: string | null;
  daily_target: number;
  archived: boolean;
  created_at: string;
  tags: Tag[];
}

export interface Completion {
  id: number;
  habit_id: number;
  count: number;
  completed_at: string;
  title?: string;
  daily_target?: number;
  category_name?: string | null;
  date?: string;
}

export interface DailyStat {
  date: string;
  completed: number;
  total: number;
  pct: string;
}

export interface TodayStat {
  total: number;
  completed: number;
  pct: number;
}

export interface StreakData {
  streak: number;
}

export interface CellState {
  habitId: number;
  date: string;
  completions: number;
  target: number;
}
