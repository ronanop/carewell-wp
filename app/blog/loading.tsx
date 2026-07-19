export default function BlogLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="h-72 bg-muted/40" />
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
        <div className="h-8 w-2/3 rounded-lg bg-muted" />
        <div className="h-4 w-full rounded bg-muted/70" />
        <div className="h-4 w-5/6 rounded bg-muted/70" />
        <div className="h-4 w-4/6 rounded bg-muted/70" />
      </div>
    </div>
  );
}
