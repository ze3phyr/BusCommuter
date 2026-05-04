'use client';

import { LogOut, UserCircle2, X } from 'lucide-react';

interface AccountMenuProps {
  contact: string;
  displayName?: string;
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onSignOut: () => void;
}

export default function AccountMenu({
  contact,
  displayName,
  isOpen,
  onClose,
  onViewProfile,
  onSignOut,
}: AccountMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close account menu"
        onClick={onClose}
      />

      <section className="absolute right-4 top-20 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950 sm:right-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Account</p>
            <p className="mt-2 truncate text-base font-black text-slate-950 dark:text-white">{displayName || contact}</p>
            {displayName && <p className="mt-1 truncate text-sm font-semibold text-slate-500 dark:text-slate-400">{contact}</p>}
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Signed in locally on this device.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close account menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={onViewProfile}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:text-emerald-300"
          >
            <UserCircle2 className="h-4 w-4" />
            View profile
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-red-600 dark:bg-white dark:text-slate-950 dark:hover:bg-red-200"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
