import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTags, createTag } from '../api/tags';
import type { Tag } from '../types/types';

export function useTags() {
  return useQuery<Tag[]>({ queryKey: ['tags'], queryFn: fetchTags });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
}
