"use client";

import { useEffect } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="font-heading text-2xl font-semibold text-[#0A2540]">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Please try again. If the problem continues, refresh the page or contact
        the clinic.
      </p>
      <button
        type="button"
        onClick={reset}
        className={cn(buttonVariants({ variant: "default" }), "mt-6")}
      >
        Try again
      </button>
    </main>
  );
}
