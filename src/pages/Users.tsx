import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/common/Pagination";
import { UserStatusBadge } from "@/modules/users/UserStatusBadge";
import { UserRoleBadge } from "@/modules/users/UserRoleBadge";
import { useUsersQuery, useUserMutations } from "@/hooks/useUsers";
import type { UserProfile } from "@/types/users";

type Filters = {
  status: "all" | "active" | "suspended" | "deleted";
  role: "all" | "user" | "author" | "moderator" | "admin";
  verified: "all" | "verified" | "unverified";
  search: string;
};

export function Users() {
  const { data = [], isLoading } = useUsersQuery();
  const { setStatus, setRole, setVerification } = useUserMutations();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    role: "all",
    verified: "all",
    search: ""
  });
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPage(1);
    }, 300);
    return () => window.clearTimeout(handler);
  }, [searchInput]);

  const filtered = useMemo(() => {
    return data.filter((user) => {
      const matchesStatus = filters.status === "all" || (user.accountStatus ?? "active") === filters.status;
      const matchesRole = filters.role === "all" || (user.adminRole ?? "user") === filters.role;
      const matchesVerified =
        filters.verified === "all" || (filters.verified === "verified" ? user.isVerified : !user.isVerified);
      const matchesSearch =
        !filters.search ||
        user.displayName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesRole && matchesVerified && matchesSearch;
    });
  }, [data, filters]);

  const totalUsers = data.length;
  const verifiedCreators = data.filter((user) => user.isVerified).length;
  const activeUsers = data.filter((user) => (user.accountStatus ?? "active") === "active").length;
  const roleDistribution = ["user", "author", "moderator", "admin"].map((role) => ({
    role,
    count: data.filter((user) => (user.adminRole ?? "user") === role).length
  }));

  const growthData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const label = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const count = data.filter((user) => {
        const createdAt = user.createdAt ? new Date(String(user.createdAt)) : null;
        return createdAt ? createdAt.toDateString() === date.toDateString() : false;
      }).length;
      return { label, count };
    });
  }, [data]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleStatusToggle = async (user: UserProfile) => {
    const next = (user.accountStatus ?? "active") === "active" ? "suspended" : "active";
    await setStatus.mutateAsync({ uid: user.uid, status: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">Audit, verify, and manage user access.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Users</p>
          <p className="mt-2 text-2xl font-semibold">{totalUsers}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Users</p>
          <p className="mt-2 text-2xl font-semibold">{activeUsers}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Verified Creators</p>
          <p className="mt-2 text-2xl font-semibold">{verifiedCreators}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role Distribution</p>
          <div className="mt-2 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleDistribution}>
                <XAxis dataKey="role" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">User Growth</p>
        <div className="mt-3 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="label" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search name or email" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          <select
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value as Filters["status"] }))}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="deleted">Deleted</option>
          </select>
          <select
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            value={filters.role}
            onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value as Filters["role"] }))}
          >
            <option value="all">All roles</option>
            <option value="user">user</option>
            <option value="author">author</option>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
          </select>
          <select
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            value={filters.verified}
            onChange={(event) => setFilters((prev) => ({ ...prev, verified: event.target.value as Filters["verified"] }))}
          >
            <option value="all">All verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </Card>

      <Card>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Loading users...
                </td>
              </tr>
            ) : (
              pageItems.map((user) => (
                <tr key={user.uid} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{user.displayName || user.fullName || "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">{user.username}</div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <UserRoleBadge role={(user.adminRole ?? "user") as "user" | "author" | "moderator" | "admin"} />
                  </td>
                  <td className="px-4 py-3">
                    <UserStatusBadge status={user.accountStatus ?? "active"} />
                  </td>
                  <td className="px-4 py-3">{user.isVerified ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button className="text-primary" onClick={() => navigate(`/users/${user.uid}`)}>
                        View
                      </button>
                      <button className="text-muted-foreground" onClick={() => handleStatusToggle(user)}>
                        {user.accountStatus === "suspended" ? "Activate" : "Suspend"}
                      </button>
                      <button
                        className="text-muted-foreground"
                        onClick={() => setVerification.mutateAsync({ uid: user.uid, verified: !user.isVerified })}
                      >
                        Toggle Verify
                      </button>
                      <select
                        className="rounded-xl border border-border bg-card px-2 py-1"
                        value={user.adminRole ?? "user"}
                        onChange={(event) =>
                          setRole.mutateAsync({
                            uid: user.uid,
                            role: event.target.value as "user" | "author" | "moderator" | "admin"
                          })
                        }
                      >
                        <option value="user">user</option>
                        <option value="author">author</option>
                        <option value="moderator">moderator</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <Pagination page={page} total={pageCount} onPageChange={setPage} />
    </div>
  );
}
