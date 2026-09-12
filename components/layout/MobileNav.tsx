"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { SiteLogo } from "@/components/brand/SiteLogo";
import {
  MEGA_SERVICE_CATEGORIES,
  type MegaServiceCategory,
} from "@/lib/navigation/services-mega-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/hair-transplant-in-delhi/before-and-after/", label: "Results" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function MobileNav({
  categories = MEGA_SERVICE_CATEGORIES,
}: {
  categories?: MegaServiceCategory[];
}) {
  const menuCategories =
    categories.length > 0 ? categories : MEGA_SERVICE_CATEGORIES;
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setServicesOpen(false);
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const close = () => setOpen(false);

  const trigger = (
    <button
      type="button"
      className="flex size-10 items-center justify-center rounded-full text-[#1A2B48] transition-colors hover:bg-secondary hover:text-primary"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => setOpen((value) => !value)}
    >
      {open ? (
        <X className="size-6" aria-hidden />
      ) : (
        <Menu className="size-6" aria-hidden />
      )}
    </button>
  );

  // Portal only after mount — never touch document during SSR.
  if (!mounted) {
    return <div className="xl:hidden">{trigger}</div>;
  }

  return (
    <div className="xl:hidden">
      {trigger}
      {createPortal(
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 top-0 z-[110] transition-opacity duration-200 lg:top-[7rem] xl:hidden",
            open
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0",
          )}
          aria-hidden={!open}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 z-0 bg-[#0A2540]/40"
            tabIndex={open ? 0 : -1}
            onClick={close}
          />

          <nav
            id={panelId}
            aria-label="Mobile navigation"
            className={cn(
              "absolute inset-y-0 right-0 z-[120] flex min-h-0 w-full max-w-sm flex-col overflow-hidden overscroll-contain border-l border-border bg-background shadow-lg transition-transform duration-200",
              open ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex h-[4.75rem] shrink-0 items-center justify-between border-b border-border px-4 lg:hidden">
              <SiteLogo
                className="max-w-[calc(100%_-_3rem)]"
                tabIndex={open ? undefined : -1}
              />
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#1A2B48] transition-colors hover:bg-secondary hover:text-primary"
                aria-label="Close menu"
                tabIndex={open ? 0 : -1}
                onClick={close}
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <ul className="flex flex-col gap-1 px-4 py-5">
                {NAV_LINKS.slice(0, 2).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-[#1A2B48] no-underline transition-colors hover:bg-secondary hover:text-primary hover:no-underline"
                      tabIndex={open ? undefined : -1}
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-[#1A2B48] transition-colors hover:bg-secondary hover:text-primary"
                    aria-expanded={servicesOpen}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setServicesOpen((value) => !value)}
                  >
                    Services
                    <ChevronDown
                      className={cn(
                        "size-4 opacity-70 transition-transform duration-200",
                        servicesOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-200",
                      servicesOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ul className="ml-3 space-y-3 border-l border-border/70 py-2 pl-3">
                        {menuCategories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={category.href}
                              prefetch={false}
                              className="block px-2 py-1.5 text-[0.875rem] font-semibold text-[#0A2540] no-underline hover:text-primary hover:no-underline"
                              tabIndex={open ? undefined : -1}
                              onClick={close}
                            >
                              {category.title}
                            </Link>
                            <ul className="mt-1 space-y-2">
                              {category.groups.map((group, groupIndex) => (
                                <li key={`${category.id}-${group.title ?? groupIndex}`}>
                                  {group.title && group.href ? (
                                    <Link
                                      href={group.href}
                                      prefetch={false}
                                      className="block rounded-md px-2 py-1 text-[0.75rem] font-semibold text-[#475569] no-underline hover:bg-secondary hover:text-primary hover:underline"
                                      tabIndex={open ? undefined : -1}
                                      onClick={close}
                                    >
                                      {group.title}
                                    </Link>
                                  ) : null}
                                  <ul className="space-y-0.5">
                                    {group.links.map((item) => (
                                      <li key={item.href + item.label}>
                                        <Link
                                          href={item.href}
                                          prefetch={false}
                                          className="block rounded-md px-2 py-1.5 text-[0.8125rem] text-[#334155] no-underline hover:bg-secondary hover:text-primary hover:no-underline"
                                          tabIndex={open ? undefined : -1}
                                          onClick={close}
                                        >
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                        <li>
                          <Link
                            href="/services"
                            prefetch={false}
                            className="block px-2 py-2 text-[0.8125rem] font-medium text-primary no-underline hover:underline"
                            tabIndex={open ? undefined : -1}
                            onClick={close}
                          >
                            View all services
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>

                {NAV_LINKS.slice(2).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-[#1A2B48] no-underline transition-colors hover:bg-secondary hover:text-primary hover:no-underline"
                      tabIndex={open ? undefined : -1}
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}
