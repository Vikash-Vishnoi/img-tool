"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    isActive: (pathname: string) => pathname === "/",
  },
  {
    label: "Compress",
    href: "/compress-image",
    isActive: (pathname: string) => pathname.startsWith("/compress"),
  },
  {
    label: "PDF",
    href: "/image-to-pdf",
    isActive: (pathname: string) => pathname.includes("pdf"),
  },
  {
    label: "HEIC",
    href: "/heic-to-png",
    isActive: (pathname: string) => pathname.startsWith("/heic"),
  },
  {
    label: "Resize",
    href: "/resize-image",
    isActive: (pathname: string) => pathname.startsWith("/resize"),
  },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-nav-wrap">
      <nav className="site-nav mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6">
        <Link href="/" className="site-logo" aria-label="image.tools home" prefetch>
          <span className="logo-word">image</span>
          <span className="logo-dot" aria-hidden />
          <span className="logo-word">tools</span>
        </Link>

        <div className="site-nav-links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              prefetch
              className={`site-nav-link ${item.isActive(pathname) ? "active" : ""}`}
              aria-current={item.isActive(pathname) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/#all-tools" className="site-nav-cta site-nav-cta-desktop" prefetch>
          All tools
        </Link>

        <div className="site-mobile-actions">
          <button
            type="button"
            className="site-mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-main-nav"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-main-nav"
        className={`site-mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
      >
        <div className="site-mobile-menu-inner mx-auto w-full max-w-7xl px-3 sm:px-5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              prefetch
              onClick={() => setIsMobileMenuOpen(false)}
              className={`site-mobile-link ${item.isActive(pathname) ? "active" : ""}`}
              aria-current={item.isActive(pathname) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#all-tools"
            className="site-mobile-link site-mobile-link-cta"
            prefetch
            onClick={() => setIsMobileMenuOpen(false)}
          >
            All tools
          </Link>
        </div>
      </div>
    </header>
  );
}
