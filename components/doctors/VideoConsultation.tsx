import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";

import { DoctorReveal } from "@/components/doctors/DoctorReveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DoctorProfile } from "@/types/doctor";

interface VideoConsultationProps {
  content: DoctorProfile["videoConsultation"];
}

function resolvePreviewSrc(src: string) {
  if (!src.startsWith("/")) return src;
  const relative = src.replace(/^\//, "");
  if (existsSync(path.join(process.cwd(), "public", relative))) return src;
  const portraitPng = "/images/dr-sandeep-bhasin-portrait.png";
  if (
    existsSync(
      path.join(process.cwd(), "public", "images", "dr-sandeep-bhasin-portrait.png"),
    )
  ) {
    return portraitPng;
  }
  return null;
}

export function VideoConsultation({ content }: VideoConsultationProps) {
  const previewSrc = resolvePreviewSrc(content.previewImage);
  const hasYoutube = content.youtubeId.trim().length > 0;

  return (
    <section
      className="bg-surface-cream"
      aria-labelledby="video-consult-heading"
    >
      <div className="container-content section-padding">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <DoctorReveal from="left" className="min-w-0">
            <p className="text-label uppercase tracking-[0.16em] text-accent-gold-600">
              {content.overline}
            </p>
            <h2
              id="video-consult-heading"
              className="mt-3 font-heading text-h2 font-bold tracking-tight text-[#0A2540]"
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
                  "h-12 rounded-lg bg-primary px-7 text-primary-foreground hover:bg-primary-800 no-underline hover:no-underline",
                )}
              >
                Book Consultation
              </Link>
            </div>
          </DoctorReveal>

          <DoctorReveal from="right" delay={0.06}>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-primary-900 ring-1 ring-primary-900/10">
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
                  {previewSrc ? (
                    <Image
                      src={previewSrc}
                      alt="Video consultation preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40rem"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-primary-950/40">
                    <span className="flex size-16 items-center justify-center rounded-full bg-white text-primary-800 shadow-md">
                      <Play className="size-7 fill-current" aria-hidden />
                    </span>
                    <span className="sr-only">YouTube preview placeholder</span>
                  </div>
                </>
              )}
            </div>
          </DoctorReveal>
        </div>
      </div>
    </section>
  );
}
