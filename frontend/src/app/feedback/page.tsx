import type { Metadata } from "next";
import Link from "next/link";
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
        Help us improve Image Tools by sharing bugs, quality issues, and feature requests.
        We review feedback to improve mobile behavior, conversion reliability, and practical
        upload workflows for forms and everyday tasks.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">What to include in your report</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
        <li>Tool page URL and your device or browser.</li>
        <li>Expected result versus actual result.</li>
        <li>Any size, format, or portal constraints you were targeting.</li>
        <li>Optional screenshot to help us reproduce the issue faster.</li>
      </ul>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Before sending feedback</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        If you are facing file rejection, try one quick retry with the right sequence:
        set required format first, then dimensions, then size target. This usually fixes
        most upload errors without quality loss.
      </p>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        Useful shortcuts: <Link href="/image-converter" prefetch={false} className="font-semibold text-[#2a251f] underline-offset-2 hover:underline">Image Converter</Link>,{" "}
        <Link href="/resize-image" prefetch={false} className="font-semibold text-[#2a251f] underline-offset-2 hover:underline">Resize Image</Link>,{" "}
        and <Link href="/compress-image" prefetch={false} className="font-semibold text-[#2a251f] underline-offset-2 hover:underline">Compress Image</Link>.
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
