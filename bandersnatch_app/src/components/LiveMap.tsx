"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toStationStops, toCityCentreStops, BusStop } from "@/data/route3";
import { useTheme } from "@/components/ThemeProvider";
import { useUserLocation } from "@/hooks/useUserLocation";

import { LocationData } from "@/hooks/useUserLocation";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ─── Bus icons ───────────────────────────────────────────────────────────────
const busIconBlue = L.divIcon({
  html: `<div style="background-color:#2563eb;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;"><span class="material-symbols-outlined" style="font-size:18px;">directions_bus</span></div>`,
  className: "custom-bus-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const userLocationIcon = L.divIcon({
  html: `<div style="position:relative;width:0;height:0;">
    <div style="position:absolute;top:-8px;left:-8px;width:16px;height:16px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,0.5);z-index:1000;"></div>
    <div style="position:absolute;top:-20px;left:-20px;width:40px;height:40px;background:rgba(66,133,244,0.15);border-radius:50%;z-index:999;"></div>
  </div>`,
  className: "custom-user-location",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const busIconAmber = L.divIcon({
  html: `<div style="background-color:#d97706;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.3);border:2px solid white;"><span class="material-symbols-outlined" style="font-size:18px;">directions_bus</span></div>`,
  className: "custom-bus-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// ─── OSRM helper ─────────────────────────────────────────────────────────────
function buildOsrmCoords(stops: BusStop[]): string {
  return stops.map((s) => `${s.lng},${s.lat}`).join(";");
}

async function fetchRoadRoute(stops: BusStop[]): Promise<[number, number][]> {
  const coords = buildOsrmCoords(stops);
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&waypoints=0;${stops.length - 1}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  if (!data.routes?.length) throw new Error("No OSRM route");
  return (data.routes[0].geometry.coordinates as [number, number][]).map(
    ([lng, lat]) => [lat, lng],
  );
}

const stopIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background-color:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    className: "custom-stop-icon",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

interface OffsetPolylineProps {
  coords: [number, number][];
  color: string;
  offset: number;
  weight?: number;
  opacity?: number;
}

function OffsetPolyline({
  coords,
  color,
  offset,
  weight = 5,
  opacity = 0.8,
}: OffsetPolylineProps) {
  const map = useMap();
  const layerRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (coords.length < 2) return;

    import("leaflet-polylineoffset").then(() => {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const line = L.polyline(coords, {
        color,
        weight,
        opacity,
        offset,
      } as any).addTo(map);
      layerRef.current = line;
    });

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
    };
  }, [coords, color, offset, map]);

  return null;
}

// ─── Simulated bus – To Station (Blue) ───────────────────────────────────────
function SimulatedBusStation() {
  const [position, setPosition] = useState<[number, number]>([
    toStationStops[0].lat,
    toStationStops[0].lng,
  ]);
  const map = useMap();

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % toStationStops.length;
      setPosition([toStationStops[idx].lat, toStationStops[idx].lng]);
    }, 3000);
    return () => clearInterval(interval);
  }, [map]);

  return (
    <Marker position={position} icon={busIconBlue} zIndexOffset={1000}>
      <Popup className="font-sans">
        <div className="font-bold text-primary-container">Bus #3</div>
        <div className="text-sm">Heading to Rioni Station</div>
      </Popup>
    </Marker>
  );
}

function UserMarker({ location }: { location: LocationData | null }) {
  if (!location) return null;

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={userLocationIcon}
      zIndexOffset={2000}
    >
      <Popup className="font-sans">
        <div className="font-bold">Your Location</div>
        <div className="text-xs text-slate-500">
          Accuracy: ~{Math.round(location.accuracy)}m
        </div>
      </Popup>
    </Marker>
  );
}

