import client from './client';
import type { Habit } from '../types/types';

export function fetchHabits(): Promise<Habit[]> {
  return client.get('/habits').then((r) => r.data);
}

export function createHabit(data: { title: string; category_id?: number | null; tags?: number[]; daily_target?: number }): Promise<Habit> {
  return client.post('/habits', data).then((r) => r.data);
}

export function updateHabit(id: number, data: Partial<Habit>): Promise<Habit> {
  return client.put(`/habits/${id}`, data).then((r) => r.data);
}

export function deleteHabit(id: number): Promise<void> {
  return client.delete(`/habits/${id}`).then((r) => r.data);
}
