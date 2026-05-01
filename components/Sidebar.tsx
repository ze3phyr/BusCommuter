'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Clock,
  Settings,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bus,
  Star,
  Info,
  Moon,
  Sun,
  User,
  Trash2,
  Share2,
  Download,
  Bell,
  BellOff
} from 'lucide-react';
import { mockRoutes, Route } from '@/lib/data';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteRoutes: string[];
  onToggleFavorite: (routeId: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { icon: Heart, label: 'Favorites', id: 'favorites' },
  { icon: Clock, label: 'Recent', id: 'recent' },
  { icon: MapPin, label: 'Nearby', id: 'nearby' },
  { icon: Star, label: 'Saved', id: 'saved' },
];

const settingsItems = [
  { icon: Bell, label: 'Notifications', id: 'notifications', toggle: true },
  { icon: Download, label: 'Offline Maps', id: 'offline' },
  { icon: Share2, label: 'Share App', id: 'share' },
];

export default function Sidebar({
  isOpen,
  onClose,
  favoriteRoutes,
  onToggleFavorite,
  isDark,
  onThemeToggle,
  activeSection,
  onSectionChange
}: SidebarProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineMapsEnabled, setOfflineMapsEnabled] = useState(false);

  const handleMenuItemClick = (id: string) => {
    onSectionChange(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    // In a real app, this would update user preferences or send to API
    console.log('Notifications:', !notificationsEnabled ? 'enabled' : 'disabled');
  };

  const handleToggleOfflineMaps = () => {
    setOfflineMapsEnabled(prev => !prev);
    console.log('Offline Maps:', !offlineMapsEnabled ? 'enabled' : 'disabled');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bus Commuter',
        text: 'Find your perfect bus route with Bus Commuter!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getFavoriteRouteDetails = (routeId: string) => {
    return mockRoutes.find(r => r.id === routeId);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-0 lg:w-16'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={`p-3 border-b border-gray-200 dark:border-zinc-800 ${!isOpen && 'lg:p-2'}`}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                <Bus className="text-white" size={18} />
              </div>
              {isOpen && (
                <div className="transition-opacity duration-200">
                  <h1 className="text-sm font-bold text-gray-900 dark:text-white">Bus Commuter</h1>
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          {isOpen && (
            <div className="p-3 border-b border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">Guest User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sign in to sync</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 p-2 overflow-y-auto ${!isOpen && 'lg:hidden'}`}>
            {isOpen && (
              <>
                <div className="mb-4">
                  <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">Menu</p>
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        activeSection === item.id
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Theme Toggle */}
                <div className="mb-4">
                  <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">Preferences</p>
                  <button
                    onClick={onThemeToggle}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {isDark ? (
                      <Sun size={18} className="flex-shrink-0" />
                    ) : (
                      <Moon size={18} className="flex-shrink-0" />
                    )}
                    <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <button
                    onClick={handleToggleNotifications}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {notificationsEnabled ? (
                      <Bell size={18} className="flex-shrink-0 text-green-500" />
                    ) : (
                      <BellOff size={18} className="flex-shrink-0 text-gray-400" />
                    )}
                    <span className="font-medium">Notifications</span>
                    <div className={`ml-auto w-8 h-5 rounded-full transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${notificationsEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                  <button
                    onClick={handleToggleOfflineMaps}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Download size={18} className="flex-shrink-0" />
                    <span className="font-medium">Offline Maps</span>
                    <div className={`ml-auto w-8 h-5 rounded-full transition-colors ${offlineMapsEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${offlineMapsEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                    </div>
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Share2 size={18} className="flex-shrink-0" />
                    <span className="font-medium">Share App</span>
                  </button>
                </div>

                {/* Favorites Section */}
                {favoriteRoutes.length > 0 && (
                  <div>
                    <p className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">Favorites</p>
                    <div className="space-y-1">
                      {favoriteRoutes.map((routeId) => {
                        const route = getFavoriteRouteDetails(routeId);
                        if (!route) return null;
                        return (
                          <Link
                            key={routeId}
                            href={`/route/${routeId}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                          >
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: route.color }}
                            >
                              {route.busNumber}
                            </div>
                            <span className="truncate flex-1">{route.routeName}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                onToggleFavorite(routeId);
                              }}
                              className="p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom Section */}
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-zinc-800">
                  <button
                    onClick={() => handleMenuItemClick('settings')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings size={18} className="flex-shrink-0" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <button
                    onClick={() => handleMenuItemClick('about')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Info size={18} className="flex-shrink-0" />
                    <span className="font-medium">About</span>
                  </button>
                </div>
              </>
            )}

            {/* Collapsed state - icons only */}
            {!isOpen && (
              <div className="flex flex-col items-center gap-2 lg:p-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      activeSection === item.id
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                    title={item.label}
                  >
                    <item.icon size={18} className={activeSection === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'} />
                  </button>
                ))}
                <div className="w-8 h-px bg-gray-200 dark:bg-zinc-700 my-2" />
                <button
                  onClick={onThemeToggle}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  title={isDark ? 'Light Mode' : 'Dark Mode'}
                >
                  {isDark ? (
                    <Sun size={18} className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon size={18} className="text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            )}
          </nav>

          {/* Collapse Toggle */}
          <button
            onClick={onClose}
            className="absolute -right-3 top-16 w-6 h-6 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft size={14} className="text-gray-500" />
            ) : (
              <ChevronRight size={14} className="text-gray-500" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
