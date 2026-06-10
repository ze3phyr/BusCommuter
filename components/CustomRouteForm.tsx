'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Route } from '@/lib/data';

type StopInput = {
  name: string;
  time: string;
  coordinates: string;
};

interface CustomRouteFormProps {
  customRoutes: Route[];
  onSaveRoute: (route: Route) => void;
  onDeleteRoute: (routeId: string) => void;
}

const routeColors = ['#0f766e', '#2563eb', '#dc2626', '#9333ea', '#ea580c', '#0891b2'];

function normalizeTime(value: string): string {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, '').replace('.', ':');
  const match = trimmed.match(/^(\d{1,2})(?::?(\d{2}))?(am|pm)?$/);

  if (!match) return value.trim();

  let hours = Number(match[1]);
  const minutes = match[2] ?? '00';
  const period = match[3];

  if (period === 'am' && hours === 12) hours = 12;
  if (!period && hours > 12) hours -= 12;

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

function parseCoordinates(value: string): { lat: number; lng: number } | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/[,\s]+/).filter(Boolean);
  if (parts.length !== 2) return { lat: Number.NaN, lng: Number.NaN };

  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  return { lat, lng };
}

function buildCustomRoute(busName: string, routeName: string, stops: StopInput[], routeIndex: number): Route {
  const cleanStops = stops
    .map((stop) => ({
      name: stop.name.trim(),
      time: stop.time.trim(),
      coordinates: parseCoordinates(stop.coordinates),
    }))
    .filter((stop) => stop.name && stop.time);
  const from = cleanStops[0]?.name ?? 'Starting stop';
  const to = cleanStops.at(-1)?.name ?? from;
  const id = `custom-${Date.now()}`;

  return {
    id,
    busNumber: busName.trim(),
    routeName: routeName.trim() || `${from} -> ${to}`,
    from,
    to,
    color: routeColors[routeIndex % routeColors.length],
    stops: cleanStops.map((stop, index) => ({
      id: `${id}-stop-${index + 1}`,
      name: stop.name,
      arrivalTime: normalizeTime(stop.time),
      lat: stop.coordinates?.lat ?? 13.34 + index * 0.006,
      lng: stop.coordinates?.lng ?? 74.75 + index * 0.006,
    })),
  };
}

export default function CustomRouteForm({ customRoutes, onSaveRoute, onDeleteRoute }: CustomRouteFormProps) {
  const [busName, setBusName] = useState('');
  const [routeName, setRouteName] = useState('');
  const [stops, setStops] = useState<StopInput[]>([
    { name: '', time: '', coordinates: '' },
    { name: '', time: '', coordinates: '' },
  ]);
  const [error, setError] = useState('');

  const validStops = useMemo(
    () => stops.filter((stop) => stop.name.trim() && stop.time.trim()),
    [stops]
  );

  const handleStopChange = (index: number, field: keyof StopInput, value: string) => {
    setStops((current) =>
      current.map((stop, stopIndex) => (stopIndex === index ? { ...stop, [field]: value } : stop))
    );
  };

  const handleAddStop = () => {
    setStops((current) => [...current, { name: '', time: '', coordinates: '' }]);
  };

  const handleRemoveStop = (index: number) => {
    setStops((current) => current.filter((_, stopIndex) => stopIndex !== index));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!busName.trim()) {
      setError('Enter the bus name.');
      return;
    }

    if (validStops.length < 2) {
      setError('Add at least two stops with timings.');
      return;
    }

    const invalidCoordinate = validStops.some((stop) => {
      const coordinates = parseCoordinates(stop.coordinates);
      if (!coordinates) return false;

      return (
        Number.isNaN(coordinates.lat) ||
        Number.isNaN(coordinates.lng) ||
        coordinates.lat < -90 ||
        coordinates.lat > 90 ||
        coordinates.lng < -180 ||
        coordinates.lng > 180
      );
    });

    if (invalidCoordinate) {
      setError('Coordinates are optional, but must be valid when entered. Use: 13.342642, 74.747224');
      return;
    }

    onSaveRoute(buildCustomRoute(busName, routeName, stops, customRoutes.length));
    setBusName('');
    setRouteName('');
    setStops([
      { name: '', time: '', coordinates: '' },
      { name: '', time: '', coordinates: '' },
    ]);
    setError('');
  };

  return (
    <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Local route builder</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Add your own bus route</h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200">
            Bus name
            <input
              value={busName}
              onChange={(event) => setBusName(event.target.value)}
              placeholder="Example: HMT"
              className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200">
            Route name
            <input
              value={routeName}
              onChange={(event) => setRouteName(event.target.value)}
              placeholder="Optional"
              className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-emerald-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
            />
          </label>
        </div>

        <div className="mt-5 space-y-3">
          {stops.map((stop, index) => (
            <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
              <div className="grid gap-2 sm:grid-cols-[1fr_140px_40px]">
                <input
                  value={stop.name}
                  onChange={(event) => handleStopChange(index, 'name', event.target.value)}
                  placeholder={`Stop ${index + 1}`}
                  className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <input
                  value={stop.time}
                  onChange={(event) => handleStopChange(index, 'time', event.target.value)}
                  placeholder="7:32pm"
                  className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  disabled={stops.length <= 2}
                  className="flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900"
                  aria-label={`Remove stop ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2">
                <input
                  value={stop.coordinates}
                  onChange={(event) => handleStopChange(index, 'coordinates', event.target.value)}
                  placeholder="Coordinates (optional), example: 13.342642, 74.747224"
                  inputMode="decimal"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-3 text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAddStop}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200"
          >
            <Plus className="h-4 w-4" />
            Add stop
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <Save className="h-4 w-4" />
            Save route
          </button>
        </div>
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-black text-slate-950 dark:text-white">Saved local routes</h3>
        <div className="mt-4 space-y-3">
          {customRoutes.length > 0 ? (
            customRoutes.map((route) => (
              <div key={route.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950 dark:text-white">{route.busNumber}</p>
                    <p className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400">{route.routeName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteRoute(route.id)}
                    className="rounded-md p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30"
                    aria-label={`Delete ${route.busNumber}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {route.stops.length} stops, {route.from} to {route.to}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No local routes saved yet.
            </p>
          )}
        </div>
      </aside>
    </section>
  );
}
