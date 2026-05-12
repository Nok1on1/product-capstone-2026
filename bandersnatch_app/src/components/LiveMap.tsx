"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toStationStops, toCityCentreStops, BusStop } from "@/data/route3";
import { useTheme } from "@/components/ThemeProvider";
import { useUserLocation } from "@/hooks/useUserLocation";
import {
  collection,
  query,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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

function busSvg(color: string, label: string): string {
  return `<div class="animated-bus-marker" style="position:relative;width:0;height:0;">
    <svg width="40" height="40" viewBox="0 0 40 40" style="position:absolute;top:-20px;left:-20px;">
      <defs>
        <filter id="shadow_${color.replace('#','')}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect x="6" y="8" width="28" height="20" rx="4" ry="4" fill="${color}"
        filter="url(#shadow_${color.replace('#','')})" stroke="white" stroke-width="1.5"/>
      <rect x="10" y="11" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="17" y="11" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="24" y="11" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="10" y="18" width="5" height="4" rx="1" fill="white" opacity="0.6"/>
      <rect x="17" y="18" width="5" height="4" rx="1" fill="white" opacity="0.6"/>
      <rect x="24" y="18" width="5" height="4" rx="1" fill="white" opacity="0.6"/>
      <circle cx="12" cy="30" r="3.5" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="28" cy="30" r="3.5" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="28" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <polygon points="34,18 38,20 34,22" fill="${color}" stroke="white" stroke-width="0.8"/>
    </svg>
    <div style="position:absolute;top:18px;left:-14px;background:${color};color:white;font-size:8px;font-weight:700;font-family:sans-serif;padding:0 4px;border-radius:3px;white-space:nowrap;border:1px solid rgba(255,255,255,0.5);">${label}</div>
  </div>`;
}

const busIconBlue = L.divIcon({
  html: busSvg("#2563eb", "To Stn"),
  className: "custom-bus-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const busIconAmber = L.divIcon({
  html: busSvg("#d97706", "To Ctr"),
  className: "custom-bus-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const userLocationIcon = (heading: number | null, accuracy: number) => {
  const headingArrow = heading !== null
    ? `<div style="position:absolute;top:-28px;left:-6px;width:12px;height:12px;transform:rotate(${heading}deg);z-index:1001;">
        <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,12 6,9 0,12" fill="#4285F4"/></svg>
      </div>`
    : "";
  const accuracySize = Math.max(accuracy, 10);
  return L.divIcon({
    html: `<div style="position:relative;width:0;height:0;">
      <div class="pulse-ring" style="position:absolute;top:-${accuracySize}px;left:-${accuracySize}px;width:${accuracySize*2}px;height:${accuracySize*2}px;background:rgba(66,133,244,0.1);border-radius:50%;z-index:999;"></div>
      ${headingArrow}
      <div style="position:absolute;top:-10px;left:-10px;width:20px;height:20px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(66,133,244,0.5);z-index:1000;"></div>
    </div>`,
    className: "custom-user-location",
    iconSize: [accuracySize * 2, accuracySize * 2],
    iconAnchor: [accuracySize, accuracySize],
  });
};

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

const stopIcon = (color: string, isTerminal: boolean = false) => {
  if (isTerminal) {
    return L.divIcon({
      html: `<div style="background-color:${color};width:16px;height:16px;border-radius:4px;transform:rotate(45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
        <div style="background:white;width:6px;height:6px;border-radius:1px;transform:rotate(0deg);"></div>
      </div>`,
      className: "custom-stop-icon",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }
  return L.divIcon({
    html: `<div style="background-color:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    className: "custom-stop-icon",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

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
    let startTime = performance.now();
    let startPos = position;
    let targetPos: [number, number] = [
      toStationStops[1].lat,
      toStationStops[1].lng,
    ];
    const duration = 2800;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let rafId: number;
    function animate() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      const newPos: [number, number] = [
        lerp(startPos[0], targetPos[0], eased),
        lerp(startPos[1], targetPos[1], eased),
      ];
      setPosition(newPos);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        idx = (idx + 1) % toStationStops.length;
        startPos = targetPos;
        targetPos = [
          toStationStops[(idx + 1) % toStationStops.length].lat,
          toStationStops[(idx + 1) % toStationStops.length].lng,
        ];
        startTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
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
      icon={userLocationIcon(location.heading, location.accuracy)}
      zIndexOffset={2000}
    >
      <Popup className="font-sans">
        <div className="font-bold">Your Location</div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Accuracy: ~{Math.round(location.accuracy)}m</span>
          {location.heading !== null && (
            <span>Heading: {Math.round(location.heading)}°</span>
          )}
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
    let startTime = performance.now();
    let startPos = position;
    let targetPos: [number, number] = [
      toCityCentreStops[1].lat,
      toCityCentreStops[1].lng,
    ];
    const duration = 2800;

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let rafId: number;
    function animate() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      const newPos: [number, number] = [
        lerp(startPos[0], targetPos[0], eased),
        lerp(startPos[1], targetPos[1], eased),
      ];
      setPosition(newPos);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        idx = (idx + 1) % toCityCentreStops.length;
        startPos = targetPos;
        targetPos = [
          toCityCentreStops[(idx + 1) % toCityCentreStops.length].lat,
          toCityCentreStops[(idx + 1) % toCityCentreStops.length].lng,
        ];
        startTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
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

interface PeerData {
  id: string;
  lat: number;
  lng: number;
  heading: number | null;
  accuracy: number;
  direction: string | null;
  displayName: string;
  timestamp: Timestamp | null;
}

const peerIconWithHeading = (heading: number | null) => {
  const arrow = heading !== null
    ? `<div style="position:absolute;top:-22px;left:-5px;width:10px;height:10px;transform:rotate(${heading}deg);">
        <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 10,10 5,7.5 0,10" fill="#22c55e"/></svg>
       </div>`
    : "";
  return L.divIcon({
    html: `<div style="position:relative;width:0;height:0;">
      ${arrow}
      <div style="position:absolute;top:-8px;left:-8px;width:16px;height:16px;background:#22c55e;border:2px solid white;border-radius:50%;box-shadow:0 0 6px rgba(34,197,94,0.5);z-index:1000;"></div>
    </div>`,
    className: "custom-peer-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

function PeersLayer({ onPeerCountChange }: { onPeerCountChange: (count: number) => void }) {
  const map = useMap();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const peerDataRef = useRef<PeerData[]>([]);

  useEffect(() => {
    const q = query(collection(db, "peer_locations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const staleThreshold = 60000;
      const activePeers: PeerData[] = [];
      const currentIds = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const peerTimestamp = data.timestamp?.toMillis?.() || now;
        if (now - peerTimestamp > staleThreshold) return;
        if (data.uid === doc.id) return;
        currentIds.add(doc.id);
        activePeers.push({
          id: doc.id,
          lat: data.lat,
          lng: data.lng,
          heading: data.heading || null,
          accuracy: data.accuracy || 0,
          direction: data.direction || null,
          displayName: data.displayName || "Student",
          timestamp: data.timestamp || null,
        });
      });

      for (const [id, marker] of markersRef.current) {
        if (!currentIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);
        }
      }

      for (const peer of activePeers) {
        const existing = markersRef.current.get(peer.id);
        const pos = L.latLng(peer.lat, peer.lng);
        if (existing) {
          existing.setLatLng(pos);
          existing.setIcon(peerIconWithHeading(peer.heading));
        } else {
          const marker = L.marker(pos, {
            icon: peerIconWithHeading(peer.heading),
            zIndexOffset: 1500,
          })
            .addTo(map)
            .bindPopup(
              `<div class="font-sans"><div class="font-bold">${peer.displayName}</div><div class="text-xs text-slate-500">Sharing location</div></div>`
            );
          markersRef.current.set(peer.id, marker);
        }
      }

      peerDataRef.current = activePeers;
      onPeerCountChange(activePeers.length);
    });

    return () => {
      unsubscribe();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, [map, onPeerCountChange]);

  return null;
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
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [peerCount, setPeerCount] = useState(0);

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

        {toStationStops.map((stop, index) => (
          <Marker
            key={`station-${stop.id}`}
            position={[stop.lat, stop.lng]}
            icon={stopIcon("#2563eb", index === 0 || index === toStationStops.length - 1)}
          >
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">
                To Station · Stop #{stop.id}
                {index === 0 && " (Departure)"}
                {index === toStationStops.length - 1 && " (Terminus)"}
              </div>
            </Popup>
          </Marker>
        ))}

        {toCityCentreStops.map((stop, index) => (
          <Marker
            key={`city-${stop.id}`}
            position={[stop.lat, stop.lng]}
            icon={stopIcon("#d97706", index === 0 || index === toCityCentreStops.length - 1)}
          >
            <Popup className="font-sans">
              <div className="font-bold">{stop.name}</div>
              <div className="text-xs text-slate-500">
                To City Centre · Stop #{stop.id}
                {index === 0 && " (Departure)"}
                {index === toCityCentreStops.length - 1 && " (Terminus)"}
              </div>
            </Popup>
          </Marker>
        ))}

        <UserMarker location={location} />
        <PeersLayer onPeerCountChange={setPeerCount} />
        <SimulatedBusStation />
        <SimulatedBusCity />
      </MapContainer>

      <div className="absolute top-4 left-4 z-[400] bg-white dark:bg-slate-900 rounded-lg shadow-md border border-outline-variant dark:border-slate-800 max-w-[220px] transition-colors duration-200">
        <button
          onClick={() => setLegendCollapsed(!legendCollapsed)}
          className="w-full flex items-center justify-between gap-2 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container dark:text-blue-400 text-lg">
              route
            </span>
            <h2 className="font-bold text-sm text-on-surface dark:text-slate-100">
              Route #3
            </h2>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-lg transition-transform duration-200"
            style={{ transform: legendCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>
            expand_more
          </span>
        </button>

        {!legendCollapsed && (
          <div className="px-2.5 pb-2.5 space-y-2.5">
            <div className="flex flex-col gap-1.5">
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

            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <p className="text-[10px] text-on-surface-variant dark:text-slate-400">To Station route</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                <p className="text-[10px] text-on-surface-variant dark:text-slate-400">To City route</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-3 h-3 shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect x="1" y="2" width="8" height="6" rx="1" fill="#2563eb"/>
                    <circle cx="3" cy="8.5" r="1.5" fill="#2563eb"/>
                    <circle cx="7" cy="8.5" r="1.5" fill="#2563eb"/>
                  </svg>
                </div>
                <p className="text-[10px] text-on-surface-variant dark:text-slate-400">Blue bus: To Station</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-3 h-3 shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <rect x="1" y="2" width="8" height="6" rx="1" fill="#d97706"/>
                    <circle cx="3" cy="8.5" r="1.5" fill="#d97706"/>
                    <circle cx="7" cy="8.5" r="1.5" fill="#d97706"/>
                  </svg>
                </div>
                <p className="text-[10px] text-on-surface-variant dark:text-slate-400">Amber bus: To City</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white shadow-sm shrink-0" />
                <p className="text-[10px] text-on-surface-variant dark:text-slate-400">Your Location</p>
              </div>
              {peerCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white shadow-sm shrink-0" />
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-400">
                    {peerCount} {peerCount === 1 ? "peer" : "peers"} sharing
                  </p>
                </div>
              )}
            </div>

            {routeError && (
              <p className="text-[10px] text-red-400 leading-tight">
                Road routing unavailable — showing straight lines
              </p>
            )}
          </div>
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
