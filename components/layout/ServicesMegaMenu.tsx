"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  MEGA_SERVICE_CATEGORIES,
  type MegaServiceCategory,
} from "@/lib/navigation/services-mega-menu";
import { cn } from "@/lib/utils";

const CATEGORY_IMAGES: Record<string, string> = {
  hair: "/images/hero-portrait.png",
  skin: "/images/hero-model.png",
  surgical: "/images/hero-portrait.png",
  wellness: "/images/hero-background.png",
};

type MegaMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMenu: () => void;
  scheduleClose: () => void;
  activeId: string;
  setActiveId: (id: string) => void;
  activeCategory: MegaServiceCategory;
  panelId: string;
};

const MegaMenuContext = createContext<MegaMenuContextValue | null>(null);

function useMegaMenu() {
  const context = useContext(MegaMenuContext);
  if (!context) {
    throw new Error("Services mega menu components require MegaMenuProvider");
  }
  return context;
}

export function MegaMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(MEGA_SERVICE_CATEGORIES[0].id);
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }, [clearCloseTimer]);

  const activeCategory =
    MEGA_SERVICE_CATEGORIES.find((category) => category.id === activeId) ??
    MEGA_SERVICE_CATEGORIES[0];

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openMenu,
      scheduleClose,
      activeId,
      setActiveId,
      activeCategory,
      panelId,
    }),
    [
      open,
      openMenu,
      scheduleClose,
      activeId,
      activeCategory,
      panelId,
    ]
  );

  return (
    <MegaMenuContext.Provider value={value}>{children}</MegaMenuContext.Provider>
  );
}

function FeatureCard({ category }: { category: MegaServiceCategory }) {
  const imageSrc = CATEGORY_IMAGES[category.id] ?? "/images/hero-model.png";

  return (
    <aside className="flex h-full min-h-[22rem] w-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm lg:max-w-[15.5rem]">
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-secondary">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center transition-opacity duration-300"
          sizes="250px"
        />
      </div>
      <div className="flex flex-1 flex-col bg-[#E8F4F8] px-4 py-4">
        <p className="text-[0.9375rem] font-semibold text-[#0A2540]">
          {category.title}
        </p>
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[#4B5563]">
          {category.description}
        </p>
      </div>
    </aside>
  );
}

function ServiceColumn({
  category,
  isActive,
  onActivate,
}: {
  category: MegaServiceCategory;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg px-1 py-1 transition-colors",
        isActive && "bg-primary/[0.03]"
      )}
      onMouseEnter={onActivate}
      onFocusCapture={onActivate}
    >
      <Link
        href={category.href}
        className="block border-b border-border/70 pb-2 text-[0.9375rem] font-semibold text-[#0A2540] no-underline hover:text-primary hover:no-underline"
        onFocus={onActivate}
      >
        {category.title}
      </Link>
      <div className="mt-3 space-y-4">
        {category.groups.map((group, groupIndex) => (
          <div key={`${category.id}-${group.title ?? groupIndex}`}>
            {group.title ? (
              <p className="mb-1.5 text-[0.75rem] font-semibold text-[#475569]">
                {group.title}
              </p>
            ) : null}
            <ul className="space-y-1">
              {group.links.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="group/link inline-flex items-start gap-1.5 text-[0.8125rem] leading-snug text-[#334155] no-underline transition-colors hover:text-primary hover:no-underline"
                    onFocus={onActivate}
                  >
                    <ChevronRight
                      className="mt-0.5 size-3.5 shrink-0 text-[#7DD3E8] transition-colors group-hover/link:text-primary"
                      aria-hidden
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesMegaMenuTrigger() {
  const { open, setOpen, openMenu, scheduleClose, panelId } = useMegaMenu();

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-[0.9375rem] font-medium text-[#1A2B48] transition-colors hover:text-primary",
          open && "text-primary"
        )}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        Services
        <ChevronDown
          className={cn(
            "size-3.5 opacity-70 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
    </div>
  );
}

export function ServicesMegaMenuPanel() {
  const {
    open,
    setOpen,
    openMenu,
    scheduleClose,
    activeId,
    setActiveId,
    activeCategory,
    panelId,
  } = useMegaMenu();

  return (
    <div
      id={panelId}
      role="region"
      aria-label="Services menu"
      className={cn(
        "absolute inset-x-0 top-full z-dropdown border-b border-border bg-background/98 shadow-lg backdrop-blur-sm transition-all duration-200",
        open
          ? "pointer-events-auto visible translate-y-0 opacity-100"
          : "pointer-events-none invisible -translate-y-1 opacity-0"
      )}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div className="container-content py-6 md:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:items-start">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
            {MEGA_SERVICE_CATEGORIES.map((category) => (
              <ServiceColumn
                key={category.id}
                category={category}
                isActive={activeId === category.id}
                onActivate={() => setActiveId(category.id)}
              />
            ))}
          </div>
          <FeatureCard category={activeCategory} />
        </div>

        <div className="mt-6 flex justify-end border-t border-border pt-4">
          <Link
            href="/services"
            className="text-small font-medium text-primary no-underline hover:underline"
            onClick={() => setOpen(false)}
          >
            View all services
          </Link>
        </div>
      </div>
    </div>
  );
}
