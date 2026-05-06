import { useQuery } from '@tanstack/react-query';
import { fetchDailyStats, fetchYearStats, fetchTodayStat, fetchStreak } from '../api/stats';
import type { DailyStat, TodayStat, StreakData } from '../types/types';

function parsePct<T extends { pct: unknown }>(item: T): T & { pct: number } {
  return { ...item, pct: parseFloat(item.pct as string) || 0 };
}

export function useDailyStats(days: number) {
  return useQuery<DailyStat[]>({
    queryKey: ['stats', 'daily', days],
    queryFn: () => fetchDailyStats(days),
    select: (data) => data.map(parsePct),
  });
}

export function useYearStats(year: number) {
  return useQuery<DailyStat[]>({
    queryKey: ['stats', 'year', year],
    queryFn: () => fetchYearStats(year),
    select: (data) => data.map(parsePct),
  });
}

export function useStreak() {
  return useQuery<StreakData>({
    queryKey: ['stats', 'streak'],
    queryFn: fetchStreak,
    refetchInterval: 30000,
  });
}

export function useTodayStat() {
  return useQuery<TodayStat>({
    queryKey: ['stats', 'today'],
    queryFn: fetchTodayStat,
    select: parsePct,
    refetchInterval: 30000,
  });
}
