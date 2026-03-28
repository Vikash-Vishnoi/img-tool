import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("privacy-policy");

export const metadata: Metadata = {
  title: "Privacy Policy — How Image Tools Protects Your Data",
  description:
    "Learn how Image Tools protects your data with browser-first processing, minimal analytics, and transparent privacy practices for free image utilities.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy — How Image Tools Protects Your Data",
    description:
      "Learn how Image Tools protects your data with browser-first processing, minimal analytics, and transparent privacy practices for free image utilities.",
    type: "website",
    locale: "en_IN",
    siteName: "Image Tools",
    url: "/privacy-policy",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Privacy Policy · Image Tools",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — How Image Tools Protects Your Data",
    description:
      "Learn how Image Tools protects your data with browser-first processing, minimal analytics, and transparent privacy practices for free image utilities.",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Privacy Policy</h1>
      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Image Tools processes conversions in your browser whenever possible. We do not
        require account creation and do not store uploaded images on our servers.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">What data we collect</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        We may collect limited technical data such as browser type, page views, and
        performance metrics to improve reliability. We do not require account data for
        normal use.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">How files are handled</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        File processing is designed to happen on your device whenever possible. Your
        uploaded images are not intended to be stored on our servers as part of standard
        tool usage.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Your choices and consent</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        By using this site, you agree to this privacy policy. If you do not agree, stop
        using the service. We may update this policy to reflect product and legal changes.
      </p>
    </div>
  );
}
