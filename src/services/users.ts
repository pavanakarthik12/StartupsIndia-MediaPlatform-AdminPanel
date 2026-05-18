import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "@/firebase/client";
import type { UserProfile } from "@/types/users";
import { collections } from "@/constants/collections";

export async function listUsers() {
  const snapshot = await getDocs(query(collection(db, collections.users), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ uid: item.id, ...(item.data() as UserProfile) }));
}

export async function getUserById(uid: string) {
  const snapshot = await getDoc(doc(db, collections.users, uid));
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...(snapshot.data() as UserProfile) };
}

export async function updateUser(uid: string, payload: Partial<UserProfile>) {
  await updateDoc(doc(db, collections.users, uid), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}

export async function updateUserStatus(uid: string, accountStatus: "active" | "suspended" | "deleted") {
  await updateUser(uid, { accountStatus });
}

export async function updateUserRole(uid: string, adminRole: "user" | "author" | "moderator" | "admin") {
  await updateUser(uid, { adminRole });
}

export async function updateUserVerification(uid: string, isVerified: boolean) {
  await updateUser(uid, { isVerified });
}

export async function deleteUserDoc(uid: string) {
  await deleteDoc(doc(db, collections.users, uid));
}
