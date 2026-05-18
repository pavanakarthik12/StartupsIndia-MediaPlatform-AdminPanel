import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";
import { MediaUploader } from "@/modules/articles/MediaUploader";
import { useHomeModule } from "@/hooks/useHomeModules";
import { collections } from "@/constants/collections";
import type {
  HomeBanner,
  HomeCommunity,
  HomeCourse,
  HomeEvent,
  HomeFundingCard,
  HomeLeaderEntry
} from "@/types/home";

type ModuleKey =
  | "home_banners"
  | "funding_opportunities"
  | "events"
  | "courses"
  | "communities"
  | "leaderboard_entries";

type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "date" | "datetime" | "tags" | "url";
};

type ModuleConfig = {
  key: ModuleKey;
  title: string;
  description: string;
  mediaField?: string;
  fields: Field[];
};

const moduleConfigs: ModuleConfig[] = [
  {
    key: "home_banners",
    title: "Home Banners",
    description: "Hero banners, CTAs, and featured stories.",
    mediaField: "imageUrl",
    fields: [
      { name: "badge", label: "Badge", type: "text" },
      { name: "headline", label: "Headline", type: "text" },
      { name: "highlightLine", label: "Highlight Line", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      { name: "ctaLabel", label: "CTA Label", type: "text" },
      { name: "ctaLink", label: "CTA Link", type: "url" },
      { name: "redirectUrl", label: "Redirect Link", type: "url" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "publishStart", label: "Publish Start", type: "datetime" },
      { name: "publishEnd", label: "Publish End", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" }
    ]
  },
  {
    key: "funding_opportunities",
    title: "Funding Opportunities",
    description: "Latest startup funding cards.",
    mediaField: "imageUrl",
    fields: [
      { name: "company", label: "Company", type: "text" },
      { name: "stage", label: "Stage", type: "text" },
      { name: "amount", label: "Amount", type: "text" },
      { name: "sector", label: "Sector", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "publishStart", label: "Publish Start", type: "datetime" },
      { name: "publishEnd", label: "Publish End", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" }
    ]
  },
  {
    key: "events",
    title: "Events",
    description: "Upcoming events and meetups.",
    mediaField: "imageUrl",
    fields: [
      { name: "title", label: "Event Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "location", label: "Location", type: "text" },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "eventTime", label: "Event Time", type: "text" },
      { name: "registrationLink", label: "Registration Link", type: "url" },
      { name: "category", label: "Category", type: "text" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "publishStart", label: "Publish Start", type: "datetime" },
      { name: "publishEnd", label: "Publish End", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" }
    ]
  },
  {
    key: "courses",
    title: "Courses",
    description: "Learning content and featured courses.",
    mediaField: "thumbnailUrl",
    fields: [
      { name: "title", label: "Course Title", type: "text" },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "difficulty", label: "Difficulty", type: "text" },
      { name: "tags", label: "Tags (comma separated)", type: "tags" },
      { name: "courseLink", label: "Course Link", type: "url" },
      { name: "duration", label: "Duration", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "publishStart", label: "Publish Start", type: "datetime" },
      { name: "publishEnd", label: "Publish End", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" }
    ]
  },
  {
    key: "communities",
    title: "Communities",
    description: "Community groups and invite links.",
    mediaField: "logoUrl",
    fields: [
      { name: "name", label: "Community Name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "inviteLink", label: "Invite Link", type: "url" },
      { name: "memberCount", label: "Member Count", type: "text" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "publishStart", label: "Publish Start", type: "datetime" },
      { name: "publishEnd", label: "Publish End", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" }
    ]
  },
  {
    key: "leaderboard_entries",
    title: "Leaderboard",
    description: "Rankings and dynamic scoring.",
    fields: [
      { name: "rank", label: "Rank", type: "number" },
      { name: "name", label: "Name", type: "text" },
      { name: "sector", label: "Sector", type: "text" },
      { name: "valuation", label: "Valuation", type: "text" },
      { name: "growth", label: "Growth", type: "text" },
      { name: "rankingType", label: "Ranking Type", type: "text" },
      { name: "period", label: "Period", type: "text" },
      { name: "score", label: "Score", type: "number" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "publishStart", label: "Publish Start", type: "datetime" },
      { name: "publishEnd", label: "Publish End", type: "datetime" },
      { name: "isActive", label: "Active", type: "boolean" }
    ]
  }
];

const moduleHooks = {
  home_banners: collections.homeBanners,
  funding_opportunities: collections.fundingOpportunities,
  events: collections.events,
  courses: collections.courses,
  communities: collections.communities,
  leaderboard_entries: collections.leaderboardEntries
};

function getDefaultValues(config: ModuleConfig) {
  const defaults: Record<string, string | number | boolean> = {
    isActive: true,
    sortOrder: 0
  };
  config.fields.forEach((field) => {
    if (field.type === "boolean") defaults[field.name] = false;
    if (field.type === "number") defaults[field.name] = 0;
    if (field.type === "tags") defaults[field.name] = "";
  });
  return defaults;
}

function formatFieldValue(value: unknown, type: Field["type"]) {
  if (type === "tags") {
    if (Array.isArray(value)) return value.join(", ");
    return String(value ?? "");
  }
  if (type === "number") return Number(value ?? 0);
  if (type === "boolean") return Boolean(value ?? false);
  return String(value ?? "");
}

function parseFieldValue(value: string | number | boolean, type: Field["type"]) {
  if (type === "number") return Number(value || 0);
  if (type === "boolean") return Boolean(value);
  if (type === "tags") return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return value;
}

export function HomeModules() {
  const banners = useHomeModule<HomeBanner>(moduleHooks.home_banners);
  const funding = useHomeModule<HomeFundingCard>(moduleHooks.funding_opportunities);
  const events = useHomeModule<HomeEvent>(moduleHooks.events);
  const courses = useHomeModule<HomeCourse>(moduleHooks.courses);
  const communities = useHomeModule<HomeCommunity>(moduleHooks.communities);
  const leaderboard = useHomeModule<HomeLeaderEntry>(moduleHooks.leaderboard_entries);

  const dataMap = {
    home_banners: banners,
    funding_opportunities: funding,
    events,
    courses,
    communities,
    leaderboard_entries: leaderboard
  };

  const [activeModule, setActiveModule] = useState<ModuleKey>("home_banners");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formState, setFormState] = useState<Record<string, string | number | boolean>>({});

  const config = moduleConfigs.find((item) => item.key === activeModule) ?? moduleConfigs[0]!;
  const moduleData = dataMap[activeModule].query.data ?? [];
  const moduleActions = dataMap[activeModule];

  const openCreate = () => {
    setEditingItem(null);
    setFormState(getDefaultValues(config));
    setModalOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    const defaults = getDefaultValues(config);
    const values: Record<string, string | number | boolean> = { ...defaults };
    config.fields.forEach((field) => {
      values[field.name] = formatFieldValue(item[field.name], field.type) as string | number | boolean;
    });
    setEditingItem(item);
    setFormState(values);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload: Record<string, unknown> = {};
    config.fields.forEach((field) => {
      payload[field.name] = parseFieldValue(formState[field.name] ?? "", field.type);
    });

    if (editingItem?.id) {
      await moduleActions.update.mutateAsync({ id: String(editingItem.id), payload });
    } else {
      await moduleActions.create.mutateAsync(payload);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await moduleActions.remove.mutateAsync(id);
  };

  const previewTitle = (item: Record<string, unknown>) => {
    return (
      (item.headline as string) ||
      (item.title as string) ||
      (item.company as string) ||
      (item.name as string) ||
      "Untitled"
    );
  };

  const previewSubtitle = (item: Record<string, unknown>) => {
    return (
      (item.subtitle as string) ||
      (item.description as string) ||
      (item.location as string) ||
      (item.stage as string) ||
      ""
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Home Content CMS</h1>
        <p className="text-sm text-muted-foreground">Manage hero stories, events, funding, courses, communities, and leaderboard entries.</p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2">
          {moduleConfigs.map((module) => (
            <button
              key={module.key}
              className={`rounded-xl border px-3 py-2 text-xs ${module.key === activeModule ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}
              onClick={() => setActiveModule(module.key)}
            >
              {module.title}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{config.title}</h2>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        <Button type="button" onClick={openCreate}>
          New {config.title}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {moduleData.map((item) => (
          <Card key={String(item.id)} className="flex flex-col gap-3">
            {config.mediaField && (item as any)[config.mediaField] && (
              <img
                src={(item as any)[config.mediaField]}
                alt={previewTitle(item as any)}
                className="h-32 w-full rounded-xl object-cover"
              />
            )}
            <div>
              <p className="text-sm font-semibold">{previewTitle(item as any)}</p>
              <p className="text-xs text-muted-foreground">{previewSubtitle(item as any)}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-border px-2 py-1">Sort: {String(item.sortOrder ?? 0)}</span>
              <span className="rounded-full border border-border px-2 py-1">
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-auto flex flex-wrap gap-2 text-xs">
              <button className="text-primary" onClick={() => openEdit(item as Record<string, unknown>)}>Edit</button>
              <button className="text-muted-foreground" onClick={() => handleDelete(String(item.id))}>Delete</button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${editingItem ? "Edit" : "Create"} ${config.title}`}
      >
        <div className="grid gap-3">
          {config.mediaField && (
            <MediaUploader
              label="Media Upload"
              accept="image/*"
              onUploaded={(url) => setFormState((prev) => ({ ...prev, [config.mediaField as string]: url }))}
            />
          )}
          {config.fields.map((field) => {
            const value = formState[field.name];
            if (field.type === "textarea") {
              return (
                <div key={field.name}>
                  <label className="text-xs font-semibold text-muted-foreground">{field.label}</label>
                  <Textarea
                    value={String(value ?? "")}
                    onChange={(event) => setFormState((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  />
                </div>
              );
            }
            if (field.type === "boolean") {
              return (
                <label key={field.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => setFormState((prev) => ({ ...prev, [field.name]: event.target.checked }))}
                  />
                  {field.label}
                </label>
              );
            }
            return (
              <div key={field.name}>
                <label className="text-xs font-semibold text-muted-foreground">{field.label}</label>
                <Input
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text"}
                  value={String(value ?? "")}
                  onChange={(event) => setFormState((prev) => ({ ...prev, [field.name]: event.target.value }))}
                />
              </div>
            );
          })}
          <div className="flex gap-2">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
            <Button className="bg-muted text-foreground" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
