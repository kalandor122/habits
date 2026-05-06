import { useTodayStat, useStreak } from '../hooks/useStats';

export default function Gauge() {
  const { data: stat } = useTodayStat();
  const { data: streakData } = useStreak();
  const pct = stat?.pct ?? 0;
  const streak = streakData?.streak ?? 0;

  const radius = 80;
  const strokeWidth = 12;
  const size = radius * 2;
  const center = radius;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={normalizedRadius}
            fill="transparent"
            stroke="#f0fdf4"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={normalizedRadius}
            fill="transparent"
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{pct}%</span>
          <span className="text-xs text-gray-400">
            {stat?.completed ?? 0} / {stat?.total ?? 0} done
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-lg">{streak > 0 ? '🔥' : ''}</span>
        <span className="font-semibold text-gray-800">{streak}</span>
        <span className="text-gray-400">day{streak !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
