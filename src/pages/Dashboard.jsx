import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CheckCircle, Clock, ListTodo, TrendingUp, Calendar as HabitIcon, Flame } from 'lucide-react';
import API from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [habitStats, setHabitStats] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsRes = await API.get('/tasks/stats');
      const habitsStatsRes = await API.get('/habits/stats');
      const habitsRes = await API.get('/habits');
      setStats(statsRes.data);
      setHabitStats(habitsStatsRes.data);
      setHabits(habitsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center text-gray-500">Loading Dashboard...</div>;

  const chartDataConfig = {
    labels: stats?.chartData?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [
      {
        label: 'Completed Tasks',
        data: stats?.chartData?.map(d => d.completed) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Pending Tasks',
        data: stats?.chartData?.map(d => d.pending) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: 'gray' } },
    },
    scales: {
      y: { ticks: { color: 'gray', stepSize: 1 }, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
      x: { ticks: { color: 'gray' }, grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats?.total || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded-xl text-blue-500"><ListTodo size={24} /></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats?.completed || 0}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-slate-700 rounded-xl text-green-500"><CheckCircle size={24} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats?.pending || 0}</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-slate-700 rounded-xl text-red-500"><Clock size={24} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Habit Completion</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {habitStats.length > 0 
                  ? `${Math.round(habitStats.reduce((acc, h) => acc + h.completionRate, 0) / habitStats.length)}%` 
                  : '0%'}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-slate-700 rounded-xl text-purple-500"><HabitIcon size={24} /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Task Completion</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats?.completionPercentage || 0}%</h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-slate-700 rounded-xl text-indigo-500"><TrendingUp size={24} /></div>
          </div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats?.completionPercentage || 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Summary Section */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Habit Progress</h2>
            <Link to="/habits" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {habitStats.slice(0, 4).map(habit => (
              <div key={habit.id} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate pr-2">{habit.name}</p>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-[10px]">
                      <Flame size={12} fill="currentColor" />
                      {habits.find(h => h._id === habit.id)?.streak?.current || 0}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-500">{habit.completionRate}% Efficiency</span>
                    <span className="text-[10px] font-bold text-blue-600 italic">Level Up!</span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${habit.completionRate}%` }}></div>
                </div>
              </div>
            ))}
            {habitStats.length === 0 && (
              <div className="col-span-full py-4 text-center text-gray-500 italic text-sm">
                No habits tracked yet. Go to Habit Tracker to start!
              </div>
            )}
          </div>
        </div>
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Analytics (Last 7 Days)</h2>
          <div className="h-[300px]">
            <Line data={chartDataConfig} options={chartOptions} />
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
           <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Calendar</h2>
           <div className="calendar-container dark:text-white flex justify-center">
             <Calendar 
               onChange={setDate} 
               value={date} 
               className="border-none bg-transparent w-full font-sans"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
