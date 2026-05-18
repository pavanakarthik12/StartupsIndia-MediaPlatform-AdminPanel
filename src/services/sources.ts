import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { SourceProfile } from "@/types/sources";
import { collections } from "@/constants/collections";

export async function listSources() {
  const snapshot = await getDocs(query(collection(db, collections.sources), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as SourceProfile) }));
}

export async function getSourceById(id: string) {
  const snapshot = await getDoc(doc(db, collections.sources, id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...(snapshot.data() as SourceProfile) };
}

export async function createSource(payload: Partial<SourceProfile>) {
  const refDoc = doc(collection(db, collections.sources));
  await setDoc(refDoc, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return refDoc.id;
}

export async function updateSource(id: string, payload: Partial<SourceProfile>) {
  await updateDoc(doc(db, collections.sources, id), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export async function deleteSource(id: string) {
  await deleteDoc(doc(db, collections.sources, id));
}
