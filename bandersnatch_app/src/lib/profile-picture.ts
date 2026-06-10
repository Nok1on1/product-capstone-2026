import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

const AVATAR_SIZE = 200;
const AVATAR_QUALITY = 0.82;

async function loadImage(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function resizeAvatar(file: File): Promise<Blob> {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare image for upload.");
  }

  const side = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - side) / 2;
  const sy = (image.naturalHeight - side) / 2;

  ctx.drawImage(image, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not compress image."));
      },
      "image/jpeg",
      AVATAR_QUALITY
    );
  });
}

export async function uploadProfilePicture(uid: string, file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  const avatarBlob = await resizeAvatar(file);
  const path = `profilePictures/${uid}/avatar.jpg`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, avatarBlob, {
    contentType: "image/jpeg",
    cacheControl: "public,max-age=3600",
  });

  const downloadURL = await getDownloadURL(storageRef);
  return { downloadURL, path };
}
