import { collection, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export function collectionRef(path: string) {
  return collection(db, path);
}

export function docRef(path: string, id: string) {
  return doc(db, path, id);
}

export async function fetchDoc<T>(path: string, id: string) {
  const snapshot = await getDoc(docRef(path, id));
  if (!snapshot.exists()) return null;
  return { ...(snapshot.data() as T) , id: snapshot.id };
}

export async function fetchCollection<T>(path: string) {
  const snapshot = await getDocs(query(collectionRef(path)));
  return snapshot.docs.map((item) => ({ ...(item.data() as T) , id: item.id }));
}

export async function upsertDoc<T>(path: string, id: string, payload: T) {
  await setDoc(docRef(path, id), payload as any, { merge: true });
}
