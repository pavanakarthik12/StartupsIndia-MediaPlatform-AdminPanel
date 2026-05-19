import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase/client";

export async function uploadFile(
  file: File,
  options?: { folder?: string; maxSizeMb?: number; onProgress?: (value: number) => void }
) {
  const maxSizeMb = options?.maxSizeMb ?? 6;
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`File too large. Max ${maxSizeMb}MB.`);
  }

  const folder = options?.folder ?? "uploads";
  const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise<string>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        options?.onProgress?.(Math.round(progress));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}
