import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUserDoc,
  getUserById,
  listUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
  updateUserVerification
} from "@/services/users";
import type { UserProfile } from "@/types/users";

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: listUsers
  });
}

export function useUserQuery(uid: string | undefined) {
  return useQuery({
    queryKey: ["users", uid],
    queryFn: () => (uid ? getUserById(uid) : Promise.resolve(null)),
    enabled: Boolean(uid)
  });
}

export function useUserMutations() {
  const client = useQueryClient();

  const update = useMutation({
    mutationFn: ({ uid, payload }: { uid: string; payload: Partial<UserProfile> }) => updateUser(uid, payload),
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] })
  });

  const setStatus = useMutation({
    mutationFn: ({ uid, status }: { uid: string; status: "active" | "suspended" | "deleted" }) => updateUserStatus(uid, status),
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] })
  });

  const setRole = useMutation({
    mutationFn: ({ uid, role }: { uid: string; role: "user" | "author" | "moderator" | "admin" }) => updateUserRole(uid, role),
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] })
  });

  const setVerification = useMutation({
    mutationFn: ({ uid, verified }: { uid: string; verified: boolean }) => updateUserVerification(uid, verified),
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] })
  });

  const remove = useMutation({
    mutationFn: (uid: string) => deleteUserDoc(uid),
    onSuccess: () => client.invalidateQueries({ queryKey: ["users"] })
  });

  return { update, setStatus, setRole, setVerification, remove };
}
