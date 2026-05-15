"use client";

import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import DashboardLayout from "../components/DashboardLayout";
import ReportModal from "../components/ReportModal";
import SearchResults from "../components/SearchResults";
import { useSearch } from "../components/SearchProvider";
import { 
  BookOpen, 
  Users, 
  BookMarked, 
  ArrowUpRight,
  Library,
  Loader2
} from "lucide-react";
import { apiFetch } from "../../lib/apiFetch";

export default function Dashboard() {
  const { searchQuery } = useSearch();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    assignments: 0,
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, usersRes, assignRes] = await Promise.all([
          apiFetch('/api/books'),
          apiFetch('/api/users'),
          apiFetch('/api/assignments')
        ]);
        
        const [booksData, usersData, assignmentsData] = await Promise.all([
          booksRes.json(),
          usersRes.json(),
          assignRes.json()
        ]);

        const books = booksData.books || [];
        const users = usersData.users || [];
        const assignments = assignmentsData.assignments || [];

        setStats({
          books: books.length,
          users: users.length,
          assignments: assignments.length,
          loading: false
        });

        // Get last 3 books for activity feed
        setRecentBooks(books.slice(-3).reverse());
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {searchQuery ? (
          <SearchResults query={searchQuery} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Dashboard Overview
                </h1>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
                  Welcome back! Here&apos;s a live look at your library.
                </p>
              </div>
              <button 
                onClick={() => setIsReportOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 w-full sm:w-auto shrink-0"
              >
                <Library className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <ReportModal 
              isOpen={isReportOpen} 
              onClose={() => setIsReportOpen(false)} 
              stats={{
                books: stats.books,
                users: stats.users,
                assignments: stats.assignments
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-in" style={{ animationDelay: '0.1s' }}>
              <DashboardCard 
                title="Total Books"
                count={stats.loading ? "..." : stats.books.toString()}
                icon={BookOpen}
                trend="+12%"
                trendType="up"
                color="indigo"
              />
              <DashboardCard
                title="Total Users"
                count={stats.loading ? "..." : stats.users.toString()}
                icon={Users}
                trend="+5%"
                trendType="up"
                color="emerald"
              />
              <DashboardCard
                title="Assigned Books"
                count={stats.loading ? "..." : stats.assignments.toString()}
                icon={BookMarked}
                trend="-2%"
                trendType="down"
                color="amber"
              />
              <DashboardCard
                title="New Requests"
                count="24"
                icon={ArrowUpRight}
                trend="+18%"
                trendType="up"
                color="rose"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-in" style={{ animationDelay: '0.2s' }}>
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                  {stats.loading && <Loader2 size={18} className="animate-spin text-slate-400" />}
                </div>
                <div className="space-y-4 md:space-y-6">
                  {recentBooks.length > 0 ? recentBooks.map((book, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0 shadow-sm text-indigo-600">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">New Book Added: {book.title}</p>
                        <p className="text-xs text-slate-500 mt-1">Recently curated • by {book.author}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded-full uppercase">New</span>
                    </div>
                  )) : (
                    <div className="text-center py-10 text-slate-400">
                      <p>No recent activity found.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Stats</h3>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Completion Rate</p>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">84%</span>
                      <span className="text-xs text-emerald-500 font-medium">+2.5%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full w-[84%]"></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Inventory Health</p>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">92%</span>
                      <span className="text-xs text-emerald-500 font-medium">Optimal</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}