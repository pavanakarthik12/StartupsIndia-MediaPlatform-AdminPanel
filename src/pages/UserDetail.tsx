import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserStatusBadge } from "@/modules/users/UserStatusBadge";
import { UserRoleBadge } from "@/modules/users/UserRoleBadge";
import { useUserMutations, useUserQuery } from "@/hooks/useUsers";
import { useArticlesQuery } from "@/hooks/useArticles";
import { useToast } from "@/hooks/useToast";
import type { UserProfile } from "@/types/users";

const tabs = ["overview", "authored", "saved", "liked", "activity"] as const;

type Tab = (typeof tabs)[number];

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useUserQuery(id);
  const { data: articles = [] } = useArticlesQuery();
  const { update, setRole, setStatus, setVerification } = useUserMutations();
  const { push } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const authored = useMemo(() => articles.filter((item) => item.authorId === id), [articles, id]);
  const saved = useMemo(() => articles.filter((item) => item.bookmarkedBy?.includes(id ?? "")), [articles, id]);
  const liked = useMemo(() => articles.filter((item) => item.likedBy?.includes(id ?? "")), [articles, id]);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName,
        displayName: user.displayName,
        phone: user.phone,
        websiteUrl: user.websiteUrl,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-sm text-muted-foreground">
        User not found.
        <button className="ml-2 text-primary" onClick={() => navigate("/users")}>Back</button>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    const payload: Partial<UserProfile> = {
      displayName: profile.displayName ?? user.displayName,
      fullName: profile.fullName ?? user.fullName,
      bio: profile.bio ?? user.bio,
      websiteUrl: profile.websiteUrl ?? user.websiteUrl,
      avatarUrl: profile.avatarUrl ?? user.avatarUrl,
      phone: profile.phone ?? user.phone
    };
    await update.mutateAsync({ uid: user.uid, payload });
    push({ title: "Profile updated", description: "User profile saved." });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{user.displayName || user.fullName || "User Profile"}</h1>
          <p className="text-sm text-muted-foreground">Manage account, roles, and activity.</p>
        </div>
        <Button className="bg-muted text-foreground" type="button" onClick={() => navigate("/users")}>Back</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="space-y-3">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm">
                {user.displayName?.slice(0, 1) || "U"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{user.displayName || user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <UserStatusBadge status={user.accountStatus ?? "active"} />
            <UserRoleBadge role={(user.adminRole ?? "user") as "user" | "author" | "moderator" | "admin"} />
            {user.isVerified && <span className="rounded-full border border-emerald-500/40 px-2 py-1 text-emerald-600">Verified</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            Followers: {user.followersCount} · Following: {user.followingCount} · Posts: {user.newsCount}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-muted text-foreground" type="button" onClick={() => setStatus.mutateAsync({ uid: user.uid, status: "suspended" })}>
              Suspend
            </Button>
            <Button className="bg-muted text-foreground" type="button" onClick={() => setStatus.mutateAsync({ uid: user.uid, status: "active" })}>
              Activate
            </Button>
            <Button className="bg-muted text-foreground" type="button" onClick={() => setVerification.mutateAsync({ uid: user.uid, verified: !user.isVerified })}>
              Toggle Verify
            </Button>
          </div>
        </Card>

        <Card className="space-y-3 xl:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profile</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={profile.fullName ?? ""}
              onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Full name"
            />
            <Input
              value={profile.displayName ?? ""}
              onChange={(event) => setProfile((prev) => ({ ...prev, displayName: event.target.value }))}
              placeholder="Display name"
            />
            <Input
              value={profile.phone ?? ""}
              onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Phone"
            />
            <Input
              value={profile.websiteUrl ?? ""}
              onChange={(event) => setProfile((prev) => ({ ...prev, websiteUrl: event.target.value }))}
              placeholder="Website"
            />
            <Input
              value={profile.avatarUrl ?? ""}
              onChange={(event) => setProfile((prev) => ({ ...prev, avatarUrl: event.target.value }))}
              placeholder="Avatar URL"
            />
          </div>
          <Textarea
            value={profile.bio ?? ""}
            onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder="Bio"
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={user.adminRole ?? "user"}
              onChange={(event) => setRole.mutateAsync({ uid: user.uid, role: event.target.value as "user" | "author" | "moderator" | "admin" })}
            >
              <option value="user">user</option>
              <option value="author">author</option>
              <option value="moderator">moderator</option>
              <option value="admin">admin</option>
            </select>
            <Button type="button" onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {tabs.map((item) => (
          <button
            key={item}
            className={`rounded-xl border px-3 py-2 ${tab === item ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <Card>
          <p className="text-sm text-muted-foreground">Interests: {user.interests?.join(", ") || "No interests"}</p>
          <p className="mt-2 text-sm text-muted-foreground">FCM Tokens: {user.fcmTokens?.length ?? 0}</p>
        </Card>
      )}

      {tab === "authored" && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Authored Articles</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {authored.length > 0 ? authored.map((item) => <li key={item.id}>{item.headline}</li>) : <li>No articles yet.</li>}
          </ul>
        </Card>
      )}

      {tab === "saved" && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Saved Articles</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {saved.length > 0 ? saved.map((item) => <li key={item.id}>{item.headline}</li>) : <li>No saved posts.</li>}
          </ul>
        </Card>
      )}

      {tab === "liked" && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Liked Articles</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {liked.length > 0 ? liked.map((item) => <li key={item.id}>{item.headline}</li>) : <li>No liked posts.</li>}
          </ul>
        </Card>
      )}

      {tab === "activity" && (
        <Card>
          <p className="text-sm text-muted-foreground">Recent activity will appear once activity tracking is enabled.</p>
        </Card>
      )}
    </div>
  );
}
