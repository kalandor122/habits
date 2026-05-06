import client from './client';
import type { Tag } from '../types/types';

export function fetchTags(): Promise<Tag[]> {
  return client.get('/tags').then((r) => r.data);
}

export function createTag(data: { name: string }): Promise<Tag> {
  return client.post('/tags', data).then((r) => r.data);
}
