import { useMemo } from 'react';
import { useYearStats } from '../hooks/useStats';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const;

function getIntensity(pct: number): number {
  if (pct === 0) return 0;
  if (pct <= 25) return 1;
  if (pct <= 50) return 2;
  if (pct <= 75) return 3;
  return 4;
}

const SHADES = [
  'bg-gray-200 border border-black-100',
  'bg-green-100 border border-green-200',
  'bg-green-200 border border-green-300',
  'bg-green-400 border border-green-500',
  'bg-green-700 border border-green-800',
];

function normalizeDate(dateStr: string): string {
  return dateStr.slice(0, 10);
}

export default function GitHubGrid() {
  const year = new Date().getFullYear();
  const { data: stats } = useYearStats(year);

  const grid = useMemo(() => {
    if (!stats) return { weeks: [] as { days: { date: string; pct: number; level: number }[] }[] };

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;

    const map = new Map<string, number>();
    for (const s of stats) {
      const key = normalizeDate(s.date);
      map.set(key, parseFloat(s.pct as unknown as string) || 0);
    }

    const days: { date: string; pct: number; level: number }[] = [];
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const pct = map.get(key) || 0;
      days.push({ date: key, pct, level: getIntensity(pct) });
    }

    const pad = start.getDay();
    for (let i = 0; i < pad; i++) {
      days.unshift({ date: '', pct: 0, level: 0 });
    }

    const weeks: { days: { date: string; pct: number; level: number }[] }[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ days: days.slice(i, i + 7) });
    }

    return { weeks };
  }, [stats, year]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{year}</h2>
      <div className="flex gap-1">
        <div className="flex flex-col gap-[3px] mr-1">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-[14px] text-[10px] text-gray-400 leading-[14px]">
              {label}
            </div>
          ))}
        </div>
        <div className="flex gap-[3px] overflow-x-auto">
          {grid.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.days.map((day, di) => (
                <div
                  key={di}
                  title={day.date ? `${day.date}: ${day.pct}%` : ''}
                  className={`w-[14px] h-[14px] ${day.date ? SHADES[day.level] : 'bg-transparent border border-transparent'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
