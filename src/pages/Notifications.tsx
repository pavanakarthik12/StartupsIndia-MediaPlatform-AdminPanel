import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/common/Modal";
import { NotificationPreview } from "@/modules/notifications/NotificationPreview";
import { useNotificationCampaigns, useNotificationMutations } from "@/hooks/useNotifications";
import type { CampaignStatus, NotificationCampaign } from "@/types/notifications";
import { useToast } from "@/hooks/useToast";

type TargetType = NotificationCampaign["targetType"];

export function Notifications() {
  const { data = [] } = useNotificationCampaigns();
  const { create, update } = useNotificationMutations();
  const { push } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<TargetType>("all");
  const [targetValue, setTargetValue] = useState("");
  const [payloadPage, setPayloadPage] = useState("");
  const [payloadArticleId, setPayloadArticleId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const draftDisabled = title.trim().length === 0 || body.trim().length === 0;

  const stats = useMemo(() => {
    return {
      total: data.length,
      sent: data.filter((item) => item.status === "sent").length,
      scheduled: data.filter((item) => item.status === "scheduled").length,
      failed: data.filter((item) => item.status === "failed").length
    };
  }, [data]);

  const saveDraft = async () => {
    await create.mutateAsync({
      title,
      body,
      targetType,
      targetValue: targetValue ? targetValue.split(",").map((item) => item.trim()) : "all",
      payload: {
        page: payloadPage || undefined,
        articleId: payloadArticleId || undefined
      },
      status: "draft"
    });
    push({ title: "Draft saved", description: "Campaign saved as draft." });
  };

  const scheduleCampaign = async () => {
    if (!scheduledAt) return;
    await create.mutateAsync({
      title,
      body,
      targetType,
      targetValue: targetValue ? targetValue.split(",").map((item) => item.trim()) : "all",
      payload: {
        page: payloadPage || undefined,
        articleId: payloadArticleId || undefined
      },
      status: "scheduled",
      scheduledAt: new Date(scheduledAt).toISOString()
    });
    push({ title: "Scheduled", description: "Campaign queued for server dispatch." });
  };

  const requestSend = async () => {
    await create.mutateAsync({
      title,
      body,
      targetType,
      targetValue: targetValue ? targetValue.split(",").map((item) => item.trim()) : "all",
      payload: {
        page: payloadPage || undefined,
        articleId: payloadArticleId || undefined
      },
      status: "scheduled",
      scheduledAt: new Date().toISOString()
    });
    push({
      title: "Queued",
      description: "Send request queued. Configure server-side dispatch to send FCM."
    });
  };

  const retryCampaign = async (campaign: NotificationCampaign) => {
    await update.mutateAsync({
      id: campaign.id,
      payload: { status: "scheduled", scheduledAt: new Date().toISOString() }
    });
    push({ title: "Retry queued", description: "Campaign scheduled for resend." });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Create, schedule, and audit notification campaigns.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Campaigns</p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sent</p>
          <p className="mt-2 text-2xl font-semibold">{stats.sent}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scheduled</p>
          <p className="mt-2 text-2xl font-semibold">{stats.scheduled}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Failed</p>
          <p className="mt-2 text-2xl font-semibold">{stats.failed}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-base font-semibold">Compose Campaign</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Title</label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Target Type</label>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={targetType}
              onChange={(event) => setTargetType(event.target.value as TargetType)}
            >
              <option value="all">All users</option>
              <option value="role">Role</option>
              <option value="interest">Interest</option>
              <option value="topic">Topic</option>
              <option value="user">Specific user</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground">Body</label>
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Target Value (comma separated)</label>
            <Input value={targetValue} onChange={(event) => setTargetValue(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Schedule</label>
            <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Payload Page</label>
            <Input value={payloadPage} onChange={(event) => setPayloadPage(event.target.value)} placeholder="home, article, profile" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Payload Article ID</label>
            <Input value={payloadArticleId} onChange={(event) => setPayloadArticleId(event.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={requestSend} disabled={draftDisabled}>
            Queue Send
          </Button>
          <Button className="bg-muted text-foreground" type="button" onClick={saveDraft} disabled={draftDisabled}>
            Save Draft
          </Button>
          <Button className="bg-muted text-foreground" type="button" onClick={scheduleCampaign} disabled={!scheduledAt || draftDisabled}>
            Schedule
          </Button>
          <Button className="bg-muted text-foreground" type="button" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Note: Sending FCM must be handled by server-side Admin SDK or Cloud Functions.
        </p>
      </Card>

      <Card>
        <h2 className="text-base font-semibold">Campaign History</h2>
        <Table>
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((campaign) => (
              <tr key={campaign.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{campaign.title}</div>
                  <div className="text-xs text-muted-foreground">{campaign.body}</div>
                </td>
                <td className="px-4 py-3">{campaign.targetType}</td>
                <td className="px-4 py-3">{campaign.status}</td>
                <td className="px-4 py-3">{campaign.sentCount ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button className="text-muted-foreground" onClick={() => retryCampaign(campaign)}>
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Notification Preview">
        <NotificationPreview title={title} body={body} />
      </Modal>
    </div>
  );
}
