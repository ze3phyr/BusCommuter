'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Bus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { updateBusStatus, getBusStatus } from '@/lib/db';
import type { BusStatusUpdate, BusStatus, Stop } from '@/lib/data';

interface BusStatusUpdateProps {
  routeId: string;
  busNumber: string;
  defaultEta?: string;
  stops?: Stop[];
}

export default function BusStatusUpdate({ routeId, busNumber, defaultEta, stops = [] }: BusStatusUpdateProps) {
  const [status, setStatus] = useState<BusStatus>('on_time');
  const [eta, setEta] = useState(defaultEta || '');
  const [etaStopId, setEtaStopId] = useState(stops[0]?.id || '');
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BusStatusUpdate | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    getBusStatus(routeId).then(setCurrentStatus);
  }, [routeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === 'delayed' && !eta) {
      showToast('Please enter the delayed ETA');
      return;
    }

    const selectedStop = stops.find((stop) => stop.id === etaStopId);

    setIsLoading(true);
    try {
      await updateBusStatus(
        routeId,
        status,
        status === 'cancelled' ? '' : eta,
        status === 'delayed' ? delayMinutes : 0,
        'anonymous-user',
        status === 'on_time' ? undefined : reason || undefined,
        status === 'delayed' ? selectedStop?.name : undefined
      );

      const statusLabel = status === 'on_time' ? 'On Time' : status === 'delayed' ? 'Delayed' : 'Cancelled';
      showToast(`${busNumber} status updated to ${statusLabel}`);
      
      const updated = await getBusStatus(routeId);
      setCurrentStatus(updated);
      
      setReason('');
    } catch (error) {
      showToast('Failed to update status. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'on_time', label: 'On Time', icon: CheckCircle, color: 'emerald' },
    { value: 'delayed', label: 'Delayed', icon: AlertTriangle, color: 'amber' },
    { value: 'cancelled', label: 'Cancelled', icon: Bus, color: 'rose' }
  ] as const;

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <h2 className="text-lg font-black text-slate-950 dark:text-white">Update Bus Status</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Report current status to help other commuters
        </p>
      </div>

      {currentStatus && (
        <div className="mx-5 mt-4 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase text-slate-400">Current Status</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
              currentStatus.status === 'on_time' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' :
              currentStatus.status === 'delayed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
              'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
            }`}>
              {currentStatus.status === 'on_time' && <CheckCircle className="h-4 w-4" />}
              {currentStatus.status === 'delayed' && <AlertTriangle className="h-4 w-4" />}
              {currentStatus.status === 'cancelled' && <Bus className="h-4 w-4" />}
              {currentStatus.status === 'on_time' ? 'On Time' : 
               currentStatus.status === 'delayed' ? `Delayed ${currentStatus.delayMinutes} min` : 'Cancelled'}
            </span>
            <span className="text-sm text-slate-500">
              {currentStatus.status === 'cancelled'
                ? 'No ETA'
                : currentStatus.etaStopName
                  ? `ETA at ${currentStatus.etaStopName}: ${currentStatus.estimatedArrival}`
                  : `ETA: ${currentStatus.estimatedArrival}`}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
            Bus Status
          </label>
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-bold transition ${
                  status === option.value
                    ? `border-${option.color}-300 bg-${option.color}-50 text-${option.color}-700 dark:border-${option.color}-800 dark:bg-${option.color}-950/30 dark:text-${option.color}-300`
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                }`}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {status === 'delayed' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                Delay Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="180"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                placeholder="e.g., 15"
              />
            </div>

            {stops.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  ETA For Stop
                </label>
                <select
                  value={etaStopId}
                  onChange={(e) => setEtaStopId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  {stops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                <Clock className="mr-1 inline h-4 w-4" />
                Delayed ETA
              </label>
              <input
                type="time"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </>
        )}

        {(status === 'delayed' || status === 'cancelled') && (
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              placeholder="e.g., Traffic jam, Road construction..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Bus className="h-4 w-4" />
              Update Status
            </>
          )}
        </button>
      </form>
    </div>
  );
}
