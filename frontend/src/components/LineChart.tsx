import { useState } from 'react';
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useDailyStats } from '../hooks/useStats';

const TIMEFRAMES = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '3m', days: 90 },
  { label: '1y', days: 365 },
] as const;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTooltipDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LineChart() {
  const [days, setDays] = useState(7);
  const { data: stats } = useDailyStats(days);

  const data = (stats || []).map((s) => ({
    date: formatDate(s.date),
    rawDate: s.date,
    pct: s.pct,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Completion %</h2>
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.days}
              onClick={() => setDays(tf.days)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                days === tf.days
                  ? 'bg-green-500 text-white'
                  : 'text-gray-500 hover:text-gray-800 border border-gray-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLine data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                fontSize: '12px',
              }}
              labelFormatter={(label, payload) =>
                payload?.[0]?.payload?.rawDate
                  ? formatTooltipDate(payload[0].payload.rawDate)
                  : label
              }
              formatter={(value: number) => [`${value}%`, 'Completion']}
            />
            <Line
              type="monotone"
              dataKey="pct"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#fff', stroke: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ fill: '#22c55e', stroke: '#fff', strokeWidth: 2, r: 6 }}
            />
          </RechartsLine>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
