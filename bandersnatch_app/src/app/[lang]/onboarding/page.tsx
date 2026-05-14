"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, use, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { StopSelect } from "@/components/StopSelect";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { useUserLocation } from "@/hooks/useUserLocation";

const steps = [
  "welcome",
  "location",
  "stop",
  "features",
  "notifications",
  "complete",
] as const;

export default function OnboardingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).onboarding;
  const router = useRouter();
  const { profile, updateProfile, user, loading: authLoading } = useAuth();
  const { location, error: locationError, isTracking, startTracking } = useUserLocation();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedStop, setSelectedStop] = useState("10");
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [ready, setReady] = useState(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (authLoading || redirectedRef.current) return;
    const alreadyDone = user
      ? profile?.onboardingCompleted
      : localStorage.getItem("bandersnatch_onboarding_done") === "true";
    if (alreadyDone) {
      redirectedRef.current = true;
      router.replace(`/${lang}`);
    } else {
      setReady(true);
    }
  }, [user, profile, authLoading, lang, router]);

  useEffect(() => {
    if (profile?.defaultStop) {
      setSelectedStop(profile.defaultStop);
    }
  }, [profile]);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = useCallback(() => {
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleComplete = useCallback(async () => {
    if (user) {
      await updateProfile({
        defaultStop: selectedStop,
        onboardingCompleted: true,
      });
    } else {
      localStorage.setItem("bandersnatch_onboarding_done", "true");
      localStorage.setItem("bandersnatch_default_stop", selectedStop);
    }
    router.push(`/${lang}`);
  }, [user, updateProfile, selectedStop, router, lang]);

  const requestLocation = useCallback(() => {
    startTracking();
  }, [startTracking]);

  const requestNotifications = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        setNotificationGranted(true);
      }
    } else if ("Notification" in window && Notification.permission === "granted") {
      setNotificationGranted(true);
    }
    handleNext();
  }, [handleNext]);

  if (!ready) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary-container/20 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary-container dark:text-blue-400">
                directions_bus
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-on-surface dark:text-slate-100 tracking-tight mb-2">
                {dict.title}
              </h1>
              <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {dict.subtitle}
              </p>
            </div>
          </div>
        );

      case "location":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                my_location
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">
                {dict.locationPermission}
              </h2>
              <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {dict.locationPermissionDesc}
              </p>
            </div>
            {isTracking && !location && !locationError && (
              <div className="bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 text-sm font-medium py-2 px-4 rounded-lg animate-pulse">
                {dict.locationRequesting}
              </div>
            )}
            {location && (
              <div className="bg-success-container dark:bg-green-900/30 text-success dark:text-green-400 text-sm font-medium py-2 px-4 rounded-lg">
                {dict.locationGranted}
              </div>
            )}
            {locationError && (
              <div className="bg-error-container dark:bg-red-900/30 text-error dark:text-red-400 text-sm font-medium py-2 px-4 rounded-lg">
                {dict.locationDenied}
              </div>
            )}
          </div>
        );

      case "stop":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-amber-600 dark:text-amber-400">
                  signpost
                </span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mt-4 mb-2">
                {dict.step3Title}
              </h2>
              <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {dict.step3Desc}
              </p>
            </div>
            <div className="relative z-20">
              <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">
                Primary Stop
              </label>
              <StopSelect value={selectedStop} onChange={setSelectedStop} />
            </div>
          </div>
        );

      case "features":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-purple-600 dark:text-purple-400">
                  travel_explore
                </span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mt-4 mb-2">
                {dict.step1Title}
              </h2>
              <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed mb-6">
                {dict.step1Desc}
              </p>
            </div>
            <div className="grid gap-3">
              {[
                { icon: "map", text: "Live map with real-time bus position" },
                { icon: "groups", text: "See other students sharing their location" },
                { icon: "feedback", text: "Report crowding to help others" },
                { icon: "verified", text: "Earn trust points and badges" },
              ].map((feature) => (
                <div
                  key={feature.icon}
                  className="flex items-center gap-3 bg-surface-container dark:bg-slate-800 rounded-lg p-3"
                >
                  <span className="material-symbols-outlined text-primary-container dark:text-blue-400 text-xl">
                    {feature.icon}
                  </span>
                  <span className="text-sm text-on-surface dark:text-slate-200">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-rose-600 dark:text-rose-400">
                notifications
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">
                {dict.notificationPermission}
              </h2>
              <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {dict.notificationPermissionDesc}
              </p>
            </div>
            {notificationGranted && (
              <div className="bg-success-container dark:bg-green-900/30 text-success dark:text-green-400 text-sm font-medium py-2 px-4 rounded-lg">
                {dict.notificationsGranted}
              </div>
            )}
            {"Notification" in window && Notification.permission === "denied" && (
              <div className="bg-error-container dark:bg-red-900/30 text-error dark:text-red-400 text-sm font-medium py-2 px-4 rounded-lg">
                {dict.notificationsDenied}
              </div>
            )}
          </div>
        );

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-4xl text-white">
                celebration
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-on-surface dark:text-slate-100 tracking-tight mb-2">
                {dict.step5Title}
              </h1>
              <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {dict.step5Desc}
              </p>
            </div>
          </div>
        );
    }
  };

  const renderAction = () => {
    const showBack = currentStepIndex > 0;

    const actions = () => {
      switch (currentStep) {
        case "welcome":
          return (
            <button
              onClick={handleNext}
              className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg shadow-sm"
            >
              {dict.getStarted}
            </button>
          );

        case "location":
          return (
            <div className="flex flex-col gap-3">
              <button
                onClick={requestLocation}
                className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg shadow-sm"
              >
                {dict.allowLocation}
              </button>
              <button
                onClick={handleNext}
                className="w-full border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-3 rounded-lg"
              >
                {dict.next}
              </button>
            </div>
          );

        case "stop":
          return (
            <button
              onClick={handleNext}
              className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg shadow-sm"
            >
              {dict.next}
            </button>
          );

        case "features":
          return (
            <button
              onClick={handleNext}
              className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg shadow-sm"
            >
              {dict.next}
            </button>
          );

        case "notifications":
          return (
            <div className="flex flex-col gap-3">
              <button
                onClick={requestNotifications}
                className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg shadow-sm"
              >
                {dict.allowNotifications}
              </button>
              <button
                onClick={handleNext}
                className="w-full border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-3 rounded-lg"
              >
                {dict.skip}
              </button>
            </div>
          );

        case "complete":
          return (
            <button
              onClick={handleComplete}
              className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-lg py-3 rounded-lg shadow-sm"
            >
              {dict.completeSetup}
            </button>
          );
      }
    };

    return (
      <div className="space-y-2">
        {actions()}
        {showBack && (
          <button
            onClick={handleBack}
            className="w-full border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-3 rounded-lg"
          >
            {dict.back}
          </button>
        )}
      </div>
    );
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push(`/${lang}`)}
              className="text-sm text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 transition-colors"
            >
              {dict.skip}
            </button>
            <span className="text-xs text-on-surface-variant dark:text-slate-400 font-medium">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-visible shadow-sm transition-colors duration-200 min-h-[360px] flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-container dark:bg-blue-500 rounded-t-xl"></div>
            <div className="pt-2">{renderStep()}</div>
            <div className="mt-8 space-y-2">{renderAction()}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
