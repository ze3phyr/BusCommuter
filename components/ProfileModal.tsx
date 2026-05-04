'use client';

import { ChangeEvent, useState } from 'react';
import { BadgeCheck, Bell, Camera, Mail, MapPin, Phone, ShieldCheck, UserRound, X } from 'lucide-react';
import { getLocationSuggestions } from '@/lib/data';

export type ProfileUser = {
  contact: string;
  displayName?: string;
  photoUrl?: string;
  homeStop?: string;
  reminderPreference?: string;
};

interface ProfileModalProps {
  user: ProfileUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: ProfileUser) => void;
}

const reminderOptions = ['10 minutes before', '15 minutes before', '30 minutes before'];

export default function ProfileModal({ user, isOpen, onClose, onSave }: ProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName ?? '');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? '');
  const [homeStop, setHomeStop] = useState(user.homeStop ?? '');
  const [reminderPreference, setReminderPreference] = useState(user.reminderPreference ?? reminderOptions[0]);

  if (!isOpen) return null;

  const isEmail = user.contact.includes('@');
  const primaryLabel = isEmail ? 'Email' : 'Phone number';
  const ContactIcon = isEmail ? Mail : Phone;
  const stopSuggestions = getLocationSuggestions(homeStop);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({
      ...user,
      displayName: displayName.trim(),
      photoUrl,
      homeStop: homeStop.trim(),
      reminderPreference,
    });
  };

  return (
    <div className="fixed inset-0 z-[85] flex min-h-screen items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close profile" onClick={onClose} />

      <section
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 id="profile-title" className="text-lg font-black text-slate-950 dark:text-white">
                Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Local account details.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
            aria-label="Close profile"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[14rem_1fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-10 w-10" />
              )}
            </div>

            <label className="mt-4 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <Camera className="h-4 w-4" />
              Change photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
            </label>

            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                Remove photo
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                <BadgeCheck className="h-4 w-4" />
                Active account
              </div>
              <div className="mt-4 flex items-start gap-3">
                <div className="rounded-md bg-white p-2 text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-300">
                  <ContactIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{primaryLabel}</p>
                  <p className="mt-1 break-all text-sm font-bold text-slate-950 dark:text-white">{user.contact}</p>
                </div>
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Display name</span>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your commuter name"
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4" />
                Preferred home stop
              </span>
              <input
                value={homeStop}
                onChange={(event) => setHomeStop(event.target.value)}
                placeholder="Example: Udupi Bus Stand"
                list="profile-stop-suggestions"
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <datalist id="profile-stop-suggestions">
                {stopSuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                <Bell className="h-4 w-4" />
                Bus reminder preference
              </span>
              <select
                value={reminderPreference}
                onChange={(event) => setReminderPreference(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 focus:border-emerald-300 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {reminderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-emerald-700 dark:text-emerald-300" />
                <div>
                  <p className="text-sm font-black text-slate-950 dark:text-white">Local-only profile</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    These settings stay on this browser until real account sync is connected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Save profile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-800 dark:text-slate-200"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}
