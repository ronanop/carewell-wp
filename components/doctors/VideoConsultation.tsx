import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DoctorProfile } from "@/types/doctor";

interface VideoConsultationProps {
  content: DoctorProfile["videoConsultation"];
}

function hasLocalImage(src: string) {
  if (!src.startsWith("/")) return true;
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function VideoConsultation({ content }: VideoConsultationProps) {
  const showPreview = hasLocalImage(content.previewImage);
  const hasYoutube = content.youtubeId.trim().length > 0;

  return (
    <section className="bg-muted/20" aria-labelledby="video-consult-heading">
      <div className="container-content section-padding">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <p className="text-label uppercase text-[#3B82F6]">
              {content.overline}
            </p>
            <h2
              id="video-consult-heading"
              className="mt-3 font-heading text-h2 font-bold text-[#0A2540]"
            >
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl text-body leading-relaxed text-muted-foreground">
              {content.description}
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-lg bg-[#0A2540] text-white hover:bg-[#0A2540]/90 no-underline hover:no-underline"
                )}
              >
                Book Consultation
              </Link>
            </div>
          </div>

          <div
            className={cn(
              "relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-surface",
              "shadow-[0_8px_30px_rgb(10_37_64/0.08)]"
            )}
          >
            {hasYoutube ? (
              <iframe
                title="Video consultation preview"
                src={`https://www.youtube-nocookie.com/embed/${content.youtubeId}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <>
                {showPreview ? (
                  <Image
                    src={content.previewImage}
                    alt="Video consultation preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40rem"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#123A5C] to-[#1B6B8A]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-[#0A2540] shadow-md">
                    <Play className="size-7 fill-current" aria-hidden />
                  </span>
                  <span className="sr-only">YouTube preview placeholder</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
