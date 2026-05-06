import { useState } from 'react';
import { useCategories } from './hooks/useCategories';
import { useTags } from './hooks/useTags';
import CheckboxMatrix from './components/CheckboxMatrix';
import GitHubGrid from './components/GitHubGrid';
import LineChart from './components/LineChart';
import Gauge from './components/Gauge';
import HabitForm from './components/HabitForm';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '■' }
];

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [showForm, setShowForm] = useState(false);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  return (
    <div className="min-h-screen bg-gray-200 flex overflow-hidden">
      <aside className="w-56 flex flex-col py-6 pl-6 shrink-0 sticky top-0 h-screen">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 p-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-6 px-2">Habits</h1>
          <nav className="flex flex-col gap-1 flex-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                  activeNav === item.label
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="w-5 text-center text-xs">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setShowForm(true)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 transition-colors text-center mt-4"
          >
            + Habit
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto py-6 pr-14 pl-6">
        <div className="max-w-8xl mx-auto space-y-6">
          <section>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h2 className="text-sm font-medium text-gray-500 mb-4">This Week's Momentum</h2>
                  <CheckboxMatrix />
                </div>
              </div>
              <div className="w-full lg:w-56 shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h2 className="text-sm font-medium text-gray-500 mb-4 text-center">Today's Score</h2>
                  <Gauge />
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <GitHubGrid />
            </div>
          </section>

          <section>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <LineChart />
            </div>
          </section>
        </div>
      </main>

      {showForm && (
        <HabitForm
          categories={categories || []}
          tags={tags || []}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
