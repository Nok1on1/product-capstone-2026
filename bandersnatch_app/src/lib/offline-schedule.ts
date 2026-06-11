"use client";

import { putSnapshot } from "@/lib/offline-db";
import { BUS_OPERATING_HOURS, STOP_TRAVEL_MINUTES } from "@/lib/timetable";
import { toCityCentreStops, toStationStops } from "@/data/route3";

export async function seedScheduleSnapshot() {
  await putSnapshot("schedule", {
    operatingHours: BUS_OPERATING_HOURS,
    stopTravelMinutes: STOP_TRAVEL_MINUTES,
    routes: {
      station: toStationStops,
      city: toCityCentreStops,
    },
  });
}
