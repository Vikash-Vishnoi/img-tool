import type { Metadata } from "next";
import { getOgSvgPath } from "@/lib/seo";

const OG_IMAGE = getOgSvgPath("disclaimer");

export const metadata: Metadata = {
  title: "Disclaimer — Image Tools Output Responsibility & Limits",
  description:
    "Read the Image Tools disclaimer about output accuracy, platform acceptance, and your responsibility to verify file requirements before submission.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "Disclaimer — Image Tools Output Responsibility & Limits",
    description:
      "Read the Image Tools disclaimer about output accuracy, platform acceptance, and your responsibility to verify file requirements before submission.",
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
    title: "Disclaimer — Image Tools Output Responsibility & Limits",
    description:
      "Read the Image Tools disclaimer about output accuracy, platform acceptance, and your responsibility to verify file requirements before submission.",
    images: [OG_IMAGE],
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
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

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Informational use only</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        The tools and guidance on this website are provided for convenience and general
        information. They are not legal, regulatory, or professional compliance advice.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">External platform rules</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        Third-party portal requirements can change at any time. A file accepted today may
        fail later due to policy updates, validation logic changes, or format restrictions.
      </p>

      <h2 className="mt-8 text-xl font-bold tracking-[-0.02em]">Your verification duty</h2>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        We do not guarantee acceptance by every external system because upload rules,
        compression limits, and validation checks may change without notice.
      </p>
    </div>
  );
}
