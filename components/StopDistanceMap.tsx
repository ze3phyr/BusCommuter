'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Stop } from '@/lib/data';

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type Location = {
  lat: number;
  lng: number;
};

interface StopDistanceMapProps {
  stop: Stop;
  userLocation: Location;
}

function FitRouteBounds({ stop, userLocation }: StopDistanceMapProps) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [userLocation.lat, userLocation.lng],
      [stop.lat, stop.lng],
    ]);

    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [map, stop.lat, stop.lng, userLocation.lat, userLocation.lng]);

  return null;
}

export default function StopDistanceMap({ stop, userLocation }: StopDistanceMapProps) {
  const userPosition: [number, number] = [userLocation.lat, userLocation.lng];
  const stopPosition: [number, number] = [stop.lat, stop.lng];

  return (
    <MapContainer center={stopPosition} zoom={13} className="h-full w-full" scrollWheelZoom={false} zoomControl>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <FitRouteBounds stop={stop} userLocation={userLocation} />
      <Polyline positions={[userPosition, stopPosition]} pathOptions={{ color: '#059669', weight: 5, opacity: 0.78, dashArray: '8 8' }} />
      <Marker position={userPosition}>
        <Popup>
          <p className="font-bold text-slate-950">Your current location</p>
        </Popup>
      </Marker>
      <Marker position={stopPosition}>
        <Popup>
          <div className="min-w-40">
            <p className="font-bold text-slate-950">{stop.name}</p>
            <p className="mt-1 text-sm text-emerald-700">Nearest selected stop</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
