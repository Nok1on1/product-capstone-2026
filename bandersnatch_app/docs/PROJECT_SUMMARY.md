# Project Structure Summary

This project is a Next.js web application (using the App Router) focused on public transit, specifically real-time bus tracking and route management. It utilizes Firebase for backend services (Auth/Firestore) and supports Internationalization (i18n).

## 📁 `src/app/`
Contains the core Next.js application routes, built with i18n support (`[lang]`).
*   `client-providers.tsx`: Wraps the app in client-side context providers (Theme, Auth, Bus tracking state).
*   `[lang]/account/`: User profile and settings dashboard.
*   `[lang]/admin/`: Administrative dashboard for managing routes or system features.
*   `[lang]/feedback/`: Page for users to submit feedback or reports.
*   `[lang]/find-ride/`: Search functionality for planning bus trips or finding nearby stops.
*   `[lang]/live-map/`: The main real-time map interface tracking active bus locations.
*   `[lang]/login/` & `[lang]/signup/` & `[lang]/verify-email/`: Firebase authentication flows.
*   `[lang]/onboarding/`: First-time user setup and tutorial.
*   `[lang]/ride-history/`: Displays past trips the user has taken.
*   `[lang]/routes/`: Directory of available bus routes.
*   `[lang]/trip-details/`: Detailed view of a specific journey, schedule, and stops.

## 📁 `src/components/`
Reusable React UI components.
*   **Navigation**: `TopNav.tsx`, `BottomNav.tsx` for mobile/web layout structure.
*   **Mapping**: `LiveMap.tsx`, `RouteMap.tsx` for rendering geographic data (likely using Leaflet).
*   **Transit Specific**: `OnBusBanner.tsx`, `OnBusButton.tsx`, `StopSelect.tsx` for crowd-sourced transit tracking or journey selection.
*   **UI/UX**: `AlertBanner.tsx`, `AnimatedIcon.tsx`, `Skeleton.tsx` (loading states), `ThemeProvider.tsx` (dark/light mode).

## 📁 `src/context/`
React Context for global state management.
*   `AuthContext.tsx`: Tracks the currently logged-in Firebase user.
*   `BusStateContext.tsx`: Manages the global state of the user's current transit trip (e.g., are they currently riding a bus?).

## 📁 `src/data/`
Static transit data.
*   `route3.ts`: Hardcoded transit data (stops, coordinates, path) for "Route 3".

## 📁 `src/hooks/`
Custom React hooks encapsulating business logic.
*   `useBusTracking.ts`: Logic to interact with live bus location streams.
*   `useDictionary.ts`: Helper for i18n translations.
*   `useEmailVerification.ts`: Handles the Firebase email verification polling/status.
*   `useNotifications.ts`: Manages push notifications or in-app alerts.
*   `useUserLocation.ts`: Interfaces with the browser Geolocation API to track the user.

## 📁 `src/i18n/`
*   `dictionaries.ts`: Configures localized strings for the multi-language setup.

## 📁 `src/lib/`
Utility modules and heavy-lifting helper functions.
*   `firebase.ts` & `firebase-init.ts`: Firebase application initialization and module exports.
*   `location-utils.ts`: Math and logic for geospatial calculations (e.g., getting distance between coordinates).
*   `timetable.ts`: Logic for parsing bus schedules and estimating arrivals.
*   `trust-utils.ts`: Algorithms for weighting crowd-sourced data reliability or user reputation.

## 📁 `src/types/`
*   `leaflet-plugins.d.ts`: Type definitions for Leaflet map plugins not typed natively.
*   `user.ts`: Interfaces defining the User data model.

## 📄 Root Config Files
*   `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`: Core framework and styling configurations.
*   `firestore.rules`: Security rules protecting Firebase databases.
*   `public/sw.js` & `public/manifest.json`: Indicates the app is a Progressive Web App (PWA).
