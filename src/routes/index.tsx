import { lazy } from "react";
import { createRoutesFromElements, Route, useRoutes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Articles = lazy(() => import("@/pages/Articles").then((m) => ({ default: m.Articles })));
const ArticleEditor = lazy(() => import("@/pages/ArticleEditor").then((m) => ({ default: m.ArticleEditor })));
const Users = lazy(() => import("@/pages/Users").then((m) => ({ default: m.Users })));
const Topics = lazy(() => import("@/pages/Topics").then((m) => ({ default: m.Topics })));
const Sources = lazy(() => import("@/pages/Sources").then((m) => ({ default: m.Sources })));
const Notifications = lazy(() => import("@/pages/Notifications").then((m) => ({ default: m.Notifications })));
const Moderation = lazy(() => import("@/pages/Moderation").then((m) => ({ default: m.Moderation })));
const HomeModules = lazy(() => import("@/pages/HomeModules").then((m) => ({ default: m.HomeModules })));
const Settings = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.Settings })));
const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

export function RouteRenderer() {
  return useRoutes(
    createRoutesFromElements(
      <Route>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/new" element={<ArticleEditor />} />
          <Route path="/articles/:id" element={<ArticleEditor />} />
          <Route path="/users" element={<Users />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/home" element={<HomeModules />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
}
