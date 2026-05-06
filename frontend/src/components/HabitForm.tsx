import { useState } from 'react';
import type { Category, Tag } from '../types/types';
import { useCreateHabit } from '../hooks/useHabits';

interface Props {
  categories: Category[];
  tags: Tag[];
  onClose: () => void;
}

export default function HabitForm({ categories, tags, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [dailyTarget, setDailyTarget] = useState(1);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const createHabit = useCreateHabit();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createHabit.mutate(
      { title: title.trim(), category_id: categoryId || null, tags: selectedTags, daily_target: dailyTarget },
      { onSuccess: () => onClose() }
    );
  }

  function toggleTag(tagId: number) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Habit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              placeholder="e.g. Morning run"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Times per day</label>
            <input
              type="number"
              min={1}
              value={dailyTarget}
              onChange={(e) => setDailyTarget(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedTags.includes(t.id)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || createHabit.isPending}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {createHabit.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
