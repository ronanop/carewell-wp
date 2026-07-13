/**
 * Navigation config for Experience Studio sidebar.
 */

export type AdminNavItem = {
  label: string;
  href: string;
  icon:
    | "layoutDashboard"
    | "fileText"
    | "layoutTemplate"
    | "stethoscope"
    | "messageSquareQuote"
    | "images"
    | "megaphone"
    | "palette"
    | "folderOpen"
    | "users"
    | "settings";
};

export const ADMIN_NAV: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layoutDashboard" },
  { label: "Pages", href: "/admin/pages", icon: "fileText" },
  { label: "Templates", href: "/admin/templates", icon: "layoutTemplate" },
  { label: "Doctors", href: "/admin/doctors", icon: "stethoscope" },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: "messageSquareQuote",
  },
  { label: "Gallery", href: "/admin/gallery", icon: "images" },
  { label: "CTA Manager", href: "/admin/cta", icon: "megaphone" },
  { label: "Theme", href: "/admin/theme", icon: "palette" },
  { label: "Media", href: "/admin/media", icon: "folderOpen" },
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
] as const;
