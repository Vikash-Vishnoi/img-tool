import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("about");

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Image Tools, our privacy-first approach, and why we build fast, free image utilities for everyday use.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About",
    description:
      "Learn about Image Tools, our privacy-first approach, and why we build fast, free image utilities for everyday use.",
    type: "website",
    locale: "en_IN",
    siteName: "Image Tools",
    url: "/about",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "About Image Tools",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description:
      "Learn about Image Tools, our privacy-first approach, and why we build fast, free image utilities for everyday use.",
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">About Image Tools</h1>

      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Image Tools is a collection of fast, browser-based utilities to convert,
        compress, and resize images for daily workflows. We built it for people who need
        quick results without complicated software.
      </p>

      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        Our focus is practical use cases: government form uploads, social media sizes,
        PDF conversions, and lightweight image optimization. Most operations are designed
        to run directly on your device, which helps keep your files private.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">What we value</h2>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-[#6b6760]">
        <li>Privacy-first processing whenever possible.</li>
        <li>Simple, mobile-friendly tools that work instantly.</li>
        <li>Clear defaults for common dimensions and file-size limits.</li>
        <li>Free access with no account requirements.</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Who it is for</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        Students, job applicants, creators, and professionals who need reliable image
        utilities without friction. If you need to prepare files for uploads quickly,
        Image Tools is built for that exact task.
      </p>
    </main>
  );
}