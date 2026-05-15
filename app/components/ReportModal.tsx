"use client";

import React from "react";
import { X, Printer, Download, Library, BookOpen, Users, BookMarked, Calendar } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    books: number;
    users: number;
    assignments: number;
  };
}

export default function ReportModal({ isOpen, onClose, stats }: ReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Library className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Library System Report</h2>
              <p className="text-sm text-slate-500">Generated on {currentDate}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content for Report */}
        <div id="printable-report" className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-indigo-600" size={20} />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Inventory</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.books}</p>
              <p className="text-xs text-slate-500 mt-1">Total Books Available</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-emerald-600" size={20} />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Members</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.users}</p>
              <p className="text-xs text-slate-500 mt-1">Active Library Members</p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-center gap-3 mb-4">
                <BookMarked className="text-amber-600" size={20} />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Loans</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.assignments}</p>
              <p className="text-xs text-slate-500 mt-1">Currently Borrowed</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" /> System Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Library Health Status</span>
                <span className="font-bold text-emerald-500">Excellent</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Resource Utilization</span>
                <span className="font-bold text-indigo-600">84%</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-600 dark:text-slate-400">Next Scheduled Maintenance</span>
                <span className="font-bold text-slate-900 dark:text-white">June 15, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handlePrint}
            className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-all active:scale-95"
          >
            <Printer size={18} />
            Print Report
          </button>
          <button 
            onClick={onClose}
            className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
