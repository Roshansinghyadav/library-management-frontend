"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AssignmentTable from "../components/AssignmentTable";
import AssignBookModal from "../components/AssignBookModal";
import { BookOpen, Plus, Loader2, AlertCircle, CheckCircle2, History } from "lucide-react";
import { apiFetch } from "../../lib/apiFetch";

export default function AssignBooksPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/assignments');
      const data = await response.json();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAssign = async (newAssignment: any) => {
    try {
      const response = await apiFetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
      });
      if (response.ok) {
        fetchAssignments();
      }
    } catch (error) {
      console.error("Failed to assign book:", error);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      const response = await apiFetch(`/api/assignments/${id}/return`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchAssignments();
      }
    } catch (error) {
      console.error("Failed to return book:", error);
    }
  };

  const stats = [
    { label: 'Total Issued', value: assignments.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Overdue', value: assignments.filter(a => a.status === 'Overdue').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Due Today', value: 0, icon: History, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Book Assignments
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
              Track circulation and manage library loans.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
          >
            <Plus size={20} />
            Assign New Book
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in" style={{ animationDelay: '0.1s' }}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Circulation Records</h3>
            {isLoading && <Loader2 size={20} className="animate-spin text-slate-400" />}
          </div>
          <AssignmentTable 
            assignments={assignments.filter(a => a.status !== 'Returned')} 
            onReturn={handleReturn} 
          />
        </div>
      </div>

      <AssignBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAssign={handleAssign} 
      />
    </DashboardLayout>
  );
}
