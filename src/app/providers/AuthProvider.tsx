import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/firebase/client";
import type { AdminRole, AuthUser } from "@/types";

export type AuthContextValue = {
  user: AuthUser | null;
  role: AdminRole;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AdminRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole("user");
        setLoading(false);
        return;
      }

      const tokenResult = await getIdTokenResult(firebaseUser, true);
      const claimsRole = tokenResult.claims.role as AdminRole | undefined;

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? ""
      });
      setRole(claimsRole ?? "user");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, role, loading }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
