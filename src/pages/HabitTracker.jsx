import React, { useState, useEffect } from 'react';
import API from '../services/api';
import HabitGrid from '../components/HabitGrid';
import HabitStats from '../components/HabitStats';
import DailyTracker from '../components/DailyTracker';
import MonthlyTracker from '../components/MonthlyTracker';
import YearlyTracker from '../components/YearlyTracker';
import HabitAlertSystem from '../components/HabitAlertSystem';
import HabitRewards from '../components/HabitRewards';
import { ChevronLeft, ChevronRight, Calendar, Plus, X, LayoutGrid, CalendarDays, BarChart3, Clock, Award } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, addMonths, subMonths } from 'date-fns';
import { toast } from 'react-toastify';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New habit form state
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'Health',
    color: '#A5B4FC',
    description: '',
    reminderTime: '09:00',
    remindersEnabled: true
  });

  const categories = ['Health', 'Work', 'Personal', 'Social', 'Fitness'];
  const colors = [
    { name: 'Indigo', value: '#A5B4FC' },
    { name: 'Rose', value: '#FCA5A5' },
    { name: 'Amber', value: '#FCD34D' },
    { name: 'Emerald', value: '#34D399' },
    { name: 'Sky', value: '#60A5FA' },
    { name: 'Purple', value: '#C084FC' }
  ];

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await API.get('/habits');
      setHabits(res.data);
    } catch (err) {
      toast.error('Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (habitId, date) => {
    try {
      const res = await API.post(`/habits/${habitId}/toggle`, { date });
      setHabits(habits.map(h => h._id === habitId ? res.data : h));
    } catch (err) {
      toast.error('Failed to update habit');
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/habits', newHabit);
      setHabits([res.data, ...habits]);
      setIsModalOpen(false);
      setNewHabit({ name: '', category: 'Health', color: '#A5B4FC', description: '', reminderTime: '09:00', remindersEnabled: true });
      toast.success('Habit created successfully!');
    } catch (err) {
      toast.error('Failed to create habit');
    }
  };

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 transition-all border-b border-gray-100 dark:border-slate-700 pb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3 tracking-tight italic uppercase">
              {format(currentDate, 'MMMM')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 italic font-medium opacity-80">"Everyone's sleeping, you're building your future"</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Month/Year selectors (Simplified mock) */}
            <div className="flex bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-2 border-r border-gray-100 dark:border-slate-700 flex flex-col items-center">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-tighter">Month</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{format(currentDate, 'MMM')}</span>
              </div>
              <div className="px-4 py-2 flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Year</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{format(currentDate, 'yyyy')}</span>
              </div>
            </div>

            {/* Habit Count */}
            <div className="bg-white dark:bg-slate-800 px-6 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center">
              <span className="text-[10px] font-bold text-green-500 uppercase">Active</span>
              <span className="text-xl font-black text-gray-800 dark:text-gray-100 leading-none mt-1">{habits.length}</span>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 ml-4">
              <button 
                onClick={activeTab === 'monthly' ? prevMonth : prevWeek} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                disabled={activeTab === 'yearly'}
              >
                <ChevronLeft size={20} className={activeTab === 'yearly' ? 'opacity-20' : ''} />
              </button>
              <div className="px-4 text-center min-w-[150px]">
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {activeTab === 'monthly' 
                    ? format(currentDate, 'MMMM yyyy') 
                    : activeTab === 'yearly'
                      ? format(currentDate, 'yyyy')
                      : `${format(startOfWeek(currentDate), 'MMM d')} - ${format(addWeeks(startOfWeek(currentDate), 1), 'MMM d')}`}
                </span>
              </div>
              <button 
                onClick={activeTab === 'monthly' ? nextMonth : nextWeek} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                disabled={activeTab === 'yearly'}
              >
                <ChevronRight size={20} className={activeTab === 'yearly' ? 'opacity-20' : ''} />
              </button>
            </div>
          </div>
        </div>

      {/* Tabs System */}
      <div className="flex bg-gray-100 dark:bg-slate-900/50 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'daily' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md transform scale-[1.02]' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <LayoutGrid size={18} />
          Daily
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'monthly' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md transform scale-[1.02]' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <CalendarDays size={18} />
          Monthly
        </button>
        <button
          onClick={() => setActiveTab('yearly')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'yearly' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md transform scale-[1.02]' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <BarChart3 size={18} />
          Yearly
        </button>
      </div>

      <HabitAlertSystem habits={habits} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'daily' && (
            <div className="space-y-12">
              <HabitStats habits={habits} />
              <HabitRewards habits={habits} />
              <DailyTracker habits={habits} onToggle={handleToggle} />
              <div className="mt-12">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                   <Calendar size={20} className="text-indigo-500" />
                   Weekly Overview
                 </h3>
                 <HabitGrid 
                  habits={habits} 
                  onToggle={handleToggle} 
                  onAdd={() => setIsModalOpen(true)}
                  currentDate={currentDate}
                />
              </div>
            </div>
          )}
          {activeTab === 'monthly' && <MonthlyTracker habits={habits} currentDate={currentDate} />}
          {activeTab === 'yearly' && <YearlyTracker habits={habits} />}
        </div>
      )}

      {/* Add Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 italic">New Daily Habit</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateHabit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Habit Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Drink a glass of water"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Daily Goal</label>
                  <div className="px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-center font-bold text-blue-600">
                    1 Unit
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color Label</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewHabit({...newHabit, color: color.value})}
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center border-2 ${newHabit.color === color.value ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color.value }}
                    >
                      {newHabit.color === color.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Reminder</label>
                   <input 
                    type="time"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newHabit.reminderTime}
                    onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                   <button
                    type="button"
                    onClick={() => setNewHabit({...newHabit, remindersEnabled: !newHabit.remindersEnabled})}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                      newHabit.remindersEnabled 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' 
                        : 'border-gray-200 dark:border-slate-700 text-gray-400'
                    }`}
                   >
                     <Clock size={16} />
                     {newHabit.remindersEnabled ? 'Alert On' : 'Alert Off'}
                   </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none translate-y-1 active:translate-y-2 mt-4"
              >
                Create Habit Strategy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
