"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  FileStack,
  FileText,
  LayoutDashboard,
  Menu,
  Stethoscope,
  Users,
  UserRoundSearch,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  {
    href: "/admin",
    label: "Dashboard",
    exact: true,
    icon: LayoutDashboard,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    exact: false,
    icon: UserRoundSearch,
  },
  {
    href: "/admin/menu",
    label: "Services menu",
    exact: false,
    icon: Menu,
  },
  {
    href: "/admin/services",
    label: "Services",
    exact: false,
    icon: Stethoscope,
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    exact: false,
    icon: BookOpen,
  },
  {
    href: "/admin/pages",
    label: "Pages",
    exact: false,
    icon: FileText,
  },
  {
    href: "/admin/users",
    label: "Users",
    exact: false,
    icon: Users,
  },
  {
    href: "/admin/content",
    label: "Website content",
    exact: false,
    icon: FileStack,
  },
] as const;

export function AdminNav() {
  const pathname = usePathname() || "/admin";

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3" aria-label="Admin">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href || pathname === `${item.href}/`
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors hover:no-underline",
              active
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-100 hover:text-primary",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}

      <div className="my-2 border-t border-slate-200/80" />

      <Link
        href="/"
        title="View site"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 no-underline transition-colors hover:bg-slate-100 hover:text-primary hover:no-underline"
      >
        <ExternalLink className="size-4 shrink-0" aria-hidden />
        <span className="truncate">View site</span>
      </Link>
    </nav>
  );
}
