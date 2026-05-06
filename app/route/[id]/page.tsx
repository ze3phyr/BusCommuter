'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, Bus, Clock3, Heart, MapPin, Navigation2, RadioTower, Route as RouteIcon, Share2 } from 'lucide-react';
import RouteMap from '@/components/RouteMap';
import BusStatusUpdate from '@/components/BusStatusUpdate';
import RouteSubscription from '@/components/RouteSubscription';
import NotificationsList from '@/components/NotificationsList';
import { useToast } from '@/components/ToastProvider';
import { formatDisplayTime, mockRoutes } from '@/lib/data';

export default function RoutePage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  const route = mockRoutes.find((item) => item.id === routeId);
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
    return savedFavorites.includes(routeId);
  });
  const { showToast } = useToast();

  const stats = useMemo(() => {
    if (!route) return null;

    return {
      duration: Math.max(route.stops.length - 1, 1) * 18,
      distance: (route.stops.length * 4.6).toFixed(1),
      firstTime: formatDisplayTime(route.stops[0]?.arrivalTime ?? ''),
      lastTime: formatDisplayTime(route.stops.at(-1)?.arrivalTime ?? ''),
      live: ['r1', 'r2', 'r4'].includes(route.id),
    };
  }, [route]);

  const handleToggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
    const nextFavorite = !isFavorite;
    const nextFavorites = nextFavorite
      ? Array.from(new Set([...savedFavorites, routeId]))
      : savedFavorites.filter((id) => id !== routeId);

    setIsFavorite(nextFavorite);
    localStorage.setItem('favorites', JSON.stringify(nextFavorites));
    showToast(`${route?.busNumber ?? 'Route'} ${nextFavorite ? 'added to' : 'removed from'} favorites`);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share && route) {
      await navigator.share({
        title: route.routeName,
        text: `Track ${route.busNumber} from ${route.from} to ${route.to}`,
        url,
      });
      return;
    }

    await navigator.clipboard.writeText(url);
    showToast('Route link copied');
  };

  if (!route || !stats) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <MapPin className="mx-auto h-10 w-10 text-slate-300" />
          <h1 className="mt-4 text-xl font-black text-slate-950 dark:text-white">Route not found</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The requested bus route is not available in the current network.</p>
          <Link href="/" className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <NotificationsList routes={mockRoutes} />
            <button
              type="button"
              onClick={handleShare}
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Share route"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`rounded-lg border p-2.5 shadow-sm transition ${
                isFavorite
                  ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-900 dark:bg-rose-950/40'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div
                className="flex h-16 w-16 flex-none items-center justify-center rounded-lg text-lg font-black text-white shadow-xl"
                style={{ backgroundColor: route.color }}
              >
                {route.busNumber}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <RadioTower className="h-3.5 w-3.5" />
                    {stats.live ? 'Live tracking' : 'Scheduled service'}
                  </span>
                  {stats.live && <span className="live-pulse h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                </div>
                <h1 className="mt-3 text-2xl font-black text-slate-950 dark:text-white sm:text-4xl">{route.routeName}</h1>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {route.from} to {route.to}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
              {[
                { icon: Clock3, label: 'Journey', value: `${stats.duration} min` },
                { icon: RouteIcon, label: 'Distance', value: `${stats.distance} km` },
                { icon: Bus, label: 'Stops', value: route.stops.length },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                  <item.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-2 text-base font-black text-slate-950 dark:text-white">{item.value}</p>
                  <p className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">Route Map</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Prominent route path with stop markers.</p>
              </div>
              <Navigation2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="h-[460px] sm:h-[560px]">
              <RouteMap route={route} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Stops & Timings</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                First trip {stats.firstTime}, final arrival {stats.lastTime}
              </p>
            </div>

            <ol className="max-h-[560px] overflow-y-auto px-5 py-4">
              {route.stops.map((stop, index) => {
                const first = index === 0;
                const last = index === route.stops.length - 1;

                return (
                  <li key={`${stop.id}-${index}`} className="relative grid grid-cols-[32px_1fr_auto] gap-3 pb-5 last:pb-0">
                    {!last && <span className="absolute left-[15px] top-8 h-full w-px bg-slate-200 dark:bg-slate-700" />}
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                        first
                          ? 'bg-emerald-600 text-white'
                          : last
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{stop.name}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {first ? 'Starting point' : last ? 'Final stop' : `${index * 4 + 3} min after departure`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-950 dark:text-white">{formatDisplayTime(stop.arrivalTime)}</p>
                      <p className="text-[11px] font-bold uppercase text-slate-400">ETA</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <BusStatusUpdate routeId={routeId} busNumber={route.busNumber} defaultEta={route.stops[0]?.arrivalTime} />
          <RouteSubscription routeId={routeId} busNumber={route.busNumber} />
        </section>
      </main>
    </div>
  );
}
