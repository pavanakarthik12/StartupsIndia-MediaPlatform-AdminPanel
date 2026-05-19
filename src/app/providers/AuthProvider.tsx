import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import type { AdminRole, AuthUser } from "@/types";

const ADMIN_UID = "dbIZyFkKffXNurjPApZX15kaRx42";

export type AuthContextValue = {
  user: AuthUser | null;
  role: AdminRole;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AdminRole>("user");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole("user");
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (firebaseUser.uid !== ADMIN_UID) {
        setUser(null);
        setRole("user");
        setIsAdmin(false);
        setLoading(false);
        await signOut(auth);
        return;
      }

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? ""
      });
      setRole("admin" as AdminRole);
      setIsAdmin(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, role, isAdmin, loading }), [user, role, isAdmin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
