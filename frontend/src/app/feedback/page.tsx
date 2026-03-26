import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share feedback for Image Tools.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    url: "/feedback",
  },
};

export default function FeedbackPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
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
    </main>
  );
}
