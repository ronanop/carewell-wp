"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { emitEditorialEvent } from "@/lib/experience/blog/editorial/analytics";
import { cn } from "@/lib/utils";
import type { BlogDocument } from "@/types/blog-document";

export function BlogBreadcrumb({
  items,
  className,
  tone = "default",
}: {
  items: BlogDocument["breadcrumbs"];
  className?: string;
  /** `on-dark` keeps links white on dark heroes (e.g. TreatmentHero). */
  tone?: "default" | "on-dark";
}) {
  const onDark = tone === "on-dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "text-sm",
        onDark ? "text-white/70" : "text-muted-foreground",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {last ? (
                <span className="line-clamp-1 opacity-90">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className={
                    onDark ? "text-white/70 hover:text-white" : "hover:text-primary"
                  }
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BlogShareBar({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url });
    }
  }

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      channel: "whatsapp",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      channel: "linkedin",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      channel: "facebook",
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      channel: "x",
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            emitEditorialEvent({ type: "share_clicked", channel: link.channel })
          }
          className="rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur transition hover:border-primary/40 hover:text-primary"
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          void copyLink();
          emitEditorialEvent({ type: "share_clicked", channel: "copy" });
        }}
        className="rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur transition hover:border-primary/40"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
      {canNativeShare ? (
        <button
          type="button"
          onClick={() => {
            void nativeShare();
            emitEditorialEvent({ type: "share_clicked", channel: "native" });
          }}
          className="rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-xs font-medium"
        >
          Share
        </button>
      ) : null}
    </div>
  );
}
