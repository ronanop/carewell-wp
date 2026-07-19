"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  FolderOpen,
  Images,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  Palette,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  ADMIN_NAV,
  type AdminNavItem,
} from "@/lib/experience/navigation";
import { cn } from "@/lib/utils";

const ICONS: Record<
  AdminNavItem["icon"],
  ComponentType<{ className?: string }>
> = {
  layoutDashboard: LayoutDashboard,
  fileText: FileText,
  newspaper: Newspaper,
  layers: Layers,
  layoutTemplate: LayoutTemplate,
  clipboardList: ClipboardList,
  stethoscope: Stethoscope,
  messageSquareQuote: MessageSquareQuote,
  images: Images,
  megaphone: Megaphone,
  palette: Palette,
  folderOpen: FolderOpen,
  users: Users,
  settings: Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-small font-semibold text-primary-foreground">
          CW
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-small font-semibold text-foreground">
            Experience Studio
          </p>
          <p className="truncate text-[0.6875rem] text-muted-foreground">
            Care Well Medical Centre
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Studio">
        <ul className="space-y-0.5">
          {ADMIN_NAV.map((item) => {
            const Icon = ICONS[item.icon];
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (item.href === "/admin/pages" &&
                pathname.startsWith("/admin/page-studio")) ||
              (item.href === "/admin/blogs" &&
                pathname.startsWith("/admin/blog-studio"));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-small font-medium no-underline transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:no-underline",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="text-[0.6875rem] text-muted-foreground">
          Presentation only · WordPress owns content
        </p>
      </div>
    </aside>
  );
}
