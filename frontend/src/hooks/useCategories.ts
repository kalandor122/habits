import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory } from '../api/categories';
import type { Category } from '../types/types';

export function useCategories() {
  return useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategories });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}
