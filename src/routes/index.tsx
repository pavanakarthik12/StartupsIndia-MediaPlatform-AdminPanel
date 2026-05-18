import { lazy } from "react";
import { createRoutesFromElements, Route, useRoutes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Articles = lazy(() => import("@/pages/Articles").then((m) => ({ default: m.Articles })));
const ArticleEditor = lazy(() => import("@/pages/ArticleEditor").then((m) => ({ default: m.ArticleEditor })));
const Users = lazy(() => import("@/pages/Users").then((m) => ({ default: m.Users })));
const UserDetail = lazy(() => import("@/pages/UserDetail").then((m) => ({ default: m.UserDetail })));
const Topics = lazy(() => import("@/pages/Topics").then((m) => ({ default: m.Topics })));
const Sources = lazy(() => import("@/pages/Sources").then((m) => ({ default: m.Sources })));
const SourceEditor = lazy(() => import("@/pages/SourceEditor").then((m) => ({ default: m.SourceEditor })));
const SourceDetail = lazy(() => import("@/pages/SourceDetail").then((m) => ({ default: m.SourceDetail })));
const Notifications = lazy(() => import("@/pages/Notifications").then((m) => ({ default: m.Notifications })));
const Moderation = lazy(() => import("@/pages/Moderation").then((m) => ({ default: m.Moderation })));
const HomeModules = lazy(() => import("@/pages/HomeModules").then((m) => ({ default: m.HomeModules })));
const Settings = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.Settings })));
const StaticPages = lazy(() => import("@/pages/StaticPages").then((m) => ({ default: m.StaticPages })));
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
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/sources/new" element={<SourceEditor />} />
          <Route path="/sources/:id" element={<SourceDetail />} />
          <Route path="/sources/:id/edit" element={<SourceEditor />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/home" element={<HomeModules />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/static-pages" element={<StaticPages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
}
