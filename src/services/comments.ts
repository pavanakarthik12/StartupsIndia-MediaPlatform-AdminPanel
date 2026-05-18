import { collectionGroup, doc, getDocs, orderBy, query, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import type { Comment, CommentStatus } from "@/types/comments";

export async function listComments() {
  const snapshot = await getDocs(query(collectionGroup(db, "comments"), orderBy("updatedAt", "desc")));
  return snapshot.docs.map((item) => {
    const articleId = item.ref.parent.parent?.id ?? "";
    return {
      id: item.id,
      articleId,
      path: item.ref.path,
      ...(item.data() as Comment)
    } as Comment & { articleId: string; path: string };
  });
}

export async function updateCommentStatus(path: string, status: CommentStatus) {
  await updateDoc(doc(db, path), {
    status
  });
}

export async function deleteComment(path: string) {
  await deleteDoc(doc(db, path));
}
