import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("feedback");

export const metadata: Metadata = {
  title: "Share Feedback — Help Us Improve Image Tools",
  description:
    "Share your feedback about Image Tools, report issues, and suggest new converters or presets to help us improve speed, quality, and usability for everyone.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    title: "Share Feedback — Help Us Improve Image Tools",
    description:
      "Share your feedback about Image Tools, report issues, and suggest new converters or presets to help us improve speed, quality, and usability for everyone.",
    type: "website",
    locale: "en_IN",
    siteName: "Image Tools",
    url: "/feedback",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Feedback · Image Tools",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Share Feedback — Help Us Improve Image Tools",
    description:
      "Share your feedback about Image Tools, report issues, and suggest new converters or presets to help us improve speed, quality, and usability for everyone.",
    images: [OG_IMAGE],
  },
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Feedback</h1>
      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Help us improve Image Tools by sharing your feedback and feature requests.
      </p>
      <a
        href="https://forms.gle/TxrvRg69ZH1qeGMA9"
        className="mt-6 inline-flex items-center rounded-full border border-[#d9d2c5] px-4 py-2 text-sm font-semibold text-[#2a251f] transition hover:bg-[#f4efe6]"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open Feedback Form
      </a>
    </div>
  );
}
