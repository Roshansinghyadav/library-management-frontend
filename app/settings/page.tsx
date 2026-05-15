"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Globe, 
  Shield, 
  Palette, 
  Bell, 
  Save, 
  Library, 
  Clock, 
  DollarSign,
  Moon,
  Sun,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { useTheme } from "../components/ThemeProvider";
import { apiFetch } from "../../lib/apiFetch";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    libraryName: 'LibPro Management System',
    email: 'admin@libpro.com',
    address: '123 Library Lane, Booktown',
    loanPeriod: '14',
    maxBooks: '5',
    fineRate: '0.50',
    notifications: false
  });

  // Security: Change Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPwd: false,
    confirm: false
  });
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await apiFetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordStatus({ type: 'error', message: data.error || 'Failed to change password. Check your current password.' });
      }
    } catch {
      setPasswordStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationsToggle = async () => {
    if (settings.notifications) {
      setSettings({ ...settings, notifications: false });
      return;
    }
    if (!('Notification' in window)) {
      alert('Your browser does not support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setSettings({ ...settings, notifications: true });
      new Notification('LibPro Notifications Enabled', {
        body: 'You will now receive alerts for overdue books and returns.',
        icon: '/favicon.ico',
      });
    } else {
      setSettings({ ...settings, notifications: false });
      alert('Notification permission was denied. Please allow it in your browser settings.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'circulation', label: 'Circulation', icon: Clock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
              Configure your library rules and application preferences.
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : (<><Save size={20} />Save Changes</>)}
          </button>
        </div>

        {/* Settings Container */}
        <div className="flex flex-col lg:flex-row gap-8 animate-in" style={{ animationDelay: '0.1s' }}>
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">

            {/* ── General ───────────────────────────────── */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Library className="text-indigo-600" size={24} /> General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Library Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={settings.libraryName} onChange={(e) => setSettings({...settings, libraryName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Library Address</label>
                    <textarea rows={3} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Circulation ───────────────────────────── */}
            {activeTab === 'circulation' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="text-indigo-600" size={24} /> Loan &amp; Circulation Rules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Default Loan Period (Days)</label>
                    <input type="number" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={settings.loanPeriod} onChange={(e) => setSettings({...settings, loanPeriod: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Max Books per Member</label>
                    <input type="number" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={settings.maxBooks} onChange={(e) => setSettings({...settings, maxBooks: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"><DollarSign size={14} /> Overdue Fine Rate (per day)</label>
                    <input type="number" step="0.01" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" value={settings.fineRate} onChange={(e) => setSettings({...settings, fineRate: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Appearance ────────────────────────────── */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="text-indigo-600" size={24} /> Application Style
                </h3>
                <div className="space-y-4">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                        <p className="text-xs text-slate-500">Enable dark theme for better eye comfort</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className={`w-12 h-6 rounded-full transition-all relative ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {/* Desktop Notifications Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${settings.notifications ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                        <Bell size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Desktop Notifications</p>
                        <p className="text-xs text-slate-500">
                          {settings.notifications
                            ? 'Active — you will receive alerts for overdue books.'
                            : 'Click to enable alerts for overdue books and returns.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleNotificationsToggle}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.notifications ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {settings.notifications && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm animate-in fade-in">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Desktop notifications are enabled. You will be alerted when books are overdue or returned.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Security ──────────────────────────────── */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="text-indigo-600" size={24} /> Security Settings
                </h3>

                {/* Change Password Card */}
                <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Change Password</p>
                      <p className="text-xs text-slate-500">Update your admin account password securely</p>
                    </div>
                  </div>

                  {/* Status Banner */}
                  {passwordStatus && (
                    <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
                      passwordStatus.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400'
                    }`}>
                      {passwordStatus.type === 'success'
                        ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                        : <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
                      <span>{passwordStatus.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                      <div className="relative">
                        <input
                          required
                          type={showPasswords.current ? 'text' : 'password'}
                          className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="Enter your current password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}>
                          {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                      <div className="relative">
                        <input
                          required
                          type={showPasswords.newPwd ? 'text' : 'password'}
                          className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="Enter new password (min 6 characters)"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPasswords({ ...showPasswords, newPwd: !showPasswords.newPwd })}>
                          {showPasswords.newPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                      <div className="relative">
                        <input
                          required
                          type={showPasswords.confirm ? 'text' : 'password'}
                          className="w-full px-4 py-3 pr-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="Re-enter your new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}>
                          {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock size={16} />
                        {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Security Tip */}
                <div className="p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-amber-800 dark:text-amber-400 text-sm">Security Tip</p>
                      <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">Use a strong password with at least 8 characters, including numbers and special characters. Never share your admin credentials.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
