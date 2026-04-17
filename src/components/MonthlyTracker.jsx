import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

const MonthlyTracker = ({ habits, currentDate }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get completion for a specific habit and date
  const getStatus = (habit, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completions?.find(c => c.date === dateStr)?.status || false;
  };

  const calculateMonthlySuccess = (habit) => {
    const completedInMonth = days.filter(d => getStatus(habit, d)).length;
    return Math.round((completedInMonth / days.length) * 100);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Monthly Sheet</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your consistency day-by-day</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Done
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-red-500" /> Missed
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest min-w-[150px]">Habit</th>
              {days.map(day => (
                <th key={day.toString()} className={`p-1 text-center min-w-[32px] ${isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20 rounded-t-lg' : ''}`}>
                  <span className={`text-[10px] font-bold ${isToday(day) ? 'text-blue-600' : 'text-gray-400'}`}>
                    {format(day, 'd')}
                  </span>
                </th>
              ))}
              <th className="p-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
            {habits.map(habit => (
              <tr key={habit._id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-4 pr-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 dark:text-gray-200 truncate max-w-[140px]">{habit.name}</span>
                    <span className="text-[10px] text-gray-400">{habit.category}</span>
                  </div>
                </td>
                {days.map(day => {
                  const done = getStatus(habit, day);
                  const isPast = day < new Date() && !isToday(day);
                  
                  return (
                    <td key={day.toString()} className={`p-1 ${isToday(day) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex justify-center">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          done 
                            ? 'bg-green-500 text-white shadow-sm' 
                            : isPast 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-400' 
                              : 'bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800'
                        }`}>
                          {done && <Check size={14} strokeWidth={4} />}
                          {!done && isPast && <X size={14} strokeWidth={4} />}
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="p-2 text-center">
                  <span className={`text-xs font-bold ${calculateMonthlySuccess(habit) > 80 ? 'text-green-500' : 'text-blue-500'}`}>
                    {calculateMonthlySuccess(habit)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyTracker;
