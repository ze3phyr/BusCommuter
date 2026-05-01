// components/RouteMap.tsx
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Route } from '@/lib/data';

// Fix Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  route: Route;
}

export default function RouteMap({ route }: RouteMapProps) {
  const positions = route.stops.map(stop => [stop.lat, stop.lng] as [number, number]);
  const center = [route.stops[0].lat, route.stops[0].lng] as [number, number];

  return (
    <MapContainer
      center={center}
      zoom={11}
      className="h-[400px] w-full rounded-2xl"
      scrollWheelZoom={false}
      dragging={true}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Draw the route line */}
      <Polyline
        positions={positions}
        color={route.color}
        weight={5}
        opacity={0.7}
      />

      {/* Markers for each stop */}
      {route.stops.map((stop, index) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>
            <div className="min-w-[200px]">
              <strong className="text-lg">{stop.name}</strong><br />
              <span className="text-green-600 font-medium">Arrival: {stop.arrivalTime}</span><br />
              <small>Stop {index + 1} of {route.stops.length}</small>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
