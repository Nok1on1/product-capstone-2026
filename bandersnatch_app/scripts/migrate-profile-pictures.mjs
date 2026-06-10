import { createHash, randomUUID } from "node:crypto";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!serviceAccountPath || !storageBucket) {
  throw new Error(
    "Set GOOGLE_APPLICATION_CREDENTIALS and FIREBASE_STORAGE_BUCKET before running this script."
  );
}

const serviceAccount = await import(serviceAccountPath, {
  assert: { type: "json" },
});

initializeApp({
  credential: cert(serviceAccount.default),
  storageBucket,
});

const db = getFirestore();
const bucket = getStorage().bucket();
const users = await db.collection("users").get();

let migrated = 0;

for (const userDoc of users.docs) {
  const user = userDoc.data();
  const picture = user.profilePicture;

  if (typeof picture !== "string" || !picture.startsWith("data:image/")) {
    continue;
  }

  const match = picture.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) continue;

  const [, contentType, encoded] = match;
  const extension = contentType.includes("png") ? "png" : "jpg";
  const digest = createHash("sha256").update(encoded).digest("hex").slice(0, 12);
  const path = `profilePictures/${userDoc.id}/migrated-${digest}.${extension}`;
  const file = bucket.file(path);
  const downloadToken = randomUUID();

  await file.save(Buffer.from(encoded, "base64"), {
    metadata: {
      contentType,
      cacheControl: "public,max-age=3600",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });

  const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${downloadToken}`;

  await userDoc.ref.set(
    {
      profilePicture: downloadURL,
      profilePictureStoragePath: path,
      profilePictureMigratedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  migrated += 1;
  console.log(`Migrated ${userDoc.id}`);
}

console.log(`Done. Migrated ${migrated} profile pictures.`);
