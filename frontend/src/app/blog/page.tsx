import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";

const OG_IMAGE = "/og/blog/index.png";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://image-tools.tech";
const NORMALIZED_SITE_URL = SITE_URL.replace(/\/$/, "");
const BLOG_TITLE = "Image Tools Blog: Conversion, Compression and Resize Guides";
const BLOG_DESCRIPTION =
  "Actionable tutorials for image-to-PDF, compression, HEIC conversion, and resize workflows with practical checks for form uploads and sharing.";
const BLOG_UPDATED_AT = "2026-03-29";

const BLOG_FAQ_ITEMS = [
  {
    question: "How should I use this blog for faster results?",
    answer:
      "Start with the post that matches your exact upload error, follow the checklist, and open the linked tool from the same post so settings stay consistent.",
  },
  {
    question: "Are these guides useful on mobile devices?",
    answer:
      "Yes. Every workflow is written to work on Android and iPhone browsers, including common size-limit cases used by forms and portals.",
  },
  {
    question: "What should I verify before final upload?",
    answer:
      "Confirm format, dimensions, and final file size after export. Then preview at 100% zoom to verify text readability and photo clarity.",
  },
];

const BLOG_BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${NORMALIZED_SITE_URL}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${NORMALIZED_SITE_URL}/blog`,
    },
  ],
};

const BLOG_COLLECTION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Image Tools Blog",
  description: BLOG_DESCRIPTION,
  url: `${NORMALIZED_SITE_URL}/blog`,
  inLanguage: "en-IN",
  dateModified: BLOG_UPDATED_AT,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: BLOG_POSTS.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${NORMALIZED_SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  },
};

const BLOG_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: BLOG_FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: "Image Tools",
    url: "/blog",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Image Tools Blog",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 pb-14 pt-10 sm:px-6 lg:px-8">
      <script
        id="schema-blog-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_BREADCRUMB_JSON_LD) }}
      />
      <script
        id="schema-blog-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_COLLECTION_JSON_LD) }}
      />
      <script
        id="schema-blog-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_FAQ_JSON_LD) }}
      />

      <section className="rounded-3xl border border-[#d4cfc4] bg-[#fffdf9] p-6 sm:p-8">
        <nav
          aria-label="breadcrumb"
          className="mb-4 rounded-2xl border border-[#d4cfc4] bg-white px-4 py-2.5 text-xs text-[#6b6760]"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" prefetch className="hover:text-[#1c1a14] hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-semibold text-[#1c1a14]">Blog</li>
          </ol>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-[0.09em] text-[#6b6760]">
          Content Hub
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
          Blog Clusters for Every Core Tool
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b6760] sm:text-base">
          The Image Tools Blog brings practical guides for conversion, compression, PDF, and
          resize workflows in one searchable place. Use each article as a step-by-step checklist
          before you upload files to forms, portals, or client workflows.
        </p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
          Updated <time dateTime={BLOG_UPDATED_AT}>29 March 2026</time>
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#d4cfc4] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
              Total posts
            </div>
            <div className="mt-1 text-2xl font-extrabold text-[#1c1a14]">{BLOG_POSTS.length}</div>
          </div>
          <div className="rounded-2xl border border-[#d4cfc4] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
              Canonical strategy
            </div>
            <div className="mt-1 text-sm font-semibold text-[#1c1a14]">
              Duplicate intents collapsed
            </div>
          </div>
          <div className="rounded-2xl border border-[#d4cfc4] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
              Content model
            </div>
            <div className="mt-1 text-sm font-semibold text-[#1c1a14]">Intent-based topic clusters</div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">
          How to use the Image Tools Blog efficiently
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#6b6760] sm:text-base">
          Start from your exact intent, such as reducing image size under a strict limit,
          converting iPhone HEIC files, or preparing JPG and PDF files for official forms.
          Each post is written to reduce trial-and-error and help you finish in fewer attempts.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#6b6760] sm:text-base">
          The Image Tools Blog is organized into topic clusters so you can move from one guide
          to related tutorials without starting from scratch. This structure helps when you need
          a backup method after a portal rejects a file for size, format, or readability.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
          <li>Pick the article closest to your final upload requirement.</li>
          <li>Apply the checklist and keep one original backup file.</li>
          <li>Recheck dimensions and final file size after export.</li>
          <li>Use related links to switch tools without changing workflow context.</li>
        </ul>
      </section>

      <section className="mt-8 rounded-3xl border border-[#d4cfc4] bg-white p-5 shadow-[0_10px_26px_rgba(28,26,20,0.06)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#1c1a14]">All blog posts</h2>
          <span className="rounded-full border border-[#d4cfc4] bg-[#f7f3ec] px-3 py-1 text-xs font-semibold text-[#6b6760]">
            {BLOG_POSTS.length} posts
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              prefetch
              className="group rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_24px_rgba(28,26,20,0.08)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#edcfbe] bg-[#fff3ed] px-2.5 py-1 text-[11px] font-semibold text-[#a34a24]">
                  {post.cluster}
                </span>
                <span className="rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-2.5 py-1 text-[11px] font-semibold text-[#2a7a5e]">
                  {post.readMinutes} min read
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold leading-6 text-[#1c1a14] transition group-hover:text-[#c75322]">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6b6760]">{post.description}</p>

              <div className="mt-3 border-t border-[#e8e1d6] pt-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
                  Primary target
                </p>
                <p className="mt-1 text-xs font-semibold text-[#1c1a14]">{post.targetKeywords[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Blog FAQs</h2>
        <div className="mt-4 space-y-4">
          {BLOG_FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <h3 className="text-base font-bold text-[#1c1a14]">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6b6760]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
