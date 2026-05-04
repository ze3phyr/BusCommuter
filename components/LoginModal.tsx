'use client';

import { FormEvent, useState } from 'react';
import { Lock, Mail, Phone, UserRound, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (contact: string) => void;
}

export default function LoginModal({ isOpen, onClose, onSignIn }: LoginModalProps) {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContact = contact.trim();

    if (!trimmedContact || !password.trim()) {
      setError('Enter your email or phone number and password.');
      return;
    }

    onSignIn(trimmedContact);
    setContact('');
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[80] flex min-h-screen items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close login" onClick={onClose} />

      <section
        className="relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 id="login-title" className="text-lg font-black text-slate-950 dark:text-white">
                Sign in
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use an email or phone number.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close login"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Email or phone number</span>
            <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-emerald-300 focus-within:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus-within:bg-slate-950">
              <Mail className="h-4 w-4 text-slate-400" />
              <Phone className="h-4 w-4 text-slate-400" />
              <input
                value={contact}
                onChange={(event) => {
                  setContact(event.target.value);
                  setError('');
                }}
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 placeholder:text-slate-400 dark:text-white"
                placeholder="name@example.com or 9876543210"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Password</span>
            <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-emerald-300 focus-within:bg-white dark:border-slate-800 dark:bg-slate-900 dark:focus-within:bg-slate-950">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-950 placeholder:text-slate-400 dark:text-white"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200"
            >
              Continue as guest
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
