"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useCallback } from "react";
import { getMessaging, getToken, deleteToken, onMessage } from "firebase/messaging";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
      createdAt: new Date().toISOString(),
    });
  }, [token, preferences]);

  const requestPermission = useCallback(async () => {
    if (!supported) return null;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        try {
          const messaging = getMessaging();
          const fcmToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
          });
          if (fcmToken) {
            setToken(fcmToken);
          }
          return fcmToken;
        } catch {
          console.warn("FCM token registration failed");
          return null;
        }
      }
      return null;
    } catch {
      setPermission("default");
      return null;
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    if (!token) return;
    try {
      const messaging = getMessaging();
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
    let messaging: ReturnType<typeof getMessaging> | null = null;
    try {
      messaging = getMessaging();
    } catch {
      return;
    }

    const unsubscribeMessage = onMessage(messaging, (payload) => {
      if (payload.notification) {
        const title = payload.notification.title || "Bandersnatch";
        const body = payload.notification.body || "";
        new Notification(title, { body });
      }
    });

    return () => unsubscribeMessage();
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
