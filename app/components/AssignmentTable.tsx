"use client";

import React from 'react';
import { User, Book, Calendar, CheckCircle, Clock, AlertTriangle, Trash2 } from 'lucide-react';

interface Assignment {
  id: string;
  userName: string;
  bookTitle: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

interface AssignmentTableProps {
  assignments: Assignment[];
  onReturn?: (id: string) => void;
}

export default function AssignmentTable({ assignments, onReturn }: AssignmentTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member & Book</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Issue Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {assignments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                <p className="font-medium">No active assignments</p>
              </td>
            </tr>
          ) : (
            assignments.map((a: any, index: number) => (
              <tr key={a.id || a._id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors whitespace-nowrap">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <User size={14} className="text-slate-400" /> {a.userName}
                    </span>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-medium">
                      <Book size={14} /> {a.bookTitle}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(a.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {new Date(a.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    a.status === 'Issued' 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {a.status === 'Issued' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onReturn && onReturn(a.id || a._id)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    Return Book
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
