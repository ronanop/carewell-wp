"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHRASES = ["Book Free Consultation", "With 20+ Years of Trust"] as const;

const TYPE_MS = 55;
const DELETE_MS = 35;
const HOLD_MS = 2200;

export function NavbarCtaButton() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), HOLD_MS);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % PHRASES.length);
      }, 280);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? fullText.slice(0, displayText.length - 1)
              : fullText.slice(0, displayText.length + 1)
          );
        },
        isDeleting ? DELETE_MS : TYPE_MS
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <Link
      href="/contact"
      className={cn(
        buttonVariants(),
        "relative hidden min-w-[13.5rem] justify-start overflow-hidden rounded-full bg-[#0A2540] px-5 text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline sm:inline-flex"
      )}
      aria-label="Book Free Consultation"
    >
      <span className="inline-flex items-center whitespace-nowrap">
        {displayText}
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-white/80"
        />
      </span>
    </Link>
  );
}
