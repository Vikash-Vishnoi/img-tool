import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("disclaimer");

export const metadata: Metadata = {
  title: "Disclaimer · Image Tools",
  description:
    "Disclaimer for Image Tools about informational use, output responsibility, and third-party requirements.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "Disclaimer · Image Tools",
    description:
      "Read important disclaimer details for using Image Tools outputs on forms, portals, and social platforms.",
    type: "website",
    locale: "en_IN",
    siteName: "Image Tools",
    url: "/disclaimer",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Disclaimer · Image Tools",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer · Image Tools",
    description:
      "Read important disclaimer details for using Image Tools outputs on forms, portals, and social platforms.",
    images: [OG_IMAGE],
  },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Disclaimer</h1>
      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Image Tools provides utilities to convert, compress, and resize files. Results
        are offered for general informational and productivity purposes only.
      </p>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        You are responsible for reviewing output quality and confirming requirements for
        government portals, job applications, social platforms, or any third-party
        service before submission.
      </p>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        We do not guarantee acceptance by every external system because upload rules,
        compression limits, and validation checks may change without notice.
      </p>
    </main>
  );
}
