// app/route/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { mockRoutes, Route as RouteType } from '@/lib/data';
import RouteMap from '@/components/RouteMap';

export default function RoutePage() {
  const params = useParams();

  const [isFavorite, setIsFavorite] = useState(false);

  const routeId = params.id as string;
  const route = mockRoutes.find(r => r.id === routeId);

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Route not found</p>
          <Link href="/" className="text-green-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={24} />
              <span className="font-medium">Back to Search</span>
            </Link>
            
            <div className="ml-4">
              <p className="font-bold text-3xl text-gray-900">{route.busNumber}</p>
              <p className="text-gray-600 text-lg">{route.routeName}</p>
            </div>
          </div>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-full transition-all ${isFavorite ? 'text-yellow-500 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Star size={28} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Route Summary */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm flex flex-wrap gap-10">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-semibold text-xl">{route.from}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="font-semibold text-xl">{route.to}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Stops</p>
            <p className="font-semibold text-xl">{route.stops.length}</p>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-5 flex items-center gap-3">
            <MapPin className="text-green-600" size={28} />
            Route Map
          </h2>
          <div className="bg-white p-5 rounded-3xl shadow-sm">
            <RouteMap route={route} />
          </div>
        </div>

        {/* Stops and Timings */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Clock className="text-green-600" size={28} />
            Stops & Timings
          </h2>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm divide-y">
            {route.stops.map((stop, index) => (
              <div 
                key={stop.id} 
                className={`px-8 py-7 flex justify-between items-center hover:bg-green-50 transition-all ${
                  index === 0 ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-gray-900">{stop.name}</p>
                    {index === 0 && <p className="text-green-600 text-sm mt-1">Starting Point</p>}
                    {index === route.stops.length - 1 && <p className="text-green-600 text-sm mt-1">Final Stop</p>}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800 tracking-tight">{stop.arrivalTime}</p>
                  <p className="text-sm text-gray-500">Arrival Time</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}