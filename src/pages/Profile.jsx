import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Profile</h1>
      
      <div className="bg-white dark:bg-slate-800 shadow rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-6 sm:px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {user.role === 'admin' && (
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-purple-200 dark:border-purple-800">
                Admin
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-slate-800 rounded-lg text-red-600 dark:text-red-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-slate-800 rounded-lg text-green-600 dark:text-green-400">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Role</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-slate-800 rounded-lg text-orange-600 dark:text-orange-400">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined Date</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
