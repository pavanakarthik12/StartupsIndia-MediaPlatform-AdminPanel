type LogLevel = "info" | "warn" | "error";

export function logEvent(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (level === "error") {
    console.error(message, meta ?? {});
    return;
  }
  if (level === "warn") {
    console.warn(message, meta ?? {});
    return;
  }
  console.log(message, meta ?? {});
}
