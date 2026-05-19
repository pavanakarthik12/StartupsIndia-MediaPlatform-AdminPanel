import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Topic } from "@/types/topics";
import { collections } from "@/constants/collections";

export async function listTopics() {
  const snapshot = await getDocs(query(collection(db, collections.topics), orderBy("sortOrder", "asc")));
  return snapshot.docs.map((item) => ({ ...(item.data() as Topic) , id: item.id }));
}

export async function upsertTopic(id: string, payload: Partial<Topic>) {
  await setDoc(
    doc(db, collections.topics, id),
    {
      ...payload,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
