import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}

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
