'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bus, CalendarDays, Heart, Home, Info, Map, Menu, Moon, Route, Sun, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface SidebarProps {
  isMobileOpen: boolean;
  isDesktopOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
  onDesktopToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  favoriteCount: number;
}

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Heart, label: 'Favorites', id: 'favorites' },
  { icon: CalendarDays, label: 'Schedules', id: 'schedules' },
  { icon: Route, label: 'Routes', id: 'routes' },
  { icon: Info, label: 'About', id: 'about' },
];

export default function Sidebar({
  isMobileOpen,
  isDesktopOpen,
  onMobileOpen,
  onMobileClose,
  onDesktopToggle,
  activeSection,
  onSectionChange,
  favoriteCount,
}: SidebarProps) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const compact = !isDesktopOpen;

  const handleNav = (section: string) => {
    onSectionChange(section);
    if (window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  return (
    <>
      {!isMobileOpen && (
        <button
          type="button"
          onClick={onMobileOpen}
          className="fixed bottom-4 left-4 z-40 rounded-full bg-slate-950 p-2.5 text-white shadow-xl shadow-slate-950/25 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
      )}

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 border-r border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/5 backdrop-blur-xl transition-[width,transform] duration-300 dark:border-slate-800 dark:bg-slate-950/95 lg:translate-x-0 ${
          isMobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full'
        } ${isDesktopOpen ? 'lg:w-72' : 'lg:w-20'}`}
        aria-label="Primary navigation"
      >
        <div className="flex h-full flex-col p-3">
          <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/80 p-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/40 lg:p-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 lg:h-11 lg:w-11">
              <Bus className="h-4 w-4 lg:h-5 lg:w-5" />
            </div>
            {!compact && (
              <div className="min-w-0">
                <Link href="/" className="block truncate text-base font-bold text-slate-950 dark:text-white">
                  Bus Commuter
                </Link>
                <p className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Coastal transit intelligence
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={onMobileClose}
              className="ml-auto rounded-md p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-5 flex-1 space-y-1">
            {navItems.map((item) => {
              const selected = activeSection === item.id || (item.id === 'home' && pathname === '/' && activeSection === '');

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition lg:py-3 ${
                    selected
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                  } ${compact ? 'lg:justify-center' : ''}`}
                  title={compact ? item.label : undefined}
                  aria-current={selected ? 'page' : undefined}
                >
                  <item.icon className="h-4 w-4 flex-none lg:h-5 lg:w-5" />
                  {!compact && <span className="min-w-0 flex-1 text-left">{item.label}</span>}
                  {!compact && item.id === 'favorites' && favoriteCount > 0 && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">{favoriteCount}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-slate-200 pt-3 dark:border-slate-800">
            <div className={`rounded-lg bg-slate-100 p-3 dark:bg-slate-900 ${compact ? 'lg:hidden' : ''}`}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <Map className="h-4 w-4" />
                Service Network
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">24</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">tracked stops</p>
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">6</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">active routes</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:text-emerald-300 ${
                compact ? 'lg:justify-center' : ''
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {!compact && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
            </button>

            <button
              type="button"
              onClick={onDesktopToggle}
              className="hidden w-full items-center justify-center rounded-lg p-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white lg:flex"
              aria-label={isDesktopOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              title={isDesktopOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
