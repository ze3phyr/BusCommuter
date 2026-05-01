'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import SearchHeader from '@/components/SearchHeader';
import RouteCard from '@/components/RouteCard';
import { mockRoutes, findRoutes, findNearestStops, Route } from '@/lib/data';
import { MapPin, Navigation, Clock, Heart, Bus } from 'lucide-react';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [favoriteRoutes, setFavoriteRoutes] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [nearestStops, setNearestStops] = useState<Array<{ stop: typeof mockRoutes[0]['stops'][0]; route: Route; distance: number }>>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Load theme and favorites from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedFavorites = localStorage.getItem('favorites');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    if (savedFavorites) {
      setFavoriteRoutes(JSON.parse(savedFavorites));
    }
  }, []);

  // Toggle theme
  const handleThemeToggle = useCallback(() => {
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
  }, []);

  // Sync dark mode class with isDark state on mount and changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((routeId: string) => {
    setFavoriteRoutes((prev) => {
      const newFavorites = prev.includes(routeId)
        ? prev.filter((id) => id !== routeId)
        : [...prev, routeId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Handle search
  const handleSearch = useCallback((from: string, to: string) => {
    setHasSearched(true);
    setActiveSection('');
    const results = findRoutes(from, to);
    setSearchResults(results);
  }, []);

  // Get nearest stops based on geolocation
  const handleGetNearestStops = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestStops(latitude, longitude, 10);
        setNearestStops(nearest);
        setLoadingLocation(false);
        setActiveSection('nearby');
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoadingLocation(false);
      }
    );
  }, []);

  // Handle section changes from sidebar
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    setHasSearched(false);

    if (section === 'nearby') {
      handleGetNearestStops();
    } else if (section === 'favorites') {
      // Show all routes filtered by favorites
      setSearchResults(mockRoutes.filter(r => favoriteRoutes.includes(r.id)));
    } else if (section === 'recent') {
      // For now, show all routes (in a real app, track recent)
      setSearchResults(mockRoutes);
    } else if (section === 'saved') {
      // Same as favorites for now
      setSearchResults(mockRoutes.filter(r => favoriteRoutes.includes(r.id)));
    } else if (section === '' || section === 'home') {
      setHasSearched(false);
      setSearchResults([]);
    }
  }, [favoriteRoutes, handleGetNearestStops]);

  // Auto-load nearest stops on mount
  useEffect(() => {
    if (navigator.geolocation && !hasSearched && activeSection === '') {
      handleGetNearestStops();
    }
  }, []);

  // Determine what to display
  const displayRoutes = hasSearched || activeSection !== '' ? searchResults : mockRoutes;
  const showNearest = !hasSearched && activeSection === '' && nearestStops.length > 0;
  const showFavorites = activeSection === 'favorites';

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-zinc-950 ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        favoriteRoutes={favoriteRoutes}
        onToggleFavorite={handleToggleFavorite}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Search Header */}
        <SearchHeader
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onThemeToggle={handleThemeToggle}
          isDark={isDark}
          onSearch={handleSearch}
        />

        {/* Page Content */}
        <main className="max-w-5xl mx-auto px-4 py-6 flex-1">
          {/* Section Title */}
          {hasSearched && (
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {searchResults.length} Route{searchResults.length !== 1 ? 's' : ''} Found
              </h2>
              <button
                onClick={() => {
                  setHasSearched(false);
                  setActiveSection('');
                }}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

          {activeSection === 'favorites' && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="text-green-500" size={18} />
                Favorite Routes
              </h2>
              {favoriteRoutes.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  No favorites yet. Click the heart icon on any route to add it here.
                </p>
              )}
            </div>
          )}

          {/* Nearest Stops Section */}
          {showNearest && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="text-green-500" size={18} />
                  Nearby Stops
                </h2>
                <button
                  onClick={handleGetNearestStops}
                  disabled={loadingLocation}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors disabled:opacity-50"
                >
                  {loadingLocation ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nearestStops.slice(0, 6).map(({ stop, route, distance }) => (
                  <div
                    key={`${route.id}-${stop.id}`}
                    className="bg-white dark:bg-zinc-800 rounded-xl p-3 border border-gray-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: route.color }}
                      >
                        {route.busNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                          {stop.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {route.routeName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Navigation size={10} />
                        {distance.toFixed(1)} km
                      </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{stop.arrivalTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Routes Grid */}
          {(displayRoutes.length > 0 || (showNearest && nearestStops.length > 0)) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {displayRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isFavorite={favoriteRoutes.includes(route.id)}
                  onToggleFavorite={() => handleToggleFavorite(route.id)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {displayRoutes.length === 0 && !showNearest && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-zinc-800 dark:to-zinc-800 flex items-center justify-center">
                <MapPin className="text-green-500" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No routes found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Try adjusting your search terms or browse all available routes below
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-zinc-800 mt-12 py-8 bg-white dark:bg-zinc-900">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Bus className="text-white" size={16} />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Bus Commuter</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2026 Bus Commuter. Built with Next.js.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
