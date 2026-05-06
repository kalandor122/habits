import { useMemo } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useCompletionsRange, useCreateCompletion, useClearCompletions } from '../hooks/useCompletions';
import HabitRow from './HabitRow';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDates(): Date[] {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function CheckboxMatrix() {
  const { data: habits } = useHabits();
  const createCompletion = useCreateCompletion();
  const clearCompletions = useClearCompletions();

  const weekDates = useMemo(() => getWeekDates(), []);
  const dateFrom = toDateStr(weekDates[0]);
  const dateTo = toDateStr(weekDates[6]);

  const { data: rangeCompletions } = useCompletionsRange(dateFrom, dateTo);

  function getCellState(habitId: number, date: Date) {
    const dateStr = toDateStr(date);
    const comps = (rangeCompletions || []).filter(
      (c) => c.habit_id === habitId && (c.date || c.completed_at?.slice(0, 10)) === dateStr
    );
    return { count: comps.length, ids: comps.map((c) => c.id) };
  }

  function handleCellClick(habitId: number, target: number, date: Date, ids: number[]) {
    const dateStr = toDateStr(date);
    if (ids.length >= target) {
      clearCompletions.mutate({ habit_id: habitId, date: dateStr });
    } else {
      createCompletion.mutate({ habit_id: habitId, date: dateStr });
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            <th className="text-left text-xs text-gray-400 font-medium pb-2 w-48 border-b border-white-200 border-r border-gray-100">
              Habit
            </th>
            {weekDates.map((d, i) => (
              <th key={i} className="text-center text-xs text-gray-400 font-medium pb-2 w-20 border-b border-white-200 border-r border-gray-100 last:border-r-0">
                <div>{DAYS[i]}</div>
                <div className="text-gray-300">{d.getDate()}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(habits || []).map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              weekDates={weekDates}
              getCellState={getCellState}
              onCellClick={handleCellClick}
            />
          ))}
          {(!habits || habits.length === 0) && (
            <tr>
              <td colSpan={8} className="text-center text-gray-400 py-12 text-sm border-b border-gray-100">
                No habits yet. Click <span className="text-green-600 font-medium">+ Habit</span> to add one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
