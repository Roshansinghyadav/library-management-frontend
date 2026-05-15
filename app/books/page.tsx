"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import BookTable from "../components/Booktable";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";
import { useSearch } from "../components/SearchProvider";
import { useToast } from "../components/ToastProvider";
import { Plus, BookOpen, Library, CheckCircle, Loader2, RefreshCcw } from "lucide-react";
import { apiFetch } from "../../lib/apiFetch";

export default function BooksPage() {
  const { searchQuery } = useSearch();
  const { showToast } = useToast();
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/books');
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (newBook: any) => {
    try {
      const response = await apiFetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (response.ok) {
        fetchBooks(); // Refresh the list
        showToast("Book added successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleEditBook = async (updatedBook: any) => {
    try {
      const response = await apiFetch(`/api/books/${updatedBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
      });
      if (response.ok) {
        fetchBooks();
        setEditingBook(null);
        showToast("Book updated successfully!", "success");
      }
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      const response = await apiFetch(`/api/books?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBooks(books.filter(book => book.id !== id));
        showToast("Book removed from inventory", "success");
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  // Stats calculation
  const stats = [
    { label: 'Total Books', value: books.length, icon: Library, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Available', value: books.filter(b => b.status === 'Available').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Borrowed', value: books.filter(b => b.status === 'Borrowed').length, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Books Management
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
              Curate, update, and manage your library inventory.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchBooks}
              className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Refresh Inventory"
            >
              <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in" style={{ animationDelay: '0.1s' }}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 transition-all hover:shadow-md">
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

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inventory List</h3>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </div>
            )}
          </div>
          
          <BookTable 
            books={books.filter(book => 
              book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
              book.category.toLowerCase().includes(searchQuery.toLowerCase())
            )} 
            onDelete={handleDeleteBook} 
            onEdit={(book) => setEditingBook(book)}
          />
        </div>
      </div>

      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddBook} 
      />

      <EditBookModal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        onEdit={handleEditBook}
        book={editingBook}
      />
    </DashboardLayout>
  );
}
