import client from './client';
import type { DailyStat, TodayStat, StreakData } from '../types/types';

export function fetchDailyStats(days: number): Promise<DailyStat[]> {
  return client.get('/stats/daily', { params: { days } }).then((r) => r.data);
}

export function fetchYearStats(year: number): Promise<DailyStat[]> {
  return client.get(`/stats/year/${year}`).then((r) => r.data);
}

export function fetchTodayStat(): Promise<TodayStat> {
  return client.get('/stats/today').then((r) => r.data);
}

export function fetchStreak(): Promise<StreakData> {
  return client.get('/stats/streak').then((r) => r.data);
}
