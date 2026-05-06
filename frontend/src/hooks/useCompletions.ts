import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCompletionsRange, createCompletion, deleteCompletion, clearCompletions } from '../api/completions';
import type { Completion } from '../types/types';

export function useCompletionsRange(from: string, to: string) {
  return useQuery<Completion[]>({
    queryKey: ['completions', 'range', from, to],
    queryFn: () => fetchCompletionsRange(from, to),
    enabled: !!from && !!to,
  });
}

export function useCreateCompletion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ habit_id, date, count = 1 }: { habit_id: number; date: string; count?: number }) =>
      createCompletion(habit_id, date, count),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['completions'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useDeleteCompletion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCompletion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['completions'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useClearCompletions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ habit_id, date }: { habit_id: number; date: string }) =>
      clearCompletions(habit_id, date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['completions'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
