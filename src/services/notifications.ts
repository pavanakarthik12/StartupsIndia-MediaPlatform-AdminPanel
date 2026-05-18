import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { NotificationCampaign } from "@/types/notifications";
import { collections } from "@/constants/collections";

export async function listNotificationCampaigns() {
  const snapshot = await getDocs(query(collection(db, collections.notificationCampaigns), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as NotificationCampaign) }));
}

export async function createCampaign(payload: Partial<NotificationCampaign>) {
  const refDoc = doc(collection(db, collections.notificationCampaigns));
  await setDoc(refDoc, {
    ...payload,
    status: payload.status ?? "draft",
    sentCount: payload.sentCount ?? 0,
    createdAt: serverTimestamp()
  });
  return refDoc.id;
}

export async function updateCampaign(id: string, payload: Partial<NotificationCampaign>) {
  await updateDoc(doc(db, collections.notificationCampaigns, id), {
    ...payload,
    updatedAt: serverTimestamp()
  });
}
