import type { Habit } from '../types/types';
import { useDeleteHabit } from '../hooks/useHabits';
import { isSameDay } from 'date-fns';

interface Props {
  habit: Habit;
  weekDates: Date[];
  getCellState: (habitId: number, date: Date) => { count: number; ids: number[] };
  onCellClick: (habitId: number, target: number, date: Date, ids: number[]) => void;
}

export default function HabitRow({ habit, weekDates, getCellState, onCellClick }: Props) {
  const today = new Date();
  const deleteHabit = useDeleteHabit();

  return (
    <tr className="border-b border-gray-100 group">
      <td className="py-3 pr-4 w-48 border-r border-gray-100">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: habit.category_color || '#22c55e' }}
          />
          <span className="text-sm text-gray-800 truncate">{habit.title}</span>
          <button
            onClick={() => deleteHabit.mutate(habit.id)}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 text-xs"
            title="Remove habit"
          >
            ✕
          </button>
          {habit.tags.length > 0 && (
            <div className="flex gap-1 ml-1">
              {habit.tags.map((t) => (
                <span key={t.id} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                  {t.name}
                </span>
              ))}
            </div>
          )}
          {habit.daily_target > 1 && (
            <span className="text-[10px] text-green-500 font-medium">×{habit.daily_target}</span>
          )}
        </div>
      </td>
      {weekDates.map((date, i) => {
        const { count, ids } = getCellState(habit.id, date);
        const isComplete = count >= habit.daily_target;
        const isToday = isSameDay(date, today);

        return (
          <td key={i} className="text-center py-2 w-20 border-r border-gray-100 last:border-r-0">
            <button
              onClick={() => onCellClick(habit.id, habit.daily_target, date, ids)}
              className={`w-10 h-10 rounded-lg border transition-all duration-150 flex items-center justify-center text-xs font-medium border-gray-300 mx-auto
                ${isComplete
                  ? 'bg-green-500 border-green-500 text-white'
                  : count > 0
                  ? 'bg-green-100 border-green-200 text-green-700'
                  : isToday
                  ? 'border-green-200 hover:bg-green-50 text-gray-400'
                  : 'border-gray-100 text-gray-300 hover:border-gray-300'
                }
                ${isToday && !isComplete ? 'ring-1 ring-green-200' : ''}
              `}
            >
              {habit.daily_target > 1 ? `${count}/${habit.daily_target}` : isComplete ? '✓' : ''}
            </button>
          </td>
        );
      })}
    </tr>
  );
}
