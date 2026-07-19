import Link from "next/link";

import { SiteLogo } from "@/components/brand/SiteLogo";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavbarCtaButton } from "@/components/layout/NavbarCtaButton";
import {
  MegaMenuProvider,
  ServicesMegaMenuPanel,
  ServicesMegaMenuTrigger,
} from "@/components/layout/ServicesMegaMenu";

export function NavbarPlaceholder() {
  return (
    <MegaMenuProvider>
      <header className="navbar-compact relative sticky top-0 z-sticky border-b border-border bg-background/95">
        <div className="container-content relative flex h-[4.75rem] items-center justify-between gap-6">
          <SiteLogo />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 xl:flex"
          >
            <Link
              href="/"
              className="text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:text-primary hover:no-underline"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:text-primary hover:no-underline"
            >
              About
            </Link>
            <ServicesMegaMenuTrigger />
            <Link
              href="/results"
              className="text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:text-primary hover:no-underline"
            >
              Results
            </Link>
            <Link
              href="/blogs"
              className="text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:text-primary hover:no-underline"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-[0.9375rem] font-medium text-[#1A2B48] no-underline transition-colors hover:text-primary hover:no-underline"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <MobileNav />
            <NavbarCtaButton />
          </div>
        </div>

        <ServicesMegaMenuPanel />
      </header>
    </MegaMenuProvider>
  );
}
