import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

/**
 * Join or create a ride group (max 5 users)
 */
export async function joinRideGroup(direction: "station" | "city") {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const uid = user.uid;

  // 1. Get user profile
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User document missing");
  }

  const userData = userSnap.data();

  // 2. If already in group → return it
  if (userData.activeRideGroupId) {
    return userData.activeRideGroupId;
  }

  const groupsRef = collection(db, "rideGroups");

  // 3. Find existing group with space
  const q = query(
    groupsRef,
    where("direction", "==", direction),
    where("active", "==", true),
    orderBy("createdAt"),
    limit(10)
  );

  const snapshot = await getDocs(q);

  let targetGroupId: string | null = null;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if ((data.memberCount ?? 0) < 5) {
      targetGroupId = docSnap.id;
      break;
    }
  }

  // 4. If no group found → create one
  if (!targetGroupId) {
    const newGroupRef = await addDoc(groupsRef, {
      direction,
      memberCount: 0,
      active: true,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });

    targetGroupId = newGroupRef.id;
  }

  // 5. Add user to group (TRANSACTION = prevents 5+ bug)
  await runTransaction(db, async (transaction) => {
    const groupRef = doc(db, "rideGroups", targetGroupId!);
    const groupSnap = await transaction.get(groupRef);

    if (!groupSnap.exists()) return;

    const groupData = groupSnap.data();
    const currentCount = groupData.memberCount ?? 0;

    if (currentCount >= 5) {
      throw new Error("Group full, retry");
    }

    // add member subcollection doc
    const memberRef = doc(db, "rideGroups", targetGroupId!, "members", uid);

    transaction.set(memberRef, {
      uid,
      displayName: userData.displayName || "User",
      profilePicture: userData.profilePicture || null,
      joinedAt: serverTimestamp(),
    });

    transaction.update(groupRef, {
      memberCount: currentCount + 1,
      lastActivity: serverTimestamp(),
    });

    transaction.set(userRef, {
      ...userData,
      activeRideGroupId: targetGroupId,
    });
  });

  return targetGroupId;
}