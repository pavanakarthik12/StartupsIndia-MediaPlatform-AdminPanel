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
import { db, storage } from "@/firebase/client";
import type { Article, ArticleStatus } from "@/types/articles";
import { collections } from "@/constants/collections";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export async function listArticles() {
  const snapshot = await getDocs(query(collection(db, collections.articles), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => ({ ...(item.data() as Article) , id: item.id }));
}

export async function getArticleById(id: string) {
  const snapshot = await getDoc(doc(db, collections.articles, id));
  if (!snapshot.exists()) return null;
  return { ...(snapshot.data() as Article) , id: snapshot.id };
}

export async function upsertArticle(id: string, payload: Partial<Article>) {
  const refDoc = doc(db, collections.articles, id);
  await setDoc(
    refDoc,
    {
      ...payload,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function createArticle(payload: Partial<Article>) {
  const refDoc = doc(collection(db, collections.articles));
  await setDoc(refDoc, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return refDoc.id;
}

export async function updateArticleStatus(id: string, status: ArticleStatus, meta?: Partial<Article>) {
  await updateDoc(doc(db, collections.articles, id), {
    status,
    ...meta,
    updatedAt: serverTimestamp()
  });
}

export async function deleteArticle(id: string) {
  await deleteDoc(doc(db, collections.articles, id));
}

export async function bulkUpdateStatus(ids: string[], status: ArticleStatus, meta?: Partial<Article>) {
  await Promise.all(ids.map((id) => updateArticleStatus(id, status, meta)));
}

export async function uploadMedia(file: File, onProgress?: (value: number) => void) {
  const storageRef = ref(storage, `articles/${Date.now()}-${file.name}`);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise<string>((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(progress));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}
