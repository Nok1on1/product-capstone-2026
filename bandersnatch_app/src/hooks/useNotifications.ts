"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from "react";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  getFirebaseMessaging,
  getNotificationVapidKey,
  registerMessagingServiceWorker,
} from "@/lib/firebase-init";

interface NotificationPreferences {
  alerts: boolean;
  reminders: boolean;
  promotions: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    alerts: true,
    reminders: false,
    promotions: false,
  });
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setSupported(true);
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid || !token) return;
    const ref = doc(db, "users", uid, "fcmTokens", token);
    setDoc(ref, {
      token,
      preferences,
      platform: "web",
      userAgent: navigator.userAgent,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }, [token, preferences]);

  const syncToken = useCallback(async () => {
    const messaging = await getFirebaseMessaging();
    const vapidKey = getNotificationVapidKey();
    if (!messaging || !vapidKey) return null;

    const serviceWorkerRegistration = await registerMessagingServiceWorker();
    const fcmToken = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });
    if (fcmToken) setToken(fcmToken);
    return fcmToken || null;
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return null;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        try {
          return await syncToken();
        } catch (error) {
          console.warn("FCM token registration failed", error);
          return null;
        }
      }
      return null;
    } catch {
      setPermission("default");
      return null;
    }
  }, [supported, syncToken]);

  useEffect(() => {
    if (!supported || permission !== "granted" || token) return;
    syncToken().catch((error) => {
      console.warn("FCM token sync failed", error);
    });
  }, [permission, supported, syncToken, token]);

  const unsubscribe = useCallback(async () => {
    if (!token) return;
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;
      await deleteToken(messaging);
      if (auth.currentUser) {
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "fcmTokens", token));
      }
      setToken(null);
    } catch {
      console.warn("Failed to unsubscribe from notifications");
    }
  }, [token]);

  const updatePreferences = useCallback(
    (updates: Partial<NotificationPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  useEffect(() => {
    if (permission !== "granted") return;
    let cleanup: (() => void) | undefined;

    getFirebaseMessaging().then((messaging) => {
      if (!messaging) return;
      cleanup = onMessage(messaging, (payload) => {
      if (payload.notification) {
        const title = payload.notification.title || "Bandersnatch";
        const body = payload.notification.body || "";
        new Notification(title, {
          body,
          icon: "/launcher_icon192.png",
          badge: "/launcher_icon192.png",
          data: payload.data,
        });
      }
      });
    });

    return () => cleanup?.();
  }, [permission]);

  return {
    permission,
    supported,
    token,
    preferences,
    requestPermission,
    unsubscribe,
    updatePreferences,
  };
}
