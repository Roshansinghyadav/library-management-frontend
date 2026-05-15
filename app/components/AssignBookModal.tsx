"use client";

import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Calendar, Check, Search } from 'lucide-react';
import { apiFetch } from '../../lib/apiFetch';

interface AssignBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: any) => void;
}

export default function AssignBookModal({ isOpen, onClose, onAssign }: AssignBookModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    bookId: '',
    dueDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      apiFetch('/api/users').then(res => res.json()).then(data => setUsers(data.users || []));
      apiFetch('/api/books').then(res => res.json()).then(data => setBooks(data.books || []));
      
      // Set default due date to 14 days from now
      const date = new Date();
      date.setDate(date.getDate() + 14);
      setFormData(prev => ({ ...prev, dueDate: date.toISOString().split('T')[0] }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assign Book</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <User size={14} className="text-slate-400" /> Select User
            </label>
            <select
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            >
              <option value="">Choose a member</option>
              {users.map(u => <option key={u.id || u._id} value={u.id || u._id}>{u.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BookOpen size={14} className="text-slate-400" /> Select Book
            </label>
            <select
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.bookId}
              onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
            >
              <option value="">Choose a book</option>
              {books.filter(b => b.status === 'Available').map(b => <option key={b.id || b._id} value={b.id || b._id}>{b.title}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" /> Due Date
            </label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
