import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("terms");

export const metadata: Metadata = {
  title: "Terms of Use · Image Tools",
  description: "Terms of use for Image Tools.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use · Image Tools",
    description: "Terms of use for Image Tools.",
    type: "website",
    locale: "en_IN",
    siteName: "Image Tools",
    url: "/terms",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Terms of Use · Image Tools",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use · Image Tools",
    description: "Terms of use for Image Tools.",
    images: [OG_IMAGE],
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Terms of Use</h1>
      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Image Tools is provided as-is for personal and professional use. You are
        responsible for ensuring your files and outputs meet legal or portal-specific
        requirements.
      </p>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        We may update tools and features at any time to improve reliability and quality.
      </p>
    </main>
  );
}
