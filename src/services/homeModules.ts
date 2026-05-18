import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/firebase/client";

export async function listHomeModule<T>(collectionName: string) {
  const snapshot = await getDocs(query(collection(db, collectionName), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as T) }));
}

export async function createHomeModule<T>(collectionName: string, payload: Partial<T>) {
  const refDoc = doc(collection(db, collectionName));
  await setDoc(refDoc, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return refDoc.id;
}

export async function updateHomeModule<T>(collectionName: string, id: string, payload: Partial<T>) {
  await updateDoc(doc(db, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export async function deleteHomeModule(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}
