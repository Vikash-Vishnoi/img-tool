"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HeaderDropdown = {
  key: string;
  label: string;
  isActive: (pathname: string) => boolean;
  links: Array<{ label: string; href: string }>;
};

const HEADER_DROPDOWNS: HeaderDropdown[] = [
  {
    key: "convert",
    label: "Convert",
    isActive: (pathname) =>
      pathname.startsWith("/image-converter") ||
      pathname.includes("-to-") ||
      pathname.startsWith("/heic") ||
      pathname.startsWith("/heif"),
    links: [
      { label: "Image Converter", href: "/image-converter" },
      { label: "PNG to JPG", href: "/png-to-jpg" },
      { label: "JPG to PNG", href: "/jpg-to-png" },
      { label: "HEIC to JPG", href: "/heic-to-jpg" },
      { label: "WebP to PNG", href: "/webp-to-png" },
    ],
  },
  {
    key: "pdf",
    label: "PDF",
    isActive: (pathname) => pathname.includes("pdf"),
    links: [
      { label: "Image to PDF", href: "/image-to-pdf" },
      { label: "PDF to Image", href: "/pdf-to-image" },
    ],
  },
  {
    key: "compress",
    label: "Compress",
    isActive: (pathname) => pathname.startsWith("/compress"),
    links: [
      { label: "Compress Image", href: "/compress-image" },
      { label: "Compress JPG", href: "/compress-jpg" },
      { label: "Compress PNG", href: "/compress-png" },
      { label: "Compress WebP", href: "/compress-webp" },
      { label: "Compress HEIC", href: "/compress-heic" },
    ],
  },
  {
    key: "resize",
    label: "Resize",
    isActive: (pathname) => pathname.startsWith("/resize"),
    links: [
      { label: "Resize Image", href: "/resize-image" },
      { label: "Resize to 200KB", href: "/resize-image-to-200kb" },
      { label: "Passport Photo", href: "/resize-passport-photo" },
      { label: "WhatsApp DP", href: "/resize-whatsapp-dp" },
      { label: "YouTube Thumbnail", href: "/resize-youtube-thumbnail" },
    ],
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!openDropdown) return;
      const target = event.target as Node;
      if (navRef.current?.contains(target)) return;
      setOpenDropdown(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [openDropdown]);

  const isDesktopViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (groupKey: string) => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown((prev) => (prev === groupKey ? null : prev));
      closeTimerRef.current = null;
    }, 160);
  };

  return (
    <header ref={navRef} className="site-nav-wrap">
      <nav className="site-nav mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6">
        <Link
          href="/"
          className="site-logo"
          aria-label="image.tools home"
          prefetch
          onClick={() => {
            setIsMobileMenuOpen(false);
            setOpenDropdown(null);
          }}
        >
          <span className="logo-word">image</span>
          <span className="logo-dot" aria-hidden />
          <span className="logo-word">tools</span>
        </Link>

        <div className="site-nav-links flex items-center gap-2" aria-label="Primary">
          <Link
            href="/"
            prefetch
            onClick={() => {
              setIsMobileMenuOpen(false);
              setOpenDropdown(null);
            }}
            className={`site-nav-link ${pathname === "/" ? "active" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>

          {HEADER_DROPDOWNS.map((group) => (
            <div
              key={group.key}
              className="relative"
              onMouseEnter={() => {
                if (!isDesktopViewport()) return;
                clearCloseTimer();
                setOpenDropdown(group.key);
              }}
              onMouseLeave={() => {
                if (!isDesktopViewport()) return;
                scheduleClose(group.key);
              }}
            >
              <button
                type="button"
                className={`site-nav-link inline-flex items-center gap-1 ${group.isActive(pathname) ? "active" : ""}`}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === group.key ? null : group.key))
                }
                aria-expanded={openDropdown === group.key}
                aria-haspopup="menu"
              >
                {group.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {openDropdown === group.key ? (
                <div className="absolute left-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-[#d4cfc4] bg-white p-1.5 shadow-[0_12px_28px_rgba(28,26,20,0.14)]">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch
                      className={`block rounded-lg px-3 py-2 text-sm font-semibold text-[#1c1a14] transition hover:bg-[#fff7f2] ${
                        pathname === link.href ? "bg-[#fff7f2] text-[#e8672a]" : ""
                      }`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Link
          href="/#all-tools"
          className="site-nav-cta site-nav-cta-desktop"
          prefetch
          onClick={() => {
            setIsMobileMenuOpen(false);
            setOpenDropdown(null);
          }}
        >
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
          <Link
            href="/"
            prefetch
            onClick={() => setIsMobileMenuOpen(false)}
            className={`site-mobile-link ${pathname === "/" ? "active" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>

          {HEADER_DROPDOWNS.map((group) => (
            <div key={group.key} className="mt-2">
              <div className="px-1 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#6b6760]">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`site-mobile-link ${pathname === link.href ? "active" : ""}`}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
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
