import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Image Tools.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    url: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Privacy Policy</h1>
      <p className="mt-4 text-sm leading-7 text-[#6b6760]">
        Image Tools processes conversions in your browser whenever possible. We do not
        require account creation and do not store uploaded images on our servers.
      </p>
      <p className="mt-3 text-sm leading-7 text-[#6b6760]">
        Basic analytics may be used to improve performance and usability. By using the
        site, you agree to this policy.
      </p>
    </main>
  );
}
