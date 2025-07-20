import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const vehicleIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20,20)">
        <rect x="-12" y="-6" width="24" height="12" rx="3" fill="#2563EB" stroke="#ffffff" stroke-width="2"/>
        <rect x="-8" y="-4" width="16" height="8" rx="2" fill="#60A5FA"/>
        <circle cx="-8" cy="-8" r="2" fill="#1F2937"/>
        <circle cx="8" cy="-8" r="2" fill="#1F2937"/>
        <circle cx="-8" cy="8" r="2" fill="#1F2937"/>
        <circle cx="8" cy="8" r="2" fill="#1F2937"/>
        <polygon points="12,-2 16,0 12,2" fill="#EF4444"/>
      </g>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -16],
});

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  return null;
}

// Main VehicleMap component
export default function VehicleMap({ position, traveledPath, fullRoute }) {
  const mapRef = useRef(null);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[28.6139, 77.2090]} // Default to Delhi
        zoom={15}
        className="w-full h-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Full Route Path (gray) */}
        <Polyline
          positions={fullRoute}
          color="#94A3B8"
          weight={4}
          opacity={0.6}
          dashArray="10, 10"
        />

        {/* Traveled Path (blue) */}
        {traveledPath.length > 1 && (
          <Polyline
            positions={traveledPath}
            color="#3B82F6"
            weight={6}
            opacity={0.9}
          />
        )}

        {/* Vehicle Marker */}
        {position && (
          <Marker
            position={[position.lat, position.lng]}
            icon={vehicleIcon}
          />
        )}

        {/* Auto-follow vehicle */}
        <MapUpdater position={position} />
      </MapContainer>
    </div>
  );
}
