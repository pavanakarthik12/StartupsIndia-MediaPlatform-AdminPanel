import { doc, getDoc, getDocs, collection, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { StaticPage } from "@/types/staticPages";
import { collections } from "@/constants/collections";

export async function listStaticPages() {
  const snapshot = await getDocs(query(collection(db, collections.staticPages), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ ...(item.data() as StaticPage) , slug: item.id }));
}

export async function getStaticPage(slug: string) {
  const snapshot = await getDoc(doc(db, collections.staticPages, slug));
  if (!snapshot.exists()) return null;
  return { ...(snapshot.data() as StaticPage) , slug: snapshot.id };
}

export async function upsertStaticPage(slug: string, payload: Partial<StaticPage>) {
  await setDoc(
    doc(db, collections.staticPages, slug),
    {
      ...payload,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
