"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { cn } from "@/lib/utils";

const MAX_TILT_DEG = 7;

export type ServiceCard3DProps = {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
};

export function ServiceCard3D({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  objectPosition = "center",
}: ServiceCard3DProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (reducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      setTilt({
        rotateX: (0.5 - y) * MAX_TILT_DEG * 2,
        rotateY: (x - 0.5) * MAX_TILT_DEG * 2,
      });
    },
    [reducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  const lift = hovered && !reducedMotion ? -8 : 0;
  const rotateX = reducedMotion ? 0 : tilt.rotateX;
  const rotateY = reducedMotion ? 0 : tilt.rotateY;

  return (
    <Link
      ref={cardRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#0A2540] bg-surface shadow-md no-underline",
        "transition-[transform,box-shadow] duration-300 ease-out will-change-transform",
        hovered ? "shadow-xl" : "shadow-md",
        reducedMotion && "hover:-translate-y-1",
        "hover:no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      style={
        reducedMotion
          ? undefined
          : {
              transform: `perspective(1000px) translateY(${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: "preserve-3d",
            }
      }
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            !reducedMotion && "group-hover:scale-[1.03]"
          )}
          style={{ objectPosition }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pb-5 pt-4 text-center sm:px-6 sm:pb-7 sm:pt-6">
        <h3 className="font-heading text-[1.275rem] font-bold leading-snug text-[#0A2540] sm:text-[1.8rem]">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-[1.35rem] font-medium leading-relaxed text-slate-600 sm:mt-3 sm:text-[1.45rem]">
          {description}
        </p>
        <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[1.05rem] font-medium text-primary sm:mt-5">
          Learn more
          <ArrowRight
            className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
