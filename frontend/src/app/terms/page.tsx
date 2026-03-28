import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("terms");

export const metadata: Metadata = {
  title: "Terms of Use — Image Tools Free Online Utilities",
  description:
    "Read the terms for using Image Tools, including acceptable use, output responsibility, and service limitations for our free browser-based image utilities.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Use — Image Tools Free Online Utilities",
    description:
      "Read the terms for using Image Tools, including acceptable use, output responsibility, and service limitations for our free browser-based image utilities.",
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
    title: "Terms of Use — Image Tools Free Online Utilities",
    description:
      "Read the terms for using Image Tools, including acceptable use, output responsibility, and service limitations for our free browser-based image utilities.",
    images: [OG_IMAGE],
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Terms of Use</h1>
      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Image Tools is provided as-is for personal and professional use. You are
        responsible for ensuring your files and outputs meet legal or portal-specific
        requirements.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Acceptable use</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        You may use Image Tools for lawful personal, educational, and business needs.
        Do not use the service for abusive, fraudulent, or unlawful content processing.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Output responsibility</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        You are responsible for checking output dimensions, quality, and file-size
        requirements before submitting to any government portal, employer system, or
        social platform.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Service limitations</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        We may update tools and features at any time to improve reliability and quality.
        Availability, browser support, and performance can vary by device and network.
      </p>
    </div>
  );
}
