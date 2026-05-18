import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";
import { ArticleStatusBadge } from "@/modules/articles/ArticleStatusBadge";
import { MarkdownEditor } from "@/modules/articles/MarkdownEditor";
import { MediaUploader } from "@/modules/articles/MediaUploader";
import { SeoPreview } from "@/modules/articles/SeoPreview";
import { StickyActionBar } from "@/modules/articles/StickyActionBar";
import { ModerationHistory } from "@/modules/articles/ModerationHistory";
import { ArticlePreview } from "@/modules/articles/ArticlePreview";
import { calculateReadTimeMinutes } from "@/utils/readTime";
import { useArticleMutations, useArticleQuery } from "@/hooks/useArticles";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { canPublish } from "@/utils/guards";
import type { Article, ArticleStatus } from "@/types/articles";

const schema = z.object({
  headline: z.string().min(5),
  category: z.string().min(2),
  body: z.string().min(20),
  sourceName: z.string().min(2),
  sourceId: z.string().optional(),
  sourceLogoAsset: z.string().optional(),
  thumbnailAsset: z.string().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  mediaUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isTrending: z.boolean().default(false),
  isFeatured: z.boolean().default(false)
});

type ArticleFormValues = z.infer<typeof schema>;

const draftStorageKey = "si-admin-article-draft";

