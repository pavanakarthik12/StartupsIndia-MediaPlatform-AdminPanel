import { Suspense } from "react";
import { RouteRenderer } from "@/routes";
import { LoadingScreen } from "@/app/LoadingScreen";
import { ErrorBoundary } from "@/app/ErrorBoundary";

export function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <RouteRenderer />
      </Suspense>
    </ErrorBoundary>
  );
}
