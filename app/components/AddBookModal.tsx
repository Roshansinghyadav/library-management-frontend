"use client";

import React, { useState, useEffect } from 'react';
import { X, BookPlus, User, Hash, Tag, Layers, Search, Loader2, Check } from 'lucide-react';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: any) => void;
}

export default function AddBookModal({ isOpen, onClose, onAdd }: AddBookModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Other',
    quantity: '1',
    status: 'Available'
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      // Try Google Books API first
      let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=10`);
      
      if (response.status === 429 || !response.ok) {
        console.warn("Google Books API rate limited or error, trying Open Library...");
        // Fallback to Open Library Search API
        const olResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`);
        const olData = await olResponse.json();
        
        const mappedResults = olData.docs.map((doc: any) => ({
          id: doc.key,
          volumeInfo: {
            title: doc.title,
            authors: doc.author_name || ['Unknown'],
            industryIdentifiers: doc.isbn ? [{ identifier: doc.isbn[0] }] : [],
            categories: doc.subject ? [doc.subject[0]] : ['Other'],
            imageLinks: doc.cover_i ? { thumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` } : null
          }
        }));
        setSearchResults(mappedResults);
      } else {
        const data = await response.json();
        setSearchResults(data.items || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectBook = (book: any) => {
    const info = book.volumeInfo;
    setFormData({
      ...formData,
      title: info.title || '',
      author: info.authors?.[0] || 'Unknown Author',
      isbn: info.industryIdentifiers?.[0]?.identifier || '',
      category: info.categories?.[0] || 'Other'
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      totalCopies: Number(formData.quantity)
    };
    onAdd(payload);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: 'Other',
      quantity: '1',
      status: 'Available'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        <div className="px-6 md:px-8 py-5 md:py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <BookPlus size={22} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Expand Collection</h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Discover new titles or add manually</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all text-slate-500 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* Left Side: Search */}
          <div className="w-full md:w-5/12 border-r border-slate-100 dark:border-slate-800 p-6 bg-slate-50/30 dark:bg-slate-900/30 flex flex-col">
            <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Search Book</label>
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Title, author, or ISBN..."
                className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              {searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div 
                    key={book.id} 
                    onClick={() => selectBook(book)}
                    onDoubleClick={() => {
                      const info = book.volumeInfo;
                      const newBook = {
                        title: info.title || '',
                        author: info.authors?.[0] || 'Unknown Author',
                        isbn: info.industryIdentifiers?.[0]?.identifier || '',
                        category: info.categories?.[0] || 'Other',
                        totalCopies: 1,
                        status: 'Available'
                      };
                      onAdd(newBook);
                      onClose();
                    }}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all group hover:shadow-md select-none"
                    title="Click to select, Double-click to add immediately"
                  >
                    <div className="flex gap-3">
                      {book.volumeInfo.imageLinks?.thumbnail ? (
                        <img src={book.volumeInfo.imageLinks.thumbnail} alt="" className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                      ) : (
                        <div className="w-12 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                          <BookPlus size={20} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                          {book.volumeInfo.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {book.volumeInfo.authors?.join(', ') || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchQuery && !isSearching ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">No results found.</p>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2">
                  <Library className="mx-auto text-slate-200 dark:text-slate-800" size={48} />
                  <p className="text-xs text-slate-400 font-medium px-4">Type a title or author to search millions of books instantly.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-7/12 p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Book Title</label>
                <input
                  required
                  type="text"
                  placeholder="Manual entry or from search"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Author</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ISBN</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Children">Children</option>
                    <option value="Art & Design">Art & Design</option>
                    <option value="Philosophy">Philosophy</option>
                    <option value="Religion">Religion</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing import fix
import { Library } from 'lucide-react';
