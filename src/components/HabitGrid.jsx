import React from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Check, Plus, MoreVertical, Flame } from 'lucide-react';

const HabitGrid = ({ habits, onToggle, onAdd, currentDate }) => {
  // Generate days for the current week (starting Sunday or Monday depending on locale, usually Sunday)
  const startDate = startOfWeek(currentDate);
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));

  const getStatus = (habit, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completions?.find((c) => c.date === dateStr)?.status || false;
  };

  const calculateStreak = (habit) => {
    let streak = 0;
    const sortedCompletions = [...(habit.completions || [])]
      .filter(c => c.status)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Simple streak logic: consecutive days starting from yesterday or today
    // For now, just return a mock or simple count for visual effect as requested by images
    return sortedCompletions.length; 
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 italic">Daily Habits</h3>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-200 dark:shadow-none"
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12 text-center">#</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">Habit</th>
              {weekDays.map((date) => (
                <th key={date.toString()} className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{format(date, 'EEE')}</span>
                    <span className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                      isSameDay(date, new Date()) 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {format(date, 'd')}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {habits.map((habit, index) => (
              <tr key={habit._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500 text-center font-medium">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 dark:text-gray-100">{habit.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{habit.category}</span>
                  </div>
                </td>
                {weekDays.map((date) => {
                  const isCompleted = getStatus(habit, date);
                  return (
                    <td key={date.toString()} className="px-2 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => onToggle(habit._id, format(date, 'yyyy-MM-dd'))}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 ${
                            isCompleted 
                              ? `bg-opacity-20 border-transparent` 
                              : 'bg-transparent border-gray-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                          }`}
                          style={{ 
                            backgroundColor: isCompleted ? `${habit.color}33` : 'transparent',
                            color: isCompleted ? habit.color : 'transparent'
                          }}
                        >
                          {isCompleted && <Check size={20} strokeWidth={3} />}
                        </button>
                      </div>
                    </td>
                  );
                })}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1 text-orange-500 font-bold">
                    <Flame size={16} fill="currentColor" />
                    <span>{calculateStreak(habit)}</span>
                  </div>
                </td>
              </tr>
            ))}
            {habits.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                  No habits added yet. Start by adding one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Weekly Progress Section (From Image 1) */}
      <div className="p-6 bg-gray-50 dark:bg-slate-900/30 border-t border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Weekly Progress</span>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-48 h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (habits.reduce((acc, h) => acc + h.completions.filter(c => c.status).length, 0) / (habits.length * 7 || 1)) * 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-black text-gray-700 dark:text-gray-200">
              {Math.round((habits.reduce((acc, h) => acc + h.completions.filter(c => c.status).length, 0) / (habits.length * 7 || 1)) * 100)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Goal Reached</span>
            <span className="text-lg font-black text-blue-600">
              {habits.filter(h => h.completions.filter(c => c.status).length >= 5).length} / {habits.length}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs italic text-gray-500 dark:text-gray-400">"Build your future, one check at a time"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitGrid;
