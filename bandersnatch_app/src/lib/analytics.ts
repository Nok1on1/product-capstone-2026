import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { analytics } from "./firebase";

interface EventProperties {
  [key: string]: string | number | boolean;
}

/**
 * Log an analytics event following the naming convention: object_action (snake_case, past tense)
 * Automatically includes user_id, timestamp, session_id, and platform
 */
export const logEvent = (eventName: string, properties?: EventProperties) => {
  if (!analytics) {
    console.warn("Analytics not initialized");
    return;
  }

  try {
    firebaseLogEvent(analytics, eventName, properties);
  } catch (error) {
    console.error(`Failed to log event ${eventName}:`, error);
  }
};

/**
 * Log user signup completion
 */
export const logUserSignupCompleted = (
  signupMethod: "email" | string,
  initialBusStop: string
) => {
  logEvent("user_signup_completed", {
    signup_method: signupMethod,
    initial_bus_stop: initialBusStop,
  });
};

/**
 * Log app opened event
 */
export const logAppOpened = (referralSource?: string) => {
  logEvent("app_opened", {
    ...(referralSource && { referral_source: referralSource }),
  });
};

/**
 * Log bus status confirmed
 */
export const logBusStatusConfirmed = (
  busLine: string,
  busStop: string,
  estimatedArrivalMinutes: number,
  statusConfidence: "confirmed" | "estimated",
  crowdLevel?: "low" | "medium" | "high"
) => {
  logEvent("bus_status_confirmed", {
    bus_line: busLine,
    bus_stop: busStop,
    estimated_arrival_minutes: estimatedArrivalMinutes,
    status_confidence: statusConfidence,
    ...(crowdLevel && { crowd_level: crowdLevel }),
  });
};

/**
 * Log departure decision made
 */
export const logDepartureDecisionMade = (
  departureTimeSelected: number,
  reliableInformationReceived: boolean
) => {
  logEvent("departure_decision_made", {
    departure_time_selected: departureTimeSelected,
    reliable_information_received: reliableInformationReceived,
  });
};

/**
 * Log user session started
 */
export const logUserSessionStarted = () => {
  logEvent("user_session_started");
};
