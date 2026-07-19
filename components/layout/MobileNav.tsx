"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MEGA_SERVICE_CATEGORIES } from "@/lib/navigation/services-mega-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/results", label: "Results" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

/** Matches `.navbar-compact` zoom so the portal clears the sticky header. */
const HEADER_CLEARANCE = "calc(4.75rem * 0.88)";

export function MobileNav() {
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
            "fixed inset-x-0 bottom-0 z-[100] transition-opacity duration-200 xl:hidden",
            open
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0",
          )}
          style={{ top: HEADER_CLEARANCE }}
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
              "absolute inset-y-0 right-0 z-[110] flex w-full max-w-sm flex-col overflow-y-auto border-l border-border bg-background shadow-lg transition-transform duration-200",
              open ? "translate-x-0" : "translate-x-full",
            )}
          >
            <ul className="flex flex-col gap-1 px-4 py-5">
              {NAV_LINKS.slice(0, 2).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:bg-secondary hover:text-primary hover:no-underline"
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
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[0.9375rem] font-medium text-[#1A2B48] transition-colors hover:bg-secondary hover:text-primary"
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
                    "overflow-hidden transition-[max-height,opacity] duration-200",
                    servicesOpen
                      ? "max-h-[40rem] opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  <ul className="ml-3 space-y-3 border-l border-border/70 py-2 pl-3">
                    {MEGA_SERVICE_CATEGORIES.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={category.href}
                          className="block px-2 py-1.5 text-[0.875rem] font-semibold text-[#0A2540] no-underline hover:text-primary hover:no-underline"
                          tabIndex={open ? undefined : -1}
                          onClick={close}
                        >
                          {category.title}
                        </Link>
                        <ul className="mt-1 space-y-0.5">
                          {category.groups.flatMap((group) =>
                            group.links.map((link) => (
                              <li key={link.href + link.label}>
                                <Link
                                  href={link.href}
                                  className="block rounded-md px-2 py-1.5 text-[0.8125rem] text-[#334155] no-underline hover:bg-secondary hover:text-primary hover:no-underline"
                                  tabIndex={open ? undefined : -1}
                                  onClick={close}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            )),
                          )}
                        </ul>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/services"
                        className="block px-2 py-2 text-[0.8125rem] font-medium text-primary no-underline hover:underline"
                        tabIndex={open ? undefined : -1}
                        onClick={close}
                      >
                        View all services
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              {NAV_LINKS.slice(2).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-3 text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:bg-secondary hover:text-primary hover:no-underline"
                    tabIndex={open ? undefined : -1}
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>,
        document.body,
      )}
    </div>
  );
}
