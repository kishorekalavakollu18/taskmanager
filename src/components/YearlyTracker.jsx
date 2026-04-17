import React from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, subYears, isSameDay } from 'date-fns';

const YearlyTracker = ({ habits }) => {
  const currentYear = new Date().getFullYear();
  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Calculate total completions across all habits for each day
  const getDailyCompletions = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habits.reduce((acc, habit) => {
      const comp = habit.completions?.find(c => c.date === dateStr);
      return acc + (comp?.status ? 1 : 0);
    }, 0);
  };

  const maxCompletions = habits.length;

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-slate-800';
    const intensity = count / maxCompletions;
    if (intensity <= 0.25) return 'bg-emerald-200 dark:bg-emerald-900/40';
    if (intensity <= 0.5) return 'bg-emerald-400 dark:bg-emerald-800/60';
    if (intensity <= 0.75) return 'bg-emerald-600 dark:bg-emerald-700/80';
    return 'bg-emerald-800 dark:bg-emerald-600';
  };

  // Group days into weeks for the grid
  const weeks = [];
  let currentWeek = [];
  
  allDays.forEach((day, i) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || i === allDays.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-6">
      {/* Yearly Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Completions</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {habits.reduce((acc, h) => acc + (h.completions?.filter(c => c.status).length || 0), 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Across all habits this year</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Longest Streak</span>
          <div className="text-3xl font-black text-orange-500 mt-1">
            {Math.max(...habits.map(h => h.streak?.longest || 0), 0)} Days
          </div>
          <p className="text-xs text-gray-500 mt-1">Consistency is king!</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Consistency Score</span>
          <div className="text-3xl font-black text-blue-600 mt-1">
            {Math.round((habits.reduce((acc, h) => acc + (h.streak?.current || 0), 0) / (habits.length || 1)) * 10) / 10}
          </div>
          <p className="text-xs text-gray-500 mt-1">Average current streak</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Activity Heatmap {currentYear}</h3>
        
        <div className="flex gap-2">
          {/* Day Labels */}
          <div className="flex flex-col gap-[7px] pt-7 text-[10px] font-bold text-gray-400 uppercase">
             <span>Mon</span>
             <span>Wed</span>
             <span>Fri</span>
          </div>

          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-1.5 min-w-max">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1.5">
                  {/* Month headers (Simplified) */}
                  <div className="h-4 text-[10px] font-bold text-gray-400">
                    {week[0].getDate() <= 7 && format(week[0], 'MMM')}
                  </div>
                  
                  {/* Empty spacers for first week */}
                  {weekIdx === 0 && Array.from({ length: week[0].getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-4 h-4" />
                  ))}

                  {week.map(day => {
                    const count = getDailyCompletions(day);
                    return (
                      <div 
                        key={day.toString()}
                        title={`${format(day, 'MMM d, yyyy')}: ${count} habits completed`}
                        className={`w-4 h-4 rounded-sm transition-colors ${getHeatmapColor(count)} hover:ring-2 hover:ring-indigo-400 cursor-pointer`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-2 text-[10px] font-bold text-gray-400 uppercase">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-slate-800" />
              <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-800/60" />
              <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-700/80" />
              <div className="w-3 h-3 rounded-sm bg-emerald-800 dark:bg-emerald-600" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyTracker;
