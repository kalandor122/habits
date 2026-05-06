import client from './client';
import type { Category } from '../types/types';

export function fetchCategories(): Promise<Category[]> {
  return client.get('/categories').then((r) => r.data);
}

export function createCategory(data: { name: string; color?: string }): Promise<Category> {
  return client.post('/categories', data).then((r) => r.data);
}
