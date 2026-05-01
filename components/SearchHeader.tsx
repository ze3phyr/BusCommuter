'use client';

import { useState } from 'react';
import { Search, Navigation, User, Menu, Sun, Moon } from 'lucide-react';

interface SearchHeaderProps {
  onSidebarToggle: () => void;
  onThemeToggle: () => void;
  isDark: boolean;
  onSearch: (from: string, to: string) => void;
}

export default function SearchHeader({ onSidebarToggle, onThemeToggle, isDark, onSearch }: SearchHeaderProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from, to);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFrom('Current Location');
        },
        () => {}
      );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Menu size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Search className="text-white" size={16} />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-base">
                Bus Commuter
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? (
                <Sun size={18} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon size={18} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-90 transition-opacity">
              <User size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500" />
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From"
                className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                title="Use current location"
              >
                <Navigation size={14} className="text-gray-400" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md shadow-green-500/20 active:scale-[0.98]"
          >
            Search Routes
          </button>
        </form>
      </div>
    </header>
  );
}
