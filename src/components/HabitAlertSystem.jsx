import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Bell, Clock, Award, AlertCircle } from 'lucide-react';

const HabitAlertSystem = ({ habits }) => {
  const [lastNotified, setLastNotified] = useState({});

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];

      habits.forEach(habit => {
        if (!habit.remindersEnabled || !habit.reminderTime) return;

        // Check completion status for today
        const isCompleted = habit.completions?.find(c => c.date === today)?.status;

        // Trigger notification if:
        // 1. Current time matches habit reminder time
        // 2. Not completed yet
        // 3. Haven't notified in the last hour
        const lastNotifiedTime = lastNotified[habit._id];
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        if (habit.reminderTime === currentTime && !isCompleted && (!lastNotifiedTime || new Date(lastNotifiedTime) < oneHourAgo)) {
          triggerAlert(habit);
        }
      });
    };

    const triggerAlert = (habit) => {
      // Browser Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Habit Reminder!", {
          body: `⏰ It's time for: ${habit.name}. Please complete it now!`,
          icon: "/favicon.ico"
        });
      }

      // UI Toast with custom design
      toast.info(
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-bold">
            <Bell size={16} className="text-indigo-500 animate-bounce" />
            <span>Habit Time!</span>
          </div>
          <p className="text-xs opacity-90">🚨 Your scheduled habit "{habit.name}" is running!</p>
          <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            Current Streak: {habit.streak?.current || 0} Days 🔥
          </div>
        </div>,
        {
          autoClose: 10000,
          icon: false
        }
      );

      setLastNotified(prev => ({ ...prev, [habit._id]: new Date().toISOString() }));
    };

    // Run check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [habits, lastNotified]);

  // Motivational Popups (Random every few hours or on significant events)
  useEffect(() => {
    const quotes = [
      "Consistency is what transforms average into excellence. Keep going!",
      "Don't stop when you're tired. Stop when you're done. 🔥",
      "Winning is a habit. Unfortunately, so is losing. Choose wisely.",
      "Small daily improvements over time lead to stunning results.",
      "Your future self will thank you for the habits you build today."
    ];

    const showMotivational = () => {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      toast(
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs font-medium italic">"{quote}"</p>
          </div>
        </div>,
        { position: "bottom-right", autoClose: 5000 }
      );
    };

    // Show a motivation every 30 minutes
    const interval = setInterval(showMotivational, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return null; // Logic-only component
};

export default HabitAlertSystem;
