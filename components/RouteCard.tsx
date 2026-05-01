'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ChevronDown, ChevronUp, Heart, Calendar } from 'lucide-react';
import { Route as RouteType } from '@/lib/data';

interface RouteCardProps {
  route: RouteType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function RouteCard({ route, isFavorite, onToggleFavorite }: RouteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get start and end times from first and last stops
  const startTime = route.stops[0]?.arrivalTime || 'N/A';
  const endTime = route.stops[route.stops.length - 1]?.arrivalTime || 'N/A';

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
              style={{ backgroundColor: route.color }}
            >
              {route.busNumber}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {route.routeName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {route.stops.length} stops
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`p-2 rounded-lg transition-all flex-shrink-0 ${
              isFavorite
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Journey Times - Now visible on card */}
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-zinc-700">
          <div className="flex items-center gap-1.5 flex-1">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase font-medium">Start</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{startTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-zinc-700/50">
            <Clock size={12} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {((route.stops.length - 1) * 25)} min
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            <div className="min-w-0 text-right">
              <p className="text-[10px] text-gray-400 uppercase font-medium">End</p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{endTime}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          </div>
        </div>

        {/* Route Preview - From/To */}
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            <span className="truncate">{route.from}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-px bg-gray-200 dark:bg-zinc-600" />
            <ChevronDown size={10} className="text-gray-400 rotate-[-90deg]" />
            <div className="w-8 h-px bg-gray-200 dark:bg-zinc-600" />
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="truncate">{route.to}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          {isExpanded ? 'Hide Details' : 'View All Stops'}
          {isExpanded ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-zinc-700">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <MapPin size={12} className="text-green-500" />
              All Stops
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {route.stops.map((stop, index) => (
                <div key={stop.id} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      index === 0
                        ? 'bg-green-500'
                        : index === route.stops.length - 1
                        ? 'bg-red-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                    {stop.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[48px] text-right">
                    {stop.arrivalTime}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={`/route/${route.id}`}
              className="mt-3 block w-full py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold text-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
            >
              View Full Route Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
