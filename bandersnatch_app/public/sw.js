const STATIC_CACHE = "bandersnatch-v1";
const TILE_CACHE = "bandersnatch-tiles-v1";
const MAX_TILES = 500;

const urlsToCache = ["/"];

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
    const u = new URL(url);
    return TILE_SERVERS.some((s) => u.hostname.includes(s));
  } catch {
    return false;
  }
}

async function evictOldTiles(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    const excess = keys.length - maxItems;
    const toDelete = keys.slice(0, excess);
    await Promise.all(toDelete.map((r) => cache.delete(r)));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== STATIC_CACHE && name !== TILE_CACHE
          )
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (isTileRequest(event.request.url)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        try {
          const fetchResponse = await fetch(event.request);
          if (fetchResponse && fetchResponse.status === 200) {
            const clonedResponse = fetchResponse.clone();
            cache.put(event.request, clonedResponse).then(() =>
              evictOldTiles(cache, MAX_TILES)
            );
          }
          return fetchResponse;
        } catch {
          return new Response("", { status: 503, statusText: "Offline" });
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== "basic") return res;
        const responseToCache = res.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return res;
      }).catch(() => {
        return caches.match(event.request);
      });
    })
  );
});

self.addEventListener("push", (event) => {
  let data;
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Bandersnatch", body: event.data?.text() || "Bus update" };
  }

  const title = data.title || "Bandersnatch";
  const options = {
    body: data.body || "You have a new bus update.",
    icon: "/launcher_icon192.png",
    badge: "/launcher_icon192.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",
      ...data.data,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
