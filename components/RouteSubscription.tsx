'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2, TrainFront } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';
import { subscribeToRoute, unsubscribeFromRoute, getUserSubscriptions } from '@/lib/db';

interface RouteSubscriptionProps {
  routeId: string;
  busNumber: string;
}

export default function RouteSubscription({ routeId, busNumber }: RouteSubscriptionProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const userId = 'anonymous-user';

  useEffect(() => {
    async function checkSubscription() {
      try {
        const subs = await getUserSubscriptions(userId);
        setIsSubscribed(subs.some(s => s.routeId === routeId));
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoading(false);
      }
    }
    checkSubscription();
  }, [routeId]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribeFromRoute(routeId, userId);
        setIsSubscribed(false);
        showToast(`Notifications disabled for ${busNumber}`);
      } else {
        await subscribeToRoute(routeId, userId, []);
        setIsSubscribed(true);
        showToast(`You will receive delay notifications for ${busNumber}`);
      }
    } catch (error) {
      showToast('Failed to update subscription. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          <span className="text-sm font-medium text-slate-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isSubscribed 
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' 
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}>
            {isSubscribed ? (
              <Bell className="h-5 w-5" />
            ) : (
              <BellOff className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Delay Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isSubscribed 
                ? `You're subscribed to ${busNumber} updates` 
                : 'Get notified about delays and ETA changes'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isSubscribed 
              ? 'bg-emerald-600' 
              : 'bg-slate-300 dark:bg-slate-700'
          } disabled:opacity-50`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isSubscribed ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {isSubscribed && (
        <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <TrainFront className="h-3.5 w-3.5" />
            <span>You&apos;ll receive push notifications when delays are reported</span>
          </div>
        </div>
      )}
    </div>
  );
}