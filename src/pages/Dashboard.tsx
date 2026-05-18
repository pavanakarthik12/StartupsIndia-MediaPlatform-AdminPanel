import { Card } from "@/components/ui/card";
import { StatCard } from "@/modules/dashboard/StatCard";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { name: "Mon", users: 240, articles: 32 },
  { name: "Tue", users: 280, articles: 28 },
  { name: "Wed", users: 310, articles: 40 },
  { name: "Thu", users: 390, articles: 36 },
  { name: "Fri", users: 420, articles: 48 },
  { name: "Sat", users: 500, articles: 44 },
  { name: "Sun", users: 620, articles: 52 }
];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of platform health and content.</p>
        </div>
        <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm">Export Report</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={48210} delta="+8.2% this week" />
        <StatCard label="Total Articles" value={1320} delta="+28 published" />
        <StatCard label="Pending Articles" value={74} delta="Moderation queue" />
        <StatCard label="FCM Tokens" value={34412} delta="Active devices" />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">User Growth</h2>
            <p className="text-xs text-muted-foreground">Weekly active users and publishing volume.</p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Last 7 days</span>
        </div>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="articles" stroke="hsl(var(--accent-foreground))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold">Trending Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Technology - 24%</li>
            <li>Funding - 18%</li>
            <li>Founders - 14%</li>
            <li>Women in Startups - 10%</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>New article published by Admin (2m ago)</li>
            <li>Moderator approved 6 articles (14m ago)</li>
            <li>Sent notification campaign to 1.4k users (1h ago)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
