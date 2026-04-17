import React from 'react';
import { format, parseISO } from 'date-fns';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HabitStats = ({ habits }) => {
  // Aggregate stats
  const totalCompleted = habits.reduce((acc, h) => acc + (h.completions?.filter(c => c.status).length || 0), 0);
  const totalHabits = habits.length;

  const calculateTotalSuccessRate = () => {
    if (habits.length === 0) return 0;
    const totalPossible = totalHabits * 30; // 30 day window
    const successRate = Math.round((totalCompleted / (totalPossible || 1)) * 100);
    return successRate;
  };

  // Category completion data
  const categoryData = {
    labels: [...new Set(habits.map(h => h.category))],
    datasets: [{
      label: 'Completions',
      data: [...new Set(habits.map(h => h.category))].map(cat => 
        habits.filter(h => h.category === cat).reduce((acc, h) => acc + (h.completions?.filter(c => c.status).length || 0), 0)
      ),
      backgroundColor: ['#A5B4FC', '#FCA5A5', '#FCD34D', '#34D399', '#60A5FA'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  // Monthly progress line data (Dynamic based on last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, 'yyyy-MM-dd');
  }).reverse();

  const lineData = {
    labels: last7Days.map(d => format(parseISO(d), 'EEE')),
    datasets: [{
      label: 'Total Habits Done',
      data: last7Days.map(date => 
        habits.reduce((acc, h) => acc + (h.completions?.find(c => c.date === date)?.status ? 1 : 0), 0)
      ),
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderColor: '#4F46E5',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#4F46E5'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Completions: ${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div className="space-y-8 mb-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Success Rate</h4>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{calculateTotalSuccessRate()}%</span>
            <span className="text-gray-400 dark:text-gray-500 mb-1 text-sm font-medium">completion score</span>
          </div>
          <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" 
              style={{ width: `${calculateTotalSuccessRate()}%` }}
            ></div>
          </div>
        </div>

        {/* Categories Doughnut */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Focus Areas</h4>
          <div className="h-40 relative flex items-center justify-center">
            <Doughnut data={categoryData} options={chartOptions} />
          </div>
        </div>

        {/* Progress Trend Line */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
          <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Last 7 Days</h4>
          <div className="h-40">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Weekly Analytics Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
         <h4 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Weekly Performance Breakdown</h4>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {last7Days.map(date => {
              const dayCompletions = habits.reduce((acc, h) => acc + (h.completions?.find(c => c.date === date)?.status ? 1 : 0), 0);
              const rate = habits.length === 0 ? 0 : Math.round((dayCompletions / habits.length) * 100);
              return (
                <div key={date} className="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900/50 flex flex-col items-center border border-gray-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{format(parseISO(date), 'EEE')}</span>
                  <span className="text-lg font-black text-gray-800 dark:text-gray-100 mt-1">{dayCompletions}</span>
                  <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${rate >= 80 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {rate}%
                  </div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default HabitStats;
