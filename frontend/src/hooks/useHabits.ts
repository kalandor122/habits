import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchHabits, createHabit, updateHabit, deleteHabit } from '../api/habits';
import type { Habit } from '../types/types';

export function useHabits() {
  return useQuery<Habit[]>({ queryKey: ['habits'], queryFn: fetchHabits });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Habit> }) => updateHabit(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}
