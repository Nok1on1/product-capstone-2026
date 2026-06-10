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
