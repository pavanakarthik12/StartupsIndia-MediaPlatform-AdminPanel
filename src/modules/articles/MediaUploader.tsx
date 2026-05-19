import { useState } from "react";
import { uploadMedia } from "@/services/articles";
import { cn } from "@/lib/utils";

function isImage(file: File) {
  return file.type.startsWith("image/");
}

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxWidth = 1600;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) return file;
  return new File([blob], file.name, { type: "image/jpeg" });
}

export function MediaUploader({
  label,
  accept,
  onUploaded
}: {
  label: string;
  accept?: string;
  onUploaded: (url: string) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    const prepared = isImage(file) ? await compressImage(file) : file;
    const url = await uploadMedia(prepared, setProgress);
    onUploaded(url);
  };

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <input
          type="file"
          accept={accept ?? "image/*,video/*"}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        {previewUrl && (
          <div className="mt-2">
            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
              {accept?.includes("video") || previewUrl.endsWith(".mp4") ? (
                <video src={previewUrl} className="h-full w-full object-cover" controls />
              ) : (
                <img src={previewUrl} alt="Upload preview" className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        )}
        <div className={cn("h-2 rounded-full bg-muted", progress > 0 && "mt-2")}
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