export function ArticleEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { push } = useToast();
  const { data: article, isLoading } = useArticleQuery(id);
  const { create, upsert, updateStatus } = useArticleMutations();
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const autosaveRef = useRef<number | null>(null);

  const defaultValues = useMemo<ArticleFormValues>(() => {
    if (!article) {
      const draft = localStorage.getItem(draftStorageKey);
      if (draft) {
        try {
          return JSON.parse(draft) as ArticleFormValues;
        } catch {
          return {
            headline: "",
            category: "",
            body: "",
            sourceName: "",
            sourceId: "",
            sourceLogoAsset: "",
            thumbnailAsset: "",
            mediaType: "image",
            mediaUrl: "",
            thumbnailUrl: "",
            isTrending: false,
            isFeatured: false
          };
        }
      }
    }

    return {
      headline: article?.headline ?? "",
      category: article?.category ?? "",
      body: article?.body ?? "",
      sourceName: article?.sourceName ?? "",
      sourceId: article?.sourceId ?? "",
      sourceLogoAsset: article?.sourceLogoAsset ?? "",
      thumbnailAsset: article?.thumbnailAsset ?? "",
      mediaType: article?.mediaType ?? "image",
      mediaUrl: article?.mediaUrl ?? "",
      thumbnailUrl: article?.thumbnailUrl ?? "",
      isTrending: article?.isTrending ?? false,
      isFeatured: article?.isFeatured ?? false
    };
  }, [article]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const formValues = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (isNew) {
      if (autosaveRef.current) window.clearInterval(autosaveRef.current);
      autosaveRef.current = window.setInterval(() => {
        localStorage.setItem(draftStorageKey, JSON.stringify(formValues));
      }, 10000);
      return () => {
        if (autosaveRef.current) window.clearInterval(autosaveRef.current);
      };
    }
  }, [formValues, isNew]);

  const readTime = useMemo(() => calculateReadTimeMinutes(formValues.body ?? ""), [formValues.body]);

  const basePayload = (status: ArticleStatus): Partial<Article> => ({
    ...formValues,
    status,
    authorId: article?.authorId ?? user?.uid ?? "",
    sourceLogoAsset: formValues.sourceLogoAsset ?? "",
    thumbnailAsset: formValues.thumbnailAsset ?? "",
    timeAgo: article?.timeAgo ?? "just now",
    likesCount: article?.likesCount ?? 0,
    commentsCount: article?.commentsCount ?? 0,
    isSourceFollowing: article?.isSourceFollowing ?? false,
    isBookmarked: article?.isBookmarked ?? false,
    isLiked: article?.isLiked ?? false,
    likedBy: article?.likedBy ?? [],
    bookmarkedBy: article?.bookmarkedBy ?? [],
    readTimeMinutes: readTime,
    updatedAt: new Date().toISOString()
  });

  const handleSaveDraft = async () => {
    const payload = basePayload("draft");

    if (isNew) {
      const newId = await create.mutateAsync(payload);
      localStorage.removeItem(draftStorageKey);
      navigate(`/articles/${newId}`);
      return;
    }

    if (id) {
      await upsert.mutateAsync({ id, payload });
    }

    push({ title: "Draft saved", description: "Your draft has been saved." });
  };

  const handleSubmitForReview = async () => {
    const payload: Partial<Article> = {
      ...basePayload("pending"),
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      moderationHistory: [
        ...(article?.moderationHistory ?? []),
        { action: "submitted", by: user?.email ?? "admin", at: new Date().toISOString() }
      ]
    };

    if (isNew) {
      const newId = await create.mutateAsync(payload);
      localStorage.removeItem(draftStorageKey);
      navigate(`/articles/${newId}`);
      return;
    }

    if (id) {
      await upsert.mutateAsync({ id, payload });
    }

    push({ title: "Submitted", description: "Article is now pending review." });
  };

  const handlePublish = async () => {
    if (!id) return;
    await updateStatus.mutateAsync({
      id,
      status: "published",
      meta: {
        publishedAt: new Date().toISOString(),
        reviewedBy: user?.email ?? "admin",
        reviewedAt: new Date().toISOString(),
        moderationHistory: [
          ...(article?.moderationHistory ?? []),
          { action: "approved", by: user?.email ?? "admin", at: new Date().toISOString() }
        ]
      }
    });
    setShowPublishConfirm(false);
    push({ title: "Published", description: "Article is live." });
  };

  const handleArchive = async () => {
    if (!id) return;
    await updateStatus.mutateAsync({
      id,
      status: "archived",
      meta: {
        reviewedBy: user?.email ?? "admin",
        reviewedAt: new Date().toISOString(),
        moderationHistory: [
          ...(article?.moderationHistory ?? []),
          { action: "archived", by: user?.email ?? "admin", at: new Date().toISOString() }
        ]
      }
    });
    push({ title: "Archived", description: "Article archived." });
  };

  const handleReject = async () => {
    if (!id) return;
    await updateStatus.mutateAsync({
      id,
      status: "rejected",
      meta: {
        rejectionReason,
        reviewedBy: user?.email ?? "admin",
        reviewedAt: new Date().toISOString(),
        moderationHistory: [
          ...(article?.moderationHistory ?? []),
          { action: "rejected", by: user?.email ?? "admin", at: new Date().toISOString(), reason: rejectionReason }
        ]
      }
    });
    setShowRejectModal(false);
    setRejectionReason("");
    push({ title: "Rejected", description: "Article moved to rejected." });
  };

  const seoDescription = useMemo(() => formValues.body?.slice(0, 140) ?? "", [formValues.body]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading article...</div>;
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleSubmitForReview)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{isNew ? "Create Article" : "Edit Article"}</h1>
          <p className="text-sm text-muted-foreground">Write, preview, and publish content with full moderation flow.</p>
        </div>
        <div className="flex items-center gap-2">
          {article?.status && <ArticleStatusBadge status={article.status} />}
          <Button className="bg-muted text-foreground" type="button" onClick={() => navigate("/articles")}
          >
            Back
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Headline</label>
            <Input placeholder="Headline" {...register("headline")} />
            {errors.headline && <p className="mt-1 text-xs text-danger">{errors.headline.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Category</label>
            <Input placeholder="Category" {...register("category")} />
            {errors.category && <p className="mt-1 text-xs text-danger">{errors.category.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Source Name</label>
            <Input placeholder="Source Name" {...register("sourceName")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Source ID</label>
            <Input placeholder="sourceId" {...register("sourceId")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Source Logo URL</label>
            <Input placeholder="https://" {...register("sourceLogoAsset")} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Cover Image URL</label>
            <Input placeholder="https://" {...register("thumbnailAsset")} />
          </div>
        </div>
      </Card>

      <Card>
        <label className="text-xs font-semibold text-muted-foreground">Body</label>
        <MarkdownEditor value={formValues.body ?? ""} onChange={(value) => setValue("body", value)} />
        <p className="mt-2 text-xs text-muted-foreground">Estimated read time: {readTime} min</p>
        {errors.body && <p className="mt-1 text-xs text-danger">{errors.body.message}</p>}
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <MediaUploader label="Cover Image" accept="image/*" onUploaded={(url) => setValue("thumbnailAsset", url)} />
        <MediaUploader label="Media Upload" accept="image/*,video/*" onUploaded={(url) => setValue("mediaUrl", url)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SeoPreview title={formValues.headline ?? ""} description={seoDescription} />
        <ArticlePreview headline={formValues.headline ?? ""} body={formValues.body ?? ""} image={formValues.thumbnailAsset} />
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Trending</label>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={formValues.isTrending ? "yes" : "no"}
              onChange={(event) => setValue("isTrending", event.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Featured</label>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={formValues.isFeatured ? "yes" : "no"}
              onChange={(event) => setValue("isFeatured", event.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Media Type</label>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={formValues.mediaType ?? "image"}
              onChange={(event) => setValue("mediaType", event.target.value as "image" | "video")}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          {formValues.mediaType === "video" && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Video Thumbnail URL</label>
              <Input placeholder="https://" {...register("thumbnailUrl")} />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Schedule publish</label>
            <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">SEO Notes</label>
            <Textarea placeholder="Meta description or notes" />
          </div>
        </div>
      </Card>

      <ModerationHistory history={article?.moderationHistory} />

      {article && canPublish(role) && (
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={() => setShowPublishConfirm(true)}>
              Publish
            </Button>
            <Button className="bg-muted text-foreground" type="button" onClick={() => setShowRejectModal(true)}>
              Reject
            </Button>
            <Button className="bg-muted text-foreground" type="button" onClick={handleArchive}>
              Archive
            </Button>
          </div>
        </Card>
      )}

      <StickyActionBar onSaveDraft={handleSaveDraft} onSubmit={handleSubmitForReview} loading={create.isPending} />

      <Modal open={showPublishConfirm} onClose={() => setShowPublishConfirm(false)} title="Confirm Publish">
        <p className="text-sm text-muted-foreground">Are you sure you want to publish this article?</p>
        <div className="mt-4 flex gap-2">
          <Button onClick={handlePublish} type="button">
            Publish now
          </Button>
          <Button className="bg-muted text-foreground" onClick={() => setShowPublishConfirm(false)} type="button">
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal open={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Article">
        <Textarea
          placeholder="Add rejection reason"
          value={rejectionReason}
          onChange={(event) => setRejectionReason(event.target.value)}
        />
        <div className="mt-4 flex gap-2">
          <Button onClick={handleReject} type="button">
            Reject
          </Button>
          <Button className="bg-muted text-foreground" onClick={() => setShowRejectModal(false)} type="button">
            Cancel
          </Button>
        </div>
      </Modal>
    </form>
  );
}
