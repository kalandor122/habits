import client from './client';
import type { Completion } from '../types/types';

export function fetchCompletionsRange(from: string, to: string): Promise<Completion[]> {
  return client.get('/completions/range', { params: { from, to } }).then((r) => r.data);
}

export function createCompletion(habit_id: number, date: string, count = 1): Promise<Completion> {
  return client.post('/completions', { habit_id, count, date }).then((r) => r.data);
}

export function deleteCompletion(id: number): Promise<void> {
  return client.delete(`/completions/${id}`).then((r) => r.data);
}

export function clearCompletions(habit_id: number, date: string): Promise<void> {
  return client.delete('/completions', { params: { habit_id, date } }).then((r) => r.data);
}
