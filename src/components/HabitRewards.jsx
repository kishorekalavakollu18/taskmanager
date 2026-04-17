import React from 'react';
import { Award, Star, Zap, Shield, Crown } from 'lucide-react';

const HabitRewards = ({ habits }) => {
  const getRewards = () => {
    const rewards = [];
    const maxStreak = Math.max(...habits.map(h => h.streak?.longest || 0), 0);
    const totalCompletions = habits.reduce((acc, h) => acc + (h.completions?.filter(c => c.status).length || 0), 0);
    const perfectDays = 0; // Mocked for now, would need backend agg

    if (maxStreak >= 3) rewards.push({ id: '3day', name: 'Starter Streak', desc: '3 Day Streak reached!', icon: <Star className="text-yellow-400" />, color: 'bg-yellow-500/10' });
    if (maxStreak >= 7) rewards.push({ id: '7day', name: 'Week Warrior', desc: '7 Day Streak reached!', icon: <Zap className="text-orange-400" />, color: 'bg-orange-500/10' });
    if (maxStreak >= 30) rewards.push({ id: '30day', name: 'Consistency King', desc: '30 Day Streak reached!', icon: <Crown className="text-purple-400" />, color: 'bg-purple-500/10' });
    if (totalCompletions >= 50) rewards.push({ id: '50total', name: 'Habit Master', desc: '50 Total completions!', icon: <Shield className="text-blue-400" />, color: 'bg-blue-500/10' });
    if (habits.length >= 5) rewards.push({ id: '5habits', name: 'Multi-Tasker', desc: 'Tracking 5+ habits', icon: <Award className="text-emerald-400" />, color: 'bg-emerald-500/10' });

    return rewards;
  };

  const rewards = getRewards();

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Award className="text-indigo-500" />
          Achievement Rewards
        </h3>
        <span className="text-xs font-bold text-gray-400 uppercase">{rewards.length} Unlocked</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {rewards.map(reward => (
          <div key={reward.id} className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 transition-all hover:scale-105 hover:shadow-md">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${reward.color}`}>
              {reward.icon}
            </div>
            <span className="text-xs font-black text-gray-800 dark:text-gray-200">{reward.name}</span>
            <span className="text-[10px] text-gray-500 mt-1">{reward.desc}</span>
          </div>
        ))}
        {rewards.length === 0 && (
          <div className="col-span-full py-4 text-center text-gray-500 italic text-sm">
            Keep tracking to unlock rewards!
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitRewards;
