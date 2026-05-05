"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toStationStops, toCityCentreStops, BusStop } from "@/data/route3";
import { useTheme } from "next-themes";

// ─── Leaflet default icon fix ────────────────────────────────────────────────
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

// ─── Bus icon ────────────────────────────────────────────────────────────────
const busIcon = L.divIcon({
  html: `<div style="background-color:#2563eb;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;"><span class="material-symbols-outlined" style="font-size:18px;">directions_bus</span></div>`,
  className: "custom-bus-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// ─── OSRM helper ─────────────────────────────────────────────────────────────
function buildOsrmCoords(stops: BusStop[]): string {
  return stops.map((s) => `${s.lng},${s.lat}`).join(";");
}

async function fetchRoadRoute(stops: BusStop[]): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${buildOsrmCoords(stops)}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  if (!data.routes?.length) throw new Error("No OSRM route");
  return (data.routes[0].geometry.coordinates as [number, number][]).map(
    ([lng, lat]) => [lat, lng]
  );
}

// ─── Bearing between two [lat,lng] points (degrees, 0=North, clockwise) ──────
function bearing(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// ─── Arrow divIcon ────────────────────────────────────────────────────────────
function arrowIcon(deg: number, color: string): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      width:0;height:0;
      border-left:6px solid transparent;
      border-right:6px solid transparent;
      border-bottom:12px solid ${color};
      transform:rotate(${deg}deg);
      transform-origin:center center;
      opacity:0.9;
    "></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

// ─── OffsetPolyline – imperatively adds an offset polyline via the plugin ─────
interface OffsetPolylineProps {
  coords: [number, number][];
  color: string;
  offset: number;         // pixels; negative = left, positive = right
  weight?: number;
  opacity?: number;
}

function OffsetPolyline({ coords, color, offset, weight = 5, opacity = 0.8 }: OffsetPolylineProps) {
  const map = useMap();
  const layerRef = useRef<L.Polyline | null>(null);
  const arrowsRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (coords.length < 2) return;

    // Dynamically import the plugin so it patches L.Polyline once on the client
    import("leaflet-polylineoffset").then(() => {
      // Remove previous layer
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
      arrowsRef.current.forEach((m) => m.remove());
      arrowsRef.current = [];

      // Offset polyline – cast to any because `offset` is injected by the plugin
      // and is not present in the standard Leaflet PolylineOptions types.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const line = L.polyline(coords, { color, weight, opacity, offset } as any).addTo(map);
      layerRef.current = line;

      // Direction arrows – sample every ~20 points along the decoded geometry
      const step = Math.max(1, Math.floor(coords.length / 20));
      for (let i = 0; i + 1 < coords.length; i += step) {
        const a = coords[i];
        const b = coords[Math.min(i + 1, coords.length - 1)];
        const deg = bearing(a, b);
        const midLat = (a[0] + b[0]) / 2;
        const midLng = (a[1] + b[1]) / 2;
        const marker = L.marker([midLat, midLng], {
          icon: arrowIcon(deg, color),
          interactive: false,
          zIndexOffset: 500,
        }).addTo(map);
        arrowsRef.current.push(marker);
      }
    });

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
      arrowsRef.current.forEach((m) => m.remove());
      arrowsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, color, offset, map]);

  return null;
}

// ─── Simulated bus ────────────────────────────────────────────────────────────
function SimulatedBus() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [position, setPosition] = useState<[number, number]>([
    toStationStops[0].lat,
    toStationStops[0].lng,
  ]);
  const map = useMap();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => {
        const next = (prev + 1) % toStationStops.length;
        setPosition([toStationStops[next].lat, toStationStops[next].lng]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [map]);

  return (
    <Marker position={position} icon={busIcon} zIndexOffset={1000}>
      <Popup className="font-sans">
        <div className="font-bold text-primary-container">Bus #3</div>
        <div className="text-sm">Heading to Rioni Station</div>
      </Popup>
    </Marker>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LiveMap() {
  const { resolvedTheme } = useTheme();

  const [toStationRoute, setToStationRoute] = useState<[number, number][]>([]);
  const [toCityRoute, setToCityRoute] = useState<[number, number][]>([]);
  const [routeError, setRouteError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadRoutes() {
      try {
        const [stationCoords, cityCoords] = await Promise.all([
          fetchRoadRoute(toStationStops),
          fetchRoadRoute(toCityCentreStops),
        ]);
        if (!cancelled) {
          setToStationRoute(stationCoords);
          setToCityRoute(cityCoords);
        }
      } catch (err) {
        console.error("OSRM routing failed, falling back to straight lines:", err);
        if (!cancelled) {
          setRouteError(true);
          setToStationRoute(toStationStops.map((s) => [s.lat, s.lng]));
          setToCityRoute(toCityCentreStops.map((s) => [s.lat, s.lng]));
        }
      }
    }
    loadRoutes();
    return () => { cancelled = true; };
  }, []);

  const bounds: L.LatLngBoundsExpression = [
    [42.18, 42.695],
    [42.28, 42.73],
  ];
  const center: [number, number] = [42.235, 42.711];

  const tileUrl =
    resolvedTheme === "dark"
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

        {/* Offset polylines with directional arrows */}
        <OffsetPolyline coords={toStationRoute} color="#2563eb" offset={-4} />
        <OffsetPolyline coords={toCityRoute}    color="#d97706" offset={4}  />

        {/* Stop markers – To Station */}
        {toStationStops.map((stop) => (
          <Marker key={`station-${stop.id}`} position={[stop.lat, stop.lng]}>
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">To Station · Stop #{stop.id}</div>
            </Popup>
          </Marker>
        ))}

        {/* Stop markers – To City Centre */}
        {toCityCentreStops.map((stop) => (
          <Marker key={`city-${stop.id}`} position={[stop.lat, stop.lng]}>
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">To City Centre · Stop #{stop.id}</div>
            </Popup>
          </Marker>
        ))}

        <SimulatedBus />
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-slate-900 rounded-lg shadow-md p-3 border border-outline-variant dark:border-slate-800 max-w-[220px] transition-colors duration-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary-container dark:text-blue-400">route</span>
          <h2 className="font-bold text-on-surface dark:text-slate-100">Route #3</h2>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-600 shrink-0" />
          <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-tight">
            To Station: Colchis Fountain → Rioni
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-600 shrink-0" />
          <p className="text-xs text-on-surface-variant dark:text-slate-400 leading-tight">
            To City: Railway Station → Colchis
          </p>
        </div>
        {routeError && (
          <p className="text-xs text-red-400 mt-2 leading-tight">
            Road routing unavailable — showing straight lines
          </p>
        )}
      </div>
    </div>
  );
}
