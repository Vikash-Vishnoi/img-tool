import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Syne } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import GoogleAnalyticsPageView from "@/components/GoogleAnalyticsPageView";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const SITE_TITLE = "Image Tools — Free Image Converter (India)";
const SITE_DESCRIPTION =
  "Free image converter tools for India: compress, resize, and convert images with no upload. Works on mobile and helps meet government form upload limits.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://image-tools.tech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Image Tools",
  },
  alternates: {
    canonical: "/",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Image Tools",
  keywords: [
    "image converter",
    "compress image",
    "resize image",
    "passport size photo india",
    "government form upload",
    "no upload",
    "free",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_IN",
    siteName: "Image Tools",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Image Tools - Convert, compress, and resize images",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = (process.env.NEXT_PUBLIC_GA_ID ?? "").trim();
  const hasValidGaId = /^G-[A-Z0-9]+$/i.test(gaId);
  const currentYear = new Date().getFullYear();
  const cleanSiteUrl = SITE_URL.replace(/\/$/, "");

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Image Tools",
    url: cleanSiteUrl,
    inLanguage: "en-IN",
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Image Tools",
    url: cleanSiteUrl,
    logo: `${cleanSiteUrl}/icon.svg`,
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} h-full antialiased`}
    >
      <body className="site-body min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        <div aria-hidden className="grain-overlay" />

        <SiteHeader />

        <div className="flex-1">{children}</div>

        <footer className="site-footer mt-14">
          <div className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-5 lg:px-6">
            <div className="footer-top">
              <div>
                <div className="footer-logo">
                  <span className="footer-logo-word">image</span>
                  <span className="footer-dot" aria-hidden />
                  <span className="footer-logo-word">tools</span>
                </div>
                <div className="footer-tag">Free image tools. Forever.</div>
              </div>

              <div className="footer-grid">
                <div>
                  <div className="footer-col-title">Tools</div>
                  <Link href="/heic-to-jpg" className="footer-link" prefetch>
                    HEIC to JPG
                  </Link>
                  <Link href="/compress-image" className="footer-link" prefetch>
                    Compress Image
                  </Link>
                  <Link href="/resize-image" className="footer-link" prefetch>
                    Resize Image
                  </Link>
                  <Link href="/png-to-webp" className="footer-link" prefetch>
                    PNG to WebP
                  </Link>
                </div>
                <div>
                  <div className="footer-col-title">Site</div>
                  <Link href="/" className="footer-link" prefetch>
                    All tools
                  </Link>
                  <Link href="/image-to-pdf" className="footer-link" prefetch>
                    Image to PDF
                  </Link>
                </div>
                <div>
                  <div className="footer-col-title">Utility</div>
                  <Link href="/feedback" className="footer-link" prefetch>
                    Feedback Form
                  </Link>
                  <Link href="/privacy-policy" className="footer-link" prefetch>
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="footer-link" prefetch>
                    Terms of Use
                  </Link>
                  <a href="mailto:support@image-tools.tech" className="footer-link">
                    Contact
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copy">© {currentYear} Image Tools</p>
              <p className="footer-made">Built for privacy-first image workflows</p>
            </div>
          </div>
        </footer>

        {hasValidGaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-gtag" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
            </Script>
            <Suspense fallback={null}>
              <GoogleAnalyticsPageView gaId={gaId} />
            </Suspense>
          </>
        ) : null}
      </body>
    </html>
  );
}
