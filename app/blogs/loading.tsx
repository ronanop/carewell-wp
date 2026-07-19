export default function BlogsLoading() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="h-56 bg-muted/40" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div className="h-14 rounded-2xl bg-muted/70" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="h-72 rounded-2xl bg-muted/50" />
          <div className="h-72 rounded-2xl bg-muted/50" />
          <div className="h-72 rounded-2xl bg-muted/50" />
          <div className="h-72 rounded-2xl bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
