import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { AdminRole } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { LoadingScreen } from "@/app/LoadingScreen";

export function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: ReactNode;
  allowedRoles?: AdminRole[];
}) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={routes.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <>{children}</>;
}
