/**
 * Skeleton fallback while a WordPress `[...uri]` page resolves.
 */
export default function WordPressCatchAllLoading() {
  return (
    <div className="flex min-h-full flex-col" aria-busy="true" aria-live="polite">
      <div className="h-16 border-b border-border/60 bg-background" />
      <div className="border-b border-border/60 bg-muted/30">
        <div className="container-content py-3.5">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="container-content section-padding">
        <div className="space-y-4">
          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full max-w-2xl animate-pulse rounded bg-muted" />
          <div className="h-10 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-12 space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
