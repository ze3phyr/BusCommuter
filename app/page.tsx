'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight, LocateFixed, MapPin, Navigation2, X } from 'lucide-react';
import RouteCard from '@/components/RouteCard';
import SearchHeader from '@/components/SearchHeader';
import Sidebar from '@/components/Sidebar';
import { useToast } from '@/components/ToastProvider';
import { calculateDistance, findNearestStops, findRoutes, formatDisplayTime, mockRoutes, Route } from '@/lib/data';

type NearbyStop = {
  stop: Route['stops'][number];
  route: Route;
  distance: number;
};

type UserLocation = {
  lat: number;
  lng: number;
  isFallback: boolean;
};

const fallbackLocation: UserLocation = {
  lat: 13.3325,
  lng: 74.744,
  isFallback: true,
};

const StopDistanceMap = dynamic(() => import('@/components/StopDistanceMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-slate-100 dark:bg-slate-900" />,
});

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [favoriteRoutes, setFavoriteRoutes] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
  });
  const [searchResults, setSearchResults] = useState<Route[]>(mockRoutes);
  const [hasSearched, setHasSearched] = useState(false);
  const [nearestStops, setNearestStops] = useState<NearbyStop[]>(() => findNearestStops(fallbackLocation.lat, fallbackLocation.lng, 10));
  const [nearestStopIndex, setNearestStopIndex] = useState(0);
  const [selectedNearestStop, setSelectedNearestStop] = useState<NearbyStop | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>(fallbackLocation);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { showToast } = useToast();

  const handleToggleFavorite = useCallback(
    (routeId: string) => {
      setFavoriteRoutes((current) => {
        const route = mockRoutes.find((item) => item.id === routeId);
        const exists = current.includes(routeId);
        const nextFavorites = exists ? current.filter((id) => id !== routeId) : [...current, routeId];

        localStorage.setItem('favorites', JSON.stringify(nextFavorites));
        showToast(`${route?.busNumber ?? 'Route'} ${exists ? 'removed from' : 'added to'} favorites`);
        return nextFavorites;
      });
    },
    [showToast]
  );

  const handleGetNearestStops = useCallback(() => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setUserLocation(fallbackLocation);
      setNearestStops(findNearestStops(fallbackLocation.lat, fallbackLocation.lng, 10));
      setNearestStopIndex(0);
      setLoadingLocation(false);
      showToast('Showing sample stops near Udupi', 'info');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isFallback: false,
        };
        const nearest = findNearestStops(currentLocation.lat, currentLocation.lng, 10);
        setUserLocation(currentLocation);
        setNearestStops(nearest);
        setNearestStopIndex(0);
        setLoadingLocation(false);
        showToast('Nearby stops refreshed');
      },
      () => {
        setUserLocation(fallbackLocation);
        setNearestStops(findNearestStops(fallbackLocation.lat, fallbackLocation.lng, 10));
        setNearestStopIndex(0);
        setLoadingLocation(false);
        showToast('Showing sample stops near Udupi', 'info');
      }
    );
  }, [showToast]);

  const handleSearch = useCallback((from: string, to: string) => {
    const results = findRoutes(from, to);
    setSearchResults(results);
    setHasSearched(Boolean(from || to));
    setActiveSection('routes');
  }, []);

  const handleSectionChange = useCallback(
    (section: string) => {
      setActiveSection(section);
      setHasSearched(false);

      if (section === 'favorites') {
        setSearchResults(mockRoutes.filter((route) => favoriteRoutes.includes(route.id)));
      } else {
        setSearchResults(mockRoutes);
      }

      if (section === 'home') {
        setSearchResults(mockRoutes);
      }
    },
    [favoriteRoutes]
  );

  const routesToShow = useMemo(() => {
    if (activeSection === 'favorites') {
      return mockRoutes.filter((route) => favoriteRoutes.includes(route.id));
    }

    return searchResults;
  }, [activeSection, favoriteRoutes, searchResults]);

  const uniqueNearestStops = useMemo(() => {
    const seenStops = new Set<string>();

    return nearestStops.filter((item) => {
      const stopKey = `${item.stop.name}-${item.stop.lat}-${item.stop.lng}`;

      if (seenStops.has(stopKey)) {
        return false;
      }

      seenStops.add(stopKey);
      return true;
    });
  }, [nearestStops]);

  const activeNearestStop = uniqueNearestStops[nearestStopIndex] ?? uniqueNearestStops[0] ?? null;

  const getStopDistance = useCallback(
    (item: NearbyStop) => calculateDistance(userLocation.lat, userLocation.lng, item.stop.lat, item.stop.lng),
    [userLocation.lat, userLocation.lng]
  );

  const moveNearestStop = useCallback(
    (direction: 'previous' | 'next') => {
      setSelectedNearestStop(null);
      setNearestStopIndex((current) => {
        if (uniqueNearestStops.length === 0) return 0;

        return direction === 'next'
          ? (current + 1) % uniqueNearestStops.length
          : (current - 1 + uniqueNearestStops.length) % uniqueNearestStops.length;
      });
    },
    [uniqueNearestStops.length]
  );

  const sectionTitle = hasSearched
    ? `${routesToShow.length} route${routesToShow.length === 1 ? '' : 's'} found`
    : activeSection === 'favorites'
      ? 'Favorite routes'
      : activeSection === 'schedules'
        ? 'Today schedule'
        : activeSection === 'about'
          ? 'About the network'
          : 'Available routes';
  const showHomeContent = activeSection === 'home' && !hasSearched;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen((current) => !current)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        favoriteCount={favoriteRoutes.length}
      />

      <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <SearchHeader onSidebarToggle={() => setSidebarOpen((current) => !current)} onSearch={handleSearch} />

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
          {showHomeContent && (
            <>
              <section className="mb-8">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Bus Commuter</p>
                <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-4xl">Find buses, stops, and timings quickly.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  Search your start and destination, then compare clean route cards with stop count, timings, and route details.
                </p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
                      <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Nearest Stops
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Location-aware suggestions with route and arrival context.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetNearestStops}
                    disabled={loadingLocation}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60 dark:border-slate-800 dark:text-slate-200"
                  >
                    <LocateFixed className="h-4 w-4" />
                    {loadingLocation ? 'Refreshing' : 'Refresh'}
                  </button>
                </div>

                <div
                  className="mt-5"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight') moveNearestStop('next');
                    if (event.key === 'ArrowLeft') moveNearestStop('previous');
                  }}
                  aria-label="Nearest stop carousel"
                >
                  {loadingLocation && uniqueNearestStops.length === 0 ? (
                    <div className="h-32 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                  ) : activeNearestStop ? (
                    <div className="flex items-stretch gap-3">
                      <button
                        type="button"
                        onClick={() => moveNearestStop('previous')}
                        className="hidden w-11 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-300 sm:flex"
                        aria-label="Previous nearest stop"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="min-w-0 flex-1 overflow-hidden rounded-lg">
                        <div
                          className="flex transition-transform duration-300 ease-out"
                          style={{ transform: `translateX(-${nearestStopIndex * 100}%)` }}
                        >
                          {uniqueNearestStops.map((item, index) => (
                            <button
                              key={`${item.stop.name}-${item.stop.lat}-${item.stop.lng}`}
                              type="button"
                              onClick={() => setSelectedNearestStop(item)}
                              className="w-full min-w-full flex-none rounded-lg border border-slate-100 bg-slate-50 p-5 text-left transition hover:border-emerald-200 hover:bg-white focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-800"
                              aria-label={`Open map for ${item.stop.name}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                                    Stop {index + 1} of {uniqueNearestStops.length}
                                  </p>
                                  <h3 className="mt-2 truncate text-xl font-black text-slate-950 dark:text-white">{item.stop.name}</h3>
                                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{item.route.routeName}</p>
                                </div>
                                <span className="rounded-md px-2.5 py-1.5 text-xs font-black text-white" style={{ backgroundColor: item.route.color }}>
                                  {item.route.busNumber}
                                </span>
                              </div>

                              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                <div>
                                  <p className="text-xs font-bold uppercase text-slate-400">Distance</p>
                                  <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{getStopDistance(item).toFixed(1)} km</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase text-slate-400">Arrival</p>
                                  <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{formatDisplayTime(item.stop.arrivalTime)}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold uppercase text-slate-400">Location</p>
                                  <p className="mt-1 flex items-center gap-1 text-sm font-black text-slate-950 dark:text-white">
                                    <Navigation2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    View map
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => moveNearestStop('next')}
                        className="hidden w-11 flex-none items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-300 sm:flex"
                        aria-label="Next nearest stop"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      No nearby stops available.
                    </div>
                  )}

                  {uniqueNearestStops.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
                      <button
                        type="button"
                        onClick={() => moveNearestStop('previous')}
                        className="rounded-md border border-slate-200 p-2 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                        aria-label="Previous nearest stop"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {nearestStopIndex + 1} / {uniqueNearestStops.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => moveNearestStop('next')}
                        className="rounded-md border border-slate-200 p-2 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                        aria-label="Next nearest stop"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {selectedNearestStop && (
                    <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-black text-slate-950 dark:text-white">{selectedNearestStop.stop.name}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {getStopDistance(selectedNearestStop).toFixed(1)} km from {userLocation.isFallback ? 'sample location' : 'your current location'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedNearestStop(null)}
                          className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
                          aria-label="Close stop map"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="h-[320px] sm:h-[420px]">
                        <StopDistanceMap stop={selectedNearestStop.stop} userLocation={userLocation} />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activeSection === 'about' && (
            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Bus Commuter is structured as a professional route discovery platform for regional commuters. The current dataset is mocked for product polish, with room for real-time feeds, account sync, alerts, and operator dashboards.
            </section>
          )}

          <section className={showHomeContent ? 'mt-10' : 'mt-0'}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">{sectionTitle}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {activeSection === 'favorites'
                    ? 'Routes saved for quick access.'
                    : activeSection === 'schedules'
                      ? 'Mock schedule intelligence using current route timings.'
                      : 'Browse available buses with timing, distance, and status cues.'}
                </p>
              </div>
              {hasSearched && (
                <button
                  type="button"
                  onClick={() => {
                    setHasSearched(false);
                    setSearchResults(mockRoutes);
                    setActiveSection('home');
                  }}
                  className="rounded-md px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                >
                  Clear search
                </button>
              )}
            </div>

            {routesToShow.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {routesToShow.map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    isFavorite={favoriteRoutes.includes(route.id)}
                    onToggleFavorite={() => handleToggleFavorite(route.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <MapPin className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">No routes to show</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search another stop or add routes to favorites.</p>
              </div>
            )}
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="font-semibold text-slate-700 dark:text-slate-200">Bus Commuter</p>
            <div className="flex gap-4">
              <button type="button" onClick={() => handleSectionChange('routes')} className="hover:text-emerald-700 dark:hover:text-emerald-300">Routes</button>
              <button type="button" onClick={() => handleSectionChange('schedules')} className="hover:text-emerald-700 dark:hover:text-emerald-300">Schedules</button>
              <button type="button" onClick={() => handleSectionChange('about')} className="hover:text-emerald-700 dark:hover:text-emerald-300">About</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
