'use client';

import Link from 'next/link';
import { ArrowRight, Bus, Clock3, Heart, MapPin, RadioTower, Route as RouteIcon } from 'lucide-react';
import { formatDisplayTime, Route as RouteType } from '@/lib/data';

interface RouteCardProps {
  route: RouteType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function RouteCard({ route, isFavorite, onToggleFavorite }: RouteCardProps) {
  const duration = Math.max(route.stops.length - 1, 1) * 18;
  const distance = (route.stops.length * 4.6).toFixed(1);
  const live = ['r1', 'r2', 'r4'].includes(route.id);

  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-800">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-12 w-12 flex-none items-center justify-center rounded-lg text-sm font-black text-white shadow-lg"
            style={{ backgroundColor: route.color }}
          >
            {route.busNumber}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-950 dark:text-white">{route.routeName}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Bus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {route.stops.length} stops
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleFavorite}
          className={`rounded-lg p-2 transition ${
            isFavorite
              ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/40'
              : 'text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="my-4 hidden grid-cols-[1fr_auto_1fr] items-center gap-3 sm:grid">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">From</p>
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{route.from}</p>
        </div>
        <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="h-px w-8 bg-current" />
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
          <span className="h-px w-8 bg-current" />
          <span className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">Where</p>
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{route.to}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 dark:border-slate-800">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400">
            <Clock3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Time
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">{duration} min</p>
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400">
            <RouteIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Distance
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950 dark:text-white">{distance} km</p>
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-semibold uppercase text-slate-400">
            <RadioTower className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Status
          </p>
          <p className={`mt-1 text-sm font-bold ${live ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {live ? 'Live' : 'Scheduled'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDisplayTime(route.stops[0]?.arrivalTime)}</span>
          <span className="mx-1">to</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{formatDisplayTime(route.stops.at(-1)?.arrivalTime ?? '')}</span>
        </div>
        <Link
          href={`/route/${route.id}`}
          className="inline-flex flex-none items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-300"
        >
          Details
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Link>
      </div>
    </article>
  );
}