// ─── Simulated bus – To City Centre (Amber) ──────────────────────────────────
function SimulatedBusCity() {
  const [position, setPosition] = useState<[number, number]>([
    toCityCentreStops[0].lat,
    toCityCentreStops[0].lng,
  ]);
  const map = useMap();

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % toCityCentreStops.length;
      setPosition([toCityCentreStops[idx].lat, toCityCentreStops[idx].lng]);
    }, 3000);
    return () => clearInterval(interval);
  }, [map]);

  return (
    <Marker position={position} icon={busIconAmber} zIndexOffset={1000}>
      <Popup className="font-sans">
        <div className="font-bold text-amber-600">Bus #3</div>
        <div className="text-sm">Heading to City Centre</div>
      </Popup>
    </Marker>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LiveMap() {
  const { resolvedTheme } = useTheme();
  const { location, startTracking } = useUserLocation();
  const mapRef = useRef<L.Map | null>(null);
  const hasCenteredRef = useRef(false);

  const [toStationRoute, setToStationRoute] = useState<[number, number][]>([]);
  const [toCityRoute, setToCityRoute] = useState<[number, number][]>([]);
  const [routeError, setRouteError] = useState(false);
  const [visibleRoute, setVisibleRoute] = useState<
    "none" | "station" | "city" | "both"
  >("none");

  useEffect(() => {
    startTracking();
    return () => {};
  }, [startTracking]);

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
        console.error(
          "OSRM routing failed, falling back to straight lines:",
          err,
        );
        if (!cancelled) {
          setRouteError(true);
          setToStationRoute(toStationStops.map((s) => [s.lat, s.lng]));
          setToCityRoute(toCityCentreStops.map((s) => [s.lat, s.lng]));
        }
      }
    }
    loadRoutes();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (location && mapRef.current && !hasCenteredRef.current) {
      mapRef.current.flyTo([location.lat, location.lng], 15, { duration: 1.2 });
      hasCenteredRef.current = true;
    }
  }, [location]);

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
        ref={(map) => {
          if (map) mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {(visibleRoute === "station" || visibleRoute === "both") && (
          <OffsetPolyline coords={toStationRoute} color="#2563eb" offset={-4} />
        )}
        {(visibleRoute === "city" || visibleRoute === "both") && (
          <OffsetPolyline coords={toCityRoute} color="#d97706" offset={4} />
        )}

        {toStationStops.map((stop) => (
          <Marker
            key={`station-${stop.id}`}
            position={[stop.lat, stop.lng]}
            icon={stopIcon("#2563eb")}
          >
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">
                To Station · Stop #{stop.id}
              </div>
            </Popup>
          </Marker>
        ))}

        {toCityCentreStops.map((stop) => (
          <Marker
            key={`city-${stop.id}`}
            position={[stop.lat, stop.lng]}
            icon={stopIcon("#d97706")}
          >
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">
                To City Centre · Stop #{stop.id}
              </div>
            </Popup>
          </Marker>
        ))}

        <UserMarker location={location} />
        <SimulatedBusStation />
        <SimulatedBusCity />
      </MapContainer>

      <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-slate-900 rounded-lg shadow-md p-3 border border-outline-variant dark:border-slate-800 max-w-[240px] transition-colors duration-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary-container dark:text-blue-400">
            route
          </span>
          <h2 className="font-bold text-on-surface dark:text-slate-100">
            Route #3
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Show Route
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md">
              <button
                onClick={() =>
                  setVisibleRoute((prev) => {
                    if (prev === "station") return "none";
                    if (prev === "both") return "city";
                    if (prev === "city") return "both";
                    return "station";
                  })
                }
                className={`text-[10px] py-1 rounded transition-all ${
                  visibleRoute === "station" || visibleRoute === "both"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                To Station
              </button>
              <button
                onClick={() =>
                  setVisibleRoute((prev) => {
                    if (prev === "city") return "none";
                    if (prev === "both") return "station";
                    if (prev === "station") return "both";
                    return "city";
                  })
                }
                className={`text-[10px] py-1 rounded transition-all ${
                  visibleRoute === "city" || visibleRoute === "both"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                To City
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 leading-tight">
                Blue: To Station (stops + route)
              </p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-600 shrink-0" />
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 leading-tight">
                Amber: To City Centre (stops + route)
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: 10 }}
                >
                  directions_bus
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 leading-tight">
                Blue bus: To Station
              </p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-amber-600 border border-white flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: 10 }}
                >
                  directions_bus
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 leading-tight">
                Amber bus: To City Centre
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm shrink-0" />
              <p className="text-[10px] text-on-surface-variant dark:text-slate-400 leading-tight">
                Your Location
              </p>
            </div>
          </div>
        </div>

        {routeError && (
          <p className="text-[10px] text-red-400 mt-2 leading-tight">
            Road routing unavailable — showing straight lines
          </p>
        )}
      </div>

      {location && (
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo([location.lat, location.lng], 15, {
                duration: 1,
              });
            }
          }}
          className="absolute bottom-4 right-4 z-[400] bg-white dark:bg-slate-900 rounded-full shadow-md p-2 border border-outline-variant dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-primary-container dark:text-blue-400 text-xl">
            my_location
          </span>
        </button>
      )}

      {!location && (
        <button
          onClick={startTracking}
          className="absolute bottom-4 right-4 z-[400] bg-white dark:bg-slate-900 rounded-full shadow-md p-2 border border-outline-variant dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-primary-container dark:text-blue-400 text-xl">
            my_location
          </span>
        </button>
      )}
    </div>
  );
}
