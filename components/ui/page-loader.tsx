import Image from "next/image";

export function PageLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Image
        src="/page-loading-animation.gif"
        alt=""
        width={200}
        height={200}
        unoptimized
        priority
        aria-hidden="true"
      />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
