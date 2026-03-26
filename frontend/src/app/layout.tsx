import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.tech"
  ),
  title: {
    default: "ImgTools — Free Image Converter (India)",
    template: "%s · ImgTools",
  },
  description:
    "Free image converter tools for India: compress, resize, and convert images with no upload. Works on mobile and helps meet government form upload limits.",
  applicationName: "ImgTools",
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
    title: "ImgTools — Free Image Converter (India)",
    description:
      "Free image converter tools for India: compress, resize, and convert images with no upload. Works on mobile and helps meet government form upload limits.",
    locale: "en_IN",
    siteName: "ImgTools",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImgTools — Free Image Converter (India)",
    description:
      "Free image converter tools for India: compress, resize, and convert images with no upload. Works on mobile and helps meet government form upload limits.",
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} h-full antialiased`}
    >
      <body className="site-body min-h-full flex flex-col bg-background text-foreground">
        <div aria-hidden className="grain-overlay" />

        <header className="site-nav-wrap">
          <nav className="site-nav mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link href="/" className="site-logo" aria-label="ImgTools home" prefetch>
              img<span className="logo-dot" />tools
            </Link>

            <div className="site-nav-links" aria-label="Primary">
              <Link href="/" className="site-nav-link" prefetch>
                Home
              </Link>
              <Link href="/compress-image" className="site-nav-link" prefetch>
                Compress
              </Link>
              <Link href="/heic-to-jpg" className="site-nav-link" prefetch>
                HEIC to JPG
              </Link>
              <Link href="/resize-image" className="site-nav-link" prefetch>
                Resize
              </Link>
            </div>

            <Link href="/" className="site-nav-cta" prefetch>
              All tools
            </Link>
          </nav>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="site-footer mt-14">
          <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="footer-top">
              <div>
                <div className="footer-logo">
                  img<span className="footer-dot">.</span>tools
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
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copy">© 2026 ImgTools</p>
              <p className="footer-made">Built for privacy-first image workflows</p>
            </div>
          </div>
        </footer>

        {gaId ? (
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
          </>
        ) : null}
      </body>
    </html>
  );
}
