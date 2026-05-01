import Link from "next/link";
import { mockRoutes } from "@/lib/data";
import { Bus, MapPin, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <Bus className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bus Commuter</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find your route</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Bus Commuter
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find bus routes, timings, and stops for your commute. Select a route below to see detailed information.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {mockRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/route/${route.id}`}
              className="group bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-zinc-700 hover:border-green-200 dark:hover:border-green-800"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: route.color }}
                >
                  {route.busNumber.replace(/\D/g, "")}
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {route.stops.length} stops
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {route.routeName}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <MapPin size={18} className="text-green-600" />
                  <span className="text-sm">{route.from}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Clock size={18} className="text-green-600" />
                  <span className="text-sm">{route.to}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2026 Bus Commuter. Built with Next.js.</p>
        </div>
      </footer>
    </div>
  );
}
