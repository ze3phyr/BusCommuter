'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, MapPin, Star, Share2, Navigation, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { mockRoutes, Route as RouteType } from '@/lib/data';
import RouteMap from '@/components/RouteMap';

export default function RoutePage() {
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const routeId = params.id as string;
  const route = mockRoutes.find(r => r.id === routeId);

  // Load theme and favorites from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedFavorites = localStorage.getItem('favorites');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    if (savedFavorites) {
      setIsFavorite(JSON.parse(savedFavorites).includes(routeId));
    }
  }, [routeId]);

  // Toggle theme
  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const newDark = !prev;
      if (newDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newDark;
    });
  };

  // Sync dark mode class with isDark state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Toggle favorite
  const handleToggleFavorite = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = newFavorite
      ? [...savedFavorites, routeId]
      : savedFavorites.filter((id: string) => id !== routeId);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Route not found</p>
          <Link href="/" className="text-green-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ backgroundColor: route.color }}
                >
                  {route.busNumber}
                </div>
                <div className="max-w-[200px] sm:max-w-none">
                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {route.routeName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{route.stops.length} stops</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {isDark ? (
                  <Sun size={18} className="text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon size={18} className="text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Route Summary */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 mb-6 shadow-md border border-gray-100 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">From</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{route.from}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{route.stops[0].arrivalTime}</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-zinc-700" />
            <div className="flex-1 text-center px-4">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Clock className="text-green-500" size={12} />
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Duration</p>
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-lg">
                {((route.stops.length - 1) * 25)} min
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{route.stops.length} stops</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-zinc-700" />
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">To</p>
                <div className="w-2 h-2 rounded-full bg-red-500" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{route.to}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{route.stops[route.stops.length - 1].arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-zinc-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin className="text-green-500" size={16} />
            Route Map
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-zinc-700">
            <RouteMap route={route} />
          </div>
        </div>

        {/* Stops List */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-700 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="text-green-500" size={16} />
              Stops & Timings
            </h2>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-md">{route.stops.length} stops</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-zinc-700">
            {route.stops.map((stop, index) => (
              <div
                key={stop.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                {/* Stop Number */}
                <div className="flex items-center gap-2 w-12 flex-shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                      index === 0
                        ? 'bg-green-500 text-white'
                        : index === route.stops.length - 1
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-zinc-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Stop Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {stop.name}
                  </p>
                  {index === 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Starting Point</p>
                  )}
                  {index === route.stops.length - 1 && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">Final Stop</p>
                  )}
                </div>

                {/* Time */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{stop.arrivalTime}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {index === 0 ? 'Start' : index === route.stops.length - 1 ? 'End' : `${index * 5} min`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
