import React from 'react';
import { Check, Flame, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const DailyTracker = ({ habits, onToggle }) => {
  const today = format(new Date(), 'yyyy-MM-dd');

  const isCompletedToday = (habit) => {
    return habit.completions?.find(c => c.date === today)?.status || false;
  };

  const calculateProgress = () => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => isCompletedToday(h)).length;
    return Math.round((completed / habits.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Today's Focus</h2>
            <p className="opacity-90">{habits.filter(h => isCompletedToday(h)).length} of {habits.length} habits completed</p>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48" cy="48" r="40"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                className="opacity-20"
              />
              <circle
                cx="48" cy="48" r="40"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * calculateProgress()) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-xl font-bold">{calculateProgress()}%</span>
          </div>
        </div>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const completed = isCompletedToday(habit);
          return (
            <div 
              key={habit._id} 
              className={`group p-5 rounded-2xl border-2 transition-all duration-300 ${
                completed 
                  ? 'bg-white dark:bg-slate-800 border-transparent shadow-md' 
                  : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggle(habit._id, today)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      completed 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {completed ? <Check size={24} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-slate-600" />}
                  </button>
                  <div>
                    <h3 className={`font-bold text-lg transition-all ${completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
                        {habit.category}
                      </span>
                      {habit.reminderTime && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                          <Clock size={12} />
                          {habit.reminderTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-orange-500 font-black italic">
                    <Flame size={18} fill="currentColor" />
                    <span>{habit.streak?.current || 0}</span>
                  </div>
                  {!completed && habit.reminderTime && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase animate-pulse">
                      <AlertTriangle size={10} />
                      Missed?
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
            <p className="text-gray-500 dark:text-gray-400 italic">No habits for today. Start small, win big!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTracker;
