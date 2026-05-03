'use client';

import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { formatDisplayTime, Route } from '@/lib/data';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RouteMapProps {
  route: Route;
}

export default function RouteMap({ route }: RouteMapProps) {
  const positions = route.stops.map((stop) => [stop.lat, stop.lng] as [number, number]);
  const center = positions[Math.floor(positions.length / 2)] ?? positions[0];

  return (
    <MapContainer center={center} zoom={10} className="h-full w-full" scrollWheelZoom={false} zoomControl>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Polyline positions={positions} pathOptions={{ color: route.color, weight: 6, opacity: 0.78, lineCap: 'round' }} />
      <Polyline positions={positions} pathOptions={{ color: '#ffffff', weight: 2, opacity: 0.45, lineCap: 'round' }} />

      {route.stops.map((stop, index) => (
        <Marker key={`${stop.id}-${index}`} position={[stop.lat, stop.lng]}>
          <Popup>
            <div className="min-w-44">
              <p className="font-bold text-slate-950">{stop.name}</p>
              <p className="mt-1 text-sm text-emerald-700">Arrival: {formatDisplayTime(stop.arrivalTime)}</p>
              <p className="text-xs text-slate-500">Stop {index + 1} of {route.stops.length}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
