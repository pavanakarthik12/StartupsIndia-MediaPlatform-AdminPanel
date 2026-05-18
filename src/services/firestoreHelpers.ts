import {
  collection,
  doc,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  startAfter,
  writeBatch
} from "firebase/firestore";
import { db } from "@/firebase/client";

export async function paginateCollection<T>(
  collectionName: string,
  options: {
    orderField: string;
    limitSize: number;
    cursor?: string;
    direction?: "next" | "prev";
  }
) {
  const baseQuery = query(collection(db, collectionName), orderBy(options.orderField, "desc"));

  const cursorQuery = options.cursor
    ? options.direction === "prev"
      ? query(baseQuery, endBefore(options.cursor), limit(options.limitSize))
      : query(baseQuery, startAfter(options.cursor), limit(options.limitSize))
    : query(baseQuery, limit(options.limitSize));

  const snapshot = await getDocs(cursorQuery);
  return snapshot.docs.map((item) => ({ ...(item.data() as T) , id: item.id }));
}

export async function batchUpdate(updates: Array<{ path: string; payload: Record<string, unknown> }>) {
  const batch = writeBatch(db);
  updates.forEach((item) => {
    batch.update(doc(db, item.path), {
      ...item.payload,
      updatedAt: serverTimestamp()
    });
  });
  await batch.commit();
}

export async function transactionUpdate(
  path: string,
  updateFn: (current: Record<string, unknown> | undefined) => Record<string, unknown>
) {
  await runTransaction(db, async (transaction) => {
    const ref = doc(db, path);
    const snapshot = await transaction.get(ref);
    const payload = updateFn(snapshot.data());
    transaction.set(ref, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
  });
}
