const APP_CACHE = "bandersnatch-app-v2";
const TILE_CACHE = "bandersnatch-tiles-v2";
const MAX_TILES = 500;

const APP_SHELL = [
  "/",
  "/en",
  "/manifest.json",
  "/launcher_icon192.png",
  "/launcher_icon512.png",
  "/offline.html",
  "/offline-runner.css",
  "/offline-runner.js",
];

const TILE_SERVERS = [
  "tile.openstreetmap.org",
  "basemaps.cartocdn.com",
  "tile.thunderforest.com",
  "a.tile.openstreetmap.org",
  "b.tile.openstreetmap.org",
  "c.tile.openstreetmap.org",
  "tiles.stadiamaps.com",
];

function isTileRequest(url) {
  try {
    const parsed = new URL(url);
    return TILE_SERVERS.some((server) => parsed.hostname.includes(server));
  } catch {
    return false;
  }
}

function isAppAsset(request) {
  const url = new URL(request.url);
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/static/") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".ico") ||
      url.pathname.endsWith(".webmanifest"))
  );
}

async function evictOldTiles(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  await Promise.all(keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key)));
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    await cache.put(request, response.clone());
    if (cacheName === TILE_CACHE) {
      void evictOldTiles(cache, MAX_TILES);
    }
  }
  return response;
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || cache.match("/offline.html");
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) =>
        cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: "reload" })))
      )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => ![APP_CACHE, TILE_CACHE].includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (isTileRequest(request.url)) {
    event.respondWith(cacheFirst(request, TILE_CACHE));
    return;
  }

  if (isAppAsset(request)) {
    event.respondWith(cacheFirst(request, APP_CACHE));
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag !== "bandersnatch-report-sync") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => client.postMessage({ type: "SYNC_REPORTS" }));
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {
      notification: {
        title: "Bandersnatch",
        body: event.data?.text() || "You have a new bus update.",
      },
    };
  }

  const notification = payload.notification || {};
  const data = payload.data || {};
  const title = notification.title || data.title || "Bandersnatch";
  const options = {
    body: notification.body || data.body || "You have a new bus update.",
    icon: notification.icon || "/launcher_icon192.png",
    badge: "/launcher_icon192.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",
      ...data,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })
  );
});
