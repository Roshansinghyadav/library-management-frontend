"use client";

import { useState } from "react";

import { Bell, Search, UserCircle, Menu, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useSearch } from "./SearchProvider";

interface NavBarProps {
  onMenuClick?: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps) {
  const { user, logout, updateUser } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: "Book Overdue", message: "'The Great Gatsby' is 2 days overdue.", time: "10m ago", color: "rose" },
    { id: 2, title: "New Member", message: "Sarah Jenkins joined the library.", time: "1h ago", color: "emerald" },
    { id: 3, title: "Book Returned", message: "'Atomic Habits' has been returned.", time: "3h ago", color: "indigo" },
  ];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const avatarBase64 = reader.result as string;
        // Update local state immediately for snappy UI
        updateUser({ avatar: avatarBase64 });
        // Persist to backend so it survives logout/login
        try {
          await fetch('/api/auth/me', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ avatar: avatarBase64 }),
          });
        } catch {
          // Avatar still visible locally even if backend save fails
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        
        <div className="relative hidden sm:block w-72 lg:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Find books, members, or records..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:border-indigo-500/50 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        <button className="sm:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white">Notifications</h4>
                <button className="text-xs text-indigo-600 font-bold hover:underline">Mark all as read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 cursor-pointer">
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        n.color === 'rose' ? 'bg-rose-500' : 
                        n.color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full p-3 text-center text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800">
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        
        {/* Profile */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {user?.email || "admin@gmail.com"}
              </span>
            </div>
            <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all active:scale-95 overflow-hidden"
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-indigo-500/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
            </button>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <div className="relative group mb-3">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-indigo-50 dark:border-indigo-900/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-bold border-4 border-indigo-50 dark:border-indigo-900/30 shadow-lg">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                    </div>
                  )}
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-center px-2">
                    <UserCircle className="text-white w-6 h-6 mb-1" />
                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Update Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-500 mt-1">{user?.email || "admin@gmail.com"}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}