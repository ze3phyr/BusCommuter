'use client';

import { useState } from 'react';
import { LocateFixed, Search, UserRound } from 'lucide-react';
import { getLocationSuggestions } from '@/lib/data';

interface SearchHeaderProps {
  onSearch: (from: string, to: string) => void;
  onProfileClick: () => void;
  signedInLabel?: string;
}

export default function SearchHeader({ onSearch, onProfileClick, signedInLabel }: SearchHeaderProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const fromSuggestions = getLocationSuggestions(from);
  const toSuggestions = getLocationSuggestions(to);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(from.trim(), to.trim());
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      () => setFrom('Current Location'),
      () => setFrom('Udupi Bus Stand')
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="hidden flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex">
            <div className="relative min-w-0 flex-1">
              <span className="absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-500" />
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="From"
                className="h-11 w-full rounded-md border border-transparent bg-slate-50 pl-8 pr-11 text-sm font-medium text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
                aria-label="From"
                list="from-stop-suggestions"
              />
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800"
                aria-label="Use current location"
              >
                <LocateFixed className="h-4 w-4" />
              </button>
            </div>

            <div className="h-px w-8 bg-slate-200 dark:bg-slate-700" />

            <div className="relative min-w-0 flex-1">
              <span className="absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-blue-500" />
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="Where"
                className="h-11 w-full rounded-md border border-transparent bg-slate-50 pl-8 pr-3 text-sm font-medium text-slate-900 transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
                aria-label="Where"
                list="to-stop-suggestions"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>

          <datalist id="from-stop-suggestions">
            {fromSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>

          <datalist id="to-stop-suggestions">
            {toSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>

          <button
            type="button"
            onClick={onProfileClick}
            className="ml-auto rounded-lg bg-slate-950 p-2.5 text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
            aria-label={signedInLabel ? `Open account for ${signedInLabel}` : 'Open login'}
            title={signedInLabel ? `Signed in as ${signedInLabel}` : 'Sign in'}
          >
            <UserRound className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mt-4 space-y-2 md:hidden">
          <div className="grid gap-2">
            <input
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder="From"
              className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              aria-label="From"
              list="from-stop-suggestions-mobile"
            />
            <input
              value={to}
              onChange={(event) => setTo(event.target.value)}
              placeholder="Where"
              className="h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              aria-label="Where"
              list="to-stop-suggestions-mobile"
            />
          </div>
          <datalist id="from-stop-suggestions-mobile">
            {fromSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          <datalist id="to-stop-suggestions-mobile">
            {toSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-bold text-white">
            <Search className="h-4 w-4" />
            Search routes
          </button>
        </form>
      </div>
    </header>
  );
}
