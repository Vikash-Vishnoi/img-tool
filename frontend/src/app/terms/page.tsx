import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Image Tools.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    url: "/terms",
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
