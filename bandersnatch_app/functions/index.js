const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

async function collectTokensForUsers(userDocs) {
  const tokenRefs = [];
  for (const userDoc of userDocs) {
    tokenRefs.push(db.collection("users").doc(userDoc.id).collection("fcmTokens").get());
  }

  const tokenSnapshots = await Promise.all(tokenRefs);
  return tokenSnapshots
    .flatMap((snapshot) => snapshot.docs.map((doc) => doc.id))
    .filter(Boolean);
}

async function sendToTokens(tokens, payload) {
  if (!tokens.length) return;

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: payload.notification,
    data: payload.data,
    webpush: {
      fcmOptions: {
        link: payload.data.url || "/",
      },
    },
  });

  const staleDeletes = [];
  response.responses.forEach((result, index) => {
    const code = result.error?.code;
    if (
      code === "messaging/registration-token-not-registered" ||
      code === "messaging/invalid-registration-token"
    ) {
      staleDeletes.push(
        db.collectionGroup("fcmTokens")
          .where("token", "==", tokens[index])
          .get()
          .then((snapshot) => Promise.all(snapshot.docs.map((doc) => doc.ref.delete())))
      );
    }
  });

  await Promise.all(staleDeletes);
}

exports.notifyBusReport = onDocumentCreated("bus_reports/{reportId}", async (event) => {
  const report = event.data?.data();
  if (!report) return;

  const stopId = report.stopId == null ? null : String(report.stopId);
  let usersQuery = db.collection("users");
  if (stopId) {
    usersQuery = usersQuery.where("defaultStop", "==", stopId);
  }

  const usersSnapshot = await usersQuery.limit(250).get();
  const recipients = usersSnapshot.docs.filter((doc) => doc.id !== report.userId);
  const tokens = await collectTokensForUsers(recipients);

  if (report.type === "bus_is_here") {
    await sendToTokens(tokens, {
      notification: {
        title: "Bus confirmed nearby",
        body: report.stopName
          ? `Bus #3 was just confirmed at ${report.stopName}.`
          : "Bus #3 was just confirmed at your stop.",
      },
      data: {
        kind: "bus_confirmed",
        stopId: stopId || "",
        direction: report.direction || "",
        url: "/",
      },
    });
  }

  if (report.type === "crowding_report" && report.level === "High") {
    await sendToTokens(tokens, {
      notification: {
        title: "Crowding alert",
        body: report.stopName
          ? `Bus #3 is reported full near ${report.stopName}.`
          : "Bus #3 is reported full.",
      },
      data: {
        kind: "crowding_alert",
        stopId: stopId || "",
        direction: report.direction || "",
        url: "/",
      },
    });
  }
});

exports.notifyRideGroupInvite = onDocumentCreated(
  "rideGroups/{groupId}/members/{memberId}",
  async (event) => {
    const member = event.data?.data();
    if (!member) return;

    const { groupId, memberId } = event.params;
    const membersSnapshot = await db
      .collection("rideGroups")
      .doc(groupId)
      .collection("members")
      .get();
    const recipients = membersSnapshot.docs.filter((doc) => doc.id !== memberId);
    const userRefs = recipients.map((doc) => db.collection("users").doc(doc.id).get());
    const userDocs = (await Promise.all(userRefs)).filter((doc) => doc.exists);
    const tokens = await collectTokensForUsers(userDocs);

    await sendToTokens(tokens, {
      notification: {
        title: "Ride group update",
        body: `${member.displayName || "A student"} joined your ride group.`,
      },
      data: {
        kind: "ride_group_invite",
        groupId,
        url: `/en/find-ride?groupId=${groupId}`,
      },
    });
  }
);

exports.sendPriorityNotification = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Sign in before sending notifications.");
    }

    const adminSnap = await db.collection("users").doc(uid).get();
    const role = adminSnap.data()?.role;
    if (role !== "admin") {
      throw new HttpsError("permission-denied", "Only admins can send priority notifications.");
    }

    const { userIds = [], title, body, url = "/" } = request.data || {};
    if (!title || !body || !Array.isArray(userIds)) {
      throw new HttpsError("invalid-argument", "title, body, and userIds[] are required.");
    }

    const userDocs = await Promise.all(
      userIds.map((uid) => db.collection("users").doc(uid).get())
    );
    const tokens = await collectTokensForUsers(userDocs.filter((doc) => doc.exists));

    await sendToTokens(tokens, {
      notification: { title, body },
      data: { kind: "admin_priority", url },
    });

    logger.info("Priority notification sent", { count: tokens.length });
    return { sent: tokens.length };
});
