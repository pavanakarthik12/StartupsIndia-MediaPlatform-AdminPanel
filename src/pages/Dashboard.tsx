import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area, Line, LineChart } from "recharts";
import { AnalyticsCard } from "@/modules/dashboard/AnalyticsCard";
import { ActivityFeed } from "@/modules/dashboard/ActivityFeed";
import { MiniList } from "@/modules/dashboard/MiniList";
import { Card } from "@/components/ui/card";
import { useUsersQuery } from "@/hooks/useUsers";
import { useArticlesQuery } from "@/hooks/useArticles";
import { formatNumber } from "@/utils/format";

export function Dashboard() {
  const { data: users = [] } = useUsersQuery();
  const { data: articles = [] } = useArticlesQuery();

  const totals = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => (user.accountStatus ?? "active") === "active").length;
    const newUsers = users.filter((user) => {
      const createdAt = user.createdAt ? new Date(String(user.createdAt)) : null;
      if (!createdAt) return false;
      const now = new Date();
      return createdAt >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }).length;
    const newUsersWeek = users.filter((user) => {
      const createdAt = user.createdAt ? new Date(String(user.createdAt)) : null;
      if (!createdAt) return false;
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return createdAt >= weekAgo;
    }).length;
    const newUsersMonth = users.filter((user) => {
      const createdAt = user.createdAt ? new Date(String(user.createdAt)) : null;
      if (!createdAt) return false;
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      return createdAt >= monthAgo;
    }).length;

    const totalArticles = articles.length;
    const pendingArticles = articles.filter((article) => article.status === "pending").length;
    const publishedArticles = articles.filter((article) => article.status === "published").length;
    const trendingArticles = articles.filter((article) => article.isTrending).length;

    const totalComments = articles.reduce((acc, item) => acc + (item.commentsCount ?? 0), 0);
    const totalLikes = articles.reduce((acc, item) => acc + (item.likesCount ?? 0), 0);
    const totalBookmarks = articles.reduce((acc, item) => acc + (item.bookmarkedBy?.length ?? 0), 0);
    const totalFcmTokens = users.reduce((acc, user) => acc + (user.fcmTokens?.length ?? 0), 0);

    return {
      totalUsers,
      activeUsers,
      newUsers,
      newUsersWeek,
      newUsersMonth,
      totalArticles,
      pendingArticles,
      publishedArticles,
      trendingArticles,
      totalComments,
      totalLikes,
      totalBookmarks,
      totalFcmTokens
    };
  }, [users, articles]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((article) => {
      const key = article.category || "Uncategorized";
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }, [articles]);

  const interestCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((user) => {
      user.interests?.forEach((interest) => {
        counts[interest] = (counts[interest] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }, [users]);

  const topCreators = useMemo(() => {
    return users
      .map((user) => ({
        name: user.displayName || user.fullName || user.username || "Unknown",
        value: user.newsCount ?? 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item) => ({ label: item.name, value: String(item.value) }));
  }, [users]);

  const growthData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }).map((_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (13 - index));
      const label = date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      const count = users.filter((user) => {
        const createdAt = user.createdAt ? new Date(String(user.createdAt)) : null;
        return createdAt ? createdAt.toDateString() === date.toDateString() : false;
      }).length;
      return { label, users: count };
    });
  }, [users]);

  const engagementData = useMemo(() => {
    return growthData.map((item, index) => ({
      label: item.label,
      likes: (index + 1) * 12,
      bookmarks: (index + 1) * 6
    }));
  }, [growthData]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")))
      .slice(0, 5)
      .map((user) => `${user.displayName || user.fullName || "User"} joined`);
  }, [users]);

  const recentArticles = useMemo(() => {
    return [...articles]
      .sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")))
      .slice(0, 5)
      .map((article) => `${article.headline} (${article.status ?? "draft"})`);
  }, [articles]);

  const moderationFeed = useMemo(() => {
    return articles
      .filter((article) => ["pending", "rejected"].includes(article.status ?? ""))
      .slice(0, 5)
      .map((article) => `${article.headline} - ${article.status}`);
  }, [articles]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Investor-grade analytics for platform health.</p>
        </div>
        <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm">Export Report</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Total Users" value={formatNumber(totals.totalUsers)} trend={`+${totals.newUsersWeek} this week`} />
        <AnalyticsCard label="Active Users" value={formatNumber(totals.activeUsers)} trend="Live" />
        <AnalyticsCard label="New Users (Today)" value={formatNumber(totals.newUsers)} trend="24h" />
        <AnalyticsCard label="New Users (Month)" value={formatNumber(totals.newUsersMonth)} trend="30d" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Total Articles" value={formatNumber(totals.totalArticles)} trend="All time" />
        <AnalyticsCard label="Pending Articles" value={formatNumber(totals.pendingArticles)} trend="Moderation" />
        <AnalyticsCard label="Published Articles" value={formatNumber(totals.publishedArticles)} trend="Live" />
        <AnalyticsCard label="Trending Articles" value={formatNumber(totals.trendingArticles)} trend="Hot" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Total Comments" value={formatNumber(totals.totalComments)} trend="Content" />
        <AnalyticsCard label="Total Likes" value={formatNumber(totals.totalLikes)} trend="Engagement" />
        <AnalyticsCard label="Total Bookmarks" value={formatNumber(totals.totalBookmarks)} trend="Saved" />
        <AnalyticsCard label="FCM Tokens" value={formatNumber(totals.totalFcmTokens)} trend="Push ready" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">User Growth</h2>
              <p className="text-xs text-muted-foreground">Daily signups trend.</p>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Last 14 days</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="label" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Engagement</h2>
              <p className="text-xs text-muted-foreground">Likes and bookmarks trend.</p>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Last 14 days</span>
          </div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <XAxis dataKey="label" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Area type="monotone" dataKey="likes" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                <Area
                  type="monotone"
                  dataKey="bookmarks"
                  stroke="hsl(var(--accent-foreground))"
                  fill="hsl(var(--accent-foreground))"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <h3 className="text-sm font-semibold">Top Categories</h3>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryCounts} dataKey="value" nameKey="label" innerRadius={40} outerRadius={70} fill="hsl(var(--primary))" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <MiniList title="Top Interests" items={interestCounts.map((item) => ({ label: item.label, value: String(item.value) }))} />
        <MiniList title="Top Creators" items={topCreators} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ActivityFeed title="Recent Activity" items={[
          ...recentArticles.map((item) => `Article: ${item}`),
          ...recentUsers.map((item) => `User: ${item}`)
        ]} />
        <ActivityFeed title="Moderation Activity" items={moderationFeed} />
        <ActivityFeed title="Recent Users" items={recentUsers} />
      </div>
    </div>
  );
}
