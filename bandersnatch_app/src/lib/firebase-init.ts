import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Initialize Firestore with sample bus and alert data
 * This is meant for development/testing purposes only
 * Run this once to set up the initial data
 */
export async function initializeFirestoreData() {
  try {
    console.log("Starting Firestore initialization...");

    // Clear existing buses and alerts
    console.log("Clearing existing buses...");
    const busesSnapshot = await getDocs(collection(db, "buses"));
    for (const doc_ of busesSnapshot.docs) {
      await deleteDoc(doc(db, "buses", doc_.id));
    }

    console.log("Clearing existing alerts...");
    const alertsSnapshot = await getDocs(collection(db, "alerts"));
    for (const doc_ of alertsSnapshot.docs) {
      await deleteDoc(doc(db, "alerts", doc_.id));
    }

    // Add sample buses
    console.log("Adding sample buses...");
    await addDoc(collection(db, "buses"), {
      name: "Bus #1",
      id: "bus-1",
      isActive: true,
      status: "operational",
      lastUpdated: new Date(),
    });

    await addDoc(collection(db, "buses"), {
      name: "Bus #2",
      id: "bus-2",
      isActive: true,
      status: "operational",
      lastUpdated: new Date(),
    });

    // Add sample alerts
    console.log("Adding sample alerts...");
    // You can uncomment this to add a sample alert
    // await addDoc(collection(db, "alerts"), {
    //   busId: "bus-1",
    //   reason: "Broken door handle - front entrance",
    //   timestamp: new Date(),
    //   userId: "demo-user",
    //   status: "open",
    // });

    console.log("✅ Firestore initialization completed successfully!");
    console.log(
      "Buses: 2 active buses initialized (Bus #1, Bus #2)"
    );
    console.log("To add a test alert, uncomment the sample alert code in initializeFirestoreData()");

    return true;
  } catch (error) {
    console.error("❌ Error during Firestore initialization:", error);
    throw error;
  }
}
