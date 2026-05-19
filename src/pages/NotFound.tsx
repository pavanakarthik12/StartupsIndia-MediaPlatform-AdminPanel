export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">Check the URL and try again.</p>
      </div>
    </div>
  );
}
