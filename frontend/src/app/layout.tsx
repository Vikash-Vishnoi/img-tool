import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Syne } from "next/font/google";
import { DeferredAnalytics } from "../components/DeferredAnalytics";
import { DeferredFooterStyles } from "@/components/DeferredFooterStyles";
import SiteHeader from "@/components/SiteHeader";
import { getOgSvgPath } from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "optional",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

const SITE_TITLE = "Image Tools — Free Image Converter";
const SITE_DESCRIPTION =
  "Free image converter tools: compress, resize, and convert images with no upload. Works on mobile and helps meet government form upload limits.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://image-tools.tech";
const NORMALIZED_SITE_URL = SITE_URL.replace(/\/$/, "");
const TWITTER_CREATOR = process.env.NEXT_PUBLIC_TWITTER_CREATOR ?? "@imagetoolstech";
const HOME_OG_IMAGE = getOgSvgPath("home");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s",
  },
  alternates: {
    canonical: `${NORMALIZED_SITE_URL}/`,
  },
  description: SITE_DESCRIPTION,
  applicationName: "Image Tools",
  keywords: [
    "image converter",
    "compress image whatsapp",
    "heic to jpg",
    "passport size photo resize",
    "resize image online free",
    "image tools free",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: NORMALIZED_SITE_URL,
    locale: "en",
    siteName: "Image Tools",
    images: [
      {
        url: HOME_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Image Tools — Free Image Converter",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: TWITTER_CREATOR,
    images: [HOME_OG_IMAGE],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
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

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Image Tools",
    url: NORMALIZED_SITE_URL,
    description: "Free image converter tools",
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${NORMALIZED_SITE_URL}/image-converter?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Image Tools",
    url: NORMALIZED_SITE_URL,
    logo: `${NORMALIZED_SITE_URL}/icon.png`,
    sameAs: [],
  };

  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Image Tools",
    url: NORMALIZED_SITE_URL,
    description:
      "Free image converter tools — compress, resize, convert HEIC, JPG, PNG, WebP, AVIF",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    featureList: [
      "HEIC to JPG conversion",
      "Image compression for WhatsApp",
      "Passport photo resize",
      "No file upload required",
      "Works on Android and iPhone",
    ],
    inLanguage: ["en", "hi"],
    countryOfOrigin: "IN",
  };

  const siteNavigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: [
      "HEIC to JPG",
      "Compress Image",
      "Resize Image",
      "Image Converter",
      "Image to PDF",
      "PDF to Image",
      "Blog",
      "About",
      "Privacy Policy",
      "Terms of Use",
      "Disclaimer",
    ],
    url: [
      `${NORMALIZED_SITE_URL}/heic-to-jpg`,
      `${NORMALIZED_SITE_URL}/compress-image`,
      `${NORMALIZED_SITE_URL}/resize-image`,
      `${NORMALIZED_SITE_URL}/image-converter`,
      `${NORMALIZED_SITE_URL}/image-to-pdf`,
      `${NORMALIZED_SITE_URL}/pdf-to-image`,
      `${NORMALIZED_SITE_URL}/blog`,
      `${NORMALIZED_SITE_URL}/about`,
      `${NORMALIZED_SITE_URL}/privacy-policy`,
      `${NORMALIZED_SITE_URL}/terms`,
      `${NORMALIZED_SITE_URL}/disclaimer`,
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} h-full antialiased`}
    >
      <body className="site-body min-h-full flex flex-col bg-background text-foreground">
        <script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          id="schema-navigation"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
        />
        <script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          id="schema-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
        />

        <div aria-hidden className="grain-overlay" />

        <SiteHeader />

        <main className="flex-1">{children}</main>

        <footer className="site-footer mt-14">
          <DeferredFooterStyles />
          <div className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-5 lg:px-6">
            <div className="footer-top">
              <div>
                <div className="footer-logo" role="img" aria-label="Image Tools">
                  <span className="footer-logo-word" aria-hidden>image</span>
                  <span className="footer-dot" aria-hidden />
                  <span className="footer-logo-word" aria-hidden>tools</span>
                </div>
                <div className="footer-tag">Free image tools. Forever.</div>
              </div>

              <div className="footer-grid">
                <div>
                  <div className="footer-col-title">Tools</div>
                  <Link href="/heic-to-jpg" className="footer-link" prefetch={false}>
                    HEIC to JPG
                  </Link>
                  <Link href="/compress-image" className="footer-link" prefetch={false}>
                    Compress Image
                  </Link>
                  <Link href="/resize-image" className="footer-link" prefetch={false}>
                    Resize Image
                  </Link>
                  <Link href="/png-to-webp" className="footer-link" prefetch={false}>
                    PNG to WebP
                  </Link>
                </div>
                <div>
                  <div className="footer-col-title">Site</div>
                  <Link href="/" className="footer-link" prefetch={false}>
                    All tools
                  </Link>
                  <Link href="/about" className="footer-link" prefetch={false}>
                    About
                  </Link>
                  <Link href="/blog" className="footer-link" prefetch={false}>
                    Blog
                  </Link>
                  <Link href="/image-to-pdf" className="footer-link" prefetch={false}>
                    Image to PDF
                  </Link>
                </div>
                <div>
                  <div className="footer-col-title">Utility</div>
                  <Link href="/feedback" className="footer-link" prefetch={false}>
                    Feedback Form
                  </Link>
                  <Link href="/disclaimer" className="footer-link" prefetch={false}>
                    Disclaimer
                  </Link>
                  <Link href="/privacy-policy" className="footer-link" prefetch={false}>
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="footer-link" prefetch={false}>
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
          <DeferredAnalytics gaId={gaId} />
        ) : null}
      </body>
    </html>
  );
}
