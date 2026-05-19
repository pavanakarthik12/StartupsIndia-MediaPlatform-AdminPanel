import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import type { AdminRole, AuthUser } from "@/types";

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

      const tokenResult = await getIdTokenResult(firebaseUser, true);
      const claimsRole = tokenResult.claims.role as AdminRole | undefined;
      const claimsAdmin = tokenResult.claims.admin === true;

      if (!claimsAdmin) {
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
      setRole(claimsRole ?? "admin");
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
