"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { route3Stops } from "@/data/route3";

// Fix default marker icon issue in Leaflet with Webpack/Next
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom bus icon
const busIconHtml = `
  <div style="background-color: #2563eb; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid white;">
    <span class="material-symbols-outlined" style="font-size: 18px;">directions_bus</span>
  </div>
`;
const busIcon = L.divIcon({
  html: busIconHtml,
  className: "custom-bus-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// A component to smoothly move the bus along the route
function SimulatedBus() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [position, setPosition] = useState<[number, number]>([route3Stops[0].lat, route3Stops[0].lng]);
  const map = useMap();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => {
        const nextIdx = (prev + 1) % route3Stops.length;
        setPosition([route3Stops[nextIdx].lat, route3Stops[nextIdx].lng]);
        
        // Optionally pan map to follow bus
        // map.panTo([route3Stops[nextIdx].lat, route3Stops[nextIdx].lng], { animate: true, duration: 1 });
        
        return nextIdx;
      });
    }, 3000); // Move to next stop every 3 seconds for demonstration
    return () => clearInterval(interval);
  }, [map]);

  return (
    <Marker position={position} icon={busIcon} zIndexOffset={1000}>
      <Popup className="font-sans">
        <div className="font-bold text-primary-container">Bus #3</div>
        <div className="text-sm">Heading to Rioni</div>
      </Popup>
    </Marker>
  );
}

import { useTheme } from "next-themes";

export default function LiveMap() {
  const { resolvedTheme } = useTheme();
  
  // Bounding box for Kutaisi/Rioni
  const bounds: L.LatLngBoundsExpression = [
    [42.15, 42.60], // South-West
    [42.30, 42.75], // North-East
  ];

  const positions: [number, number][] = route3Stops.map(stop => [stop.lat, stop.lng]);
  const center: [number, number] = [42.24, 42.68]; // Roughly middle of the route

  const tileUrl = resolvedTheme === "dark" 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-[calc(100vh-136px)] w-full"
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        
        <Polyline positions={positions} color="#2563eb" weight={5} opacity={0.7} />
        
        {route3Stops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]}>
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">Stop #{stop.id}</div>
            </Popup>
          </Marker>
        ))}

        <SimulatedBus />
      </MapContainer>
      
      {/* Route Info Overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-slate-900 rounded-lg shadow-md p-3 border border-outline-variant dark:border-slate-800 max-w-[200px] transition-colors duration-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary-container dark:text-blue-400">route</span>
          <h2 className="font-bold text-on-surface dark:text-slate-100">Route #3</h2>
        </div>
        <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-tight">Phaliashvili St. ➔ Rioni Station</p>
      </div>
    </div>
  );
}
