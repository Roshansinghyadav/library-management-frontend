"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Users, Search, ChevronRight, Loader2 } from "lucide-react";
import { apiFetch } from "../../lib/apiFetch";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<{
    books: any[];
    users: any[];
    loading: boolean;
  }>({
    books: [],
    users: [],
    loading: true
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setResults(prev => ({ ...prev, loading: true }));
      try {
        const [booksRes, usersRes] = await Promise.all([
          apiFetch('/api/books'),
          apiFetch('/api/users')
        ]);
        
        const [booksData, usersData] = await Promise.all([
          booksRes.json(),
          usersRes.json()
        ]);

        const books = booksData.books || [];
        const users = usersData.users || [];

        const filteredBooks = books.filter((b: any) => 
          b.title.toLowerCase().includes(query.toLowerCase()) || 
          b.author.toLowerCase().includes(query.toLowerCase())
        );

        const filteredUsers = users.filter((u: any) => 
          u.name.toLowerCase().includes(query.toLowerCase()) || 
          u.email.toLowerCase().includes(query.toLowerCase())
        );

        setResults({
          books: filteredBooks,
          users: filteredUsers,
          loading: false
        });
      } catch (error) {
        console.error("Search failed:", error);
        setResults(prev => ({ ...prev, loading: false }));
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (results.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-medium text-lg">Searching for &quot;{query}&quot;...</p>
      </div>
    );
  }

  const hasResults = results.books.length > 0 || results.users.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search size={24} className="text-indigo-600" /> Search Results for &quot;{query}&quot;
        </h2>
        <span className="text-sm text-slate-500">
          Found {results.books.length + results.users.length} matches
        </span>
      </div>

      {!hasResults ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Search size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-xl font-bold text-slate-600 dark:text-slate-400">No matches found</p>
          <p className="text-slate-500 mt-1">Try a different keyword or check your spelling.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Books Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-indigo-600" /> Books ({results.books.length})
            </h3>
            <div className="space-y-3">
              {results.books.map((book) => (
                <div key={book.id} className="group p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-sm flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{book.title}</p>
                    <p className="text-xs text-slate-500 truncate">By {book.author}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              ))}
              {results.books.length === 0 && <p className="text-sm text-slate-500 italic">No books match your search.</p>}
            </div>
          </div>

          {/* Members Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-emerald-600" /> Members ({results.users.length})
            </h3>
            <div className="space-y-3">
              {results.users.map((user) => (
                <div key={user.id} className="group p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm flex items-center gap-4 cursor-pointer">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Users size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              ))}
              {results.users.length === 0 && <p className="text-sm text-slate-500 italic">No members match your search.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
