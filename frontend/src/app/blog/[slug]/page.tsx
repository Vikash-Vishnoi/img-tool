import type { Metadata } from "next";
import { Link2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, type BlogFaq, type BlogPost, getBlogPost } from "@/lib/blog";

const BlogReadingProgress = dynamic(() => import("@/components/BlogReadingProgress"));

const BlogShareButtons = dynamic(() => import("@/components/BlogShareButtons"));

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

type UseCaseScenario = {
  title: string;
  example: string;
  outcome: string;
};

type ClusterUseCaseCopy = {
  intro: string;
  scenarios: UseCaseScenario[];
  closing: string;
  quickChecks: string[];
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://image-tools.tech";
const NORMALIZED_SITE_URL = SITE_URL.replace(/\/$/, "");
const TWITTER_CREATOR = process.env.NEXT_PUBLIC_TWITTER_CREATOR ?? "@imagetoolstech";
const META_TITLE_MAX = 60;
const META_DESCRIPTION_MIN = 120;
const META_DESCRIPTION_MAX = 160;
const DEFAULT_FAQ_COUNT = 4;

function getBlogOgImagePath(slug: string): `/${string}` {
  return `/og/blog/${slug}.png`;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function slugifyHeading(value: string): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function trimToWord(value: string, maxLength: number): string {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const sliced = normalized.slice(0, Math.max(0, maxLength - 3));
  const lastSpace = sliced.lastIndexOf(" ");
  const safeSlice = lastSpace >= 30 ? sliced.slice(0, lastSpace) : sliced;
  return `${safeSlice.trim()}...`;
}

function buildBlogMetaTitle(post: BlogPost): string {
  const compactTitle = normalizeText(post.title)
    .replace(/\s*\|\s*image tools blog\s*$/i, "")
    .replace(/\s*\(latest practical guide\)\s*/i, "")
    .replace(/\bDetailed\b/gi, "")
    .replace(/\bPractical\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (compactTitle.length <= META_TITLE_MAX) {
    return compactTitle;
  }

  return trimToWord(compactTitle, META_TITLE_MAX);
}

function buildBlogMetaDescription(post: BlogPost): string {
  const keyword = post.targetKeywords[0] ?? "image workflow";
  const base = normalizeText(post.description).replace(/[.\s]+$/g, "");
  let description = base;

  if (description.length < META_DESCRIPTION_MIN) {
    description = `${description}. Follow clear steps, avoid common mistakes, and use mobile-friendly settings for reliable uploads.`;
  }

  if (description.length < META_DESCRIPTION_MIN) {
    description = `${description} Learn ${keyword} with practical examples and a quick checklist.`;
  }

  if (description.length > META_DESCRIPTION_MAX) {
    description = trimToWord(description, META_DESCRIPTION_MAX);
  }

  if (!description.endsWith(".")) {
    description = `${description}.`;
  }

  return description;
}

function uniqueFaqItems(items: BlogFaq[]): BlogFaq[] {
  const seenQuestions = new Set<string>();
  const normalizedItems: BlogFaq[] = [];

  for (const item of items) {
    const question = normalizeText(item.question);
    const answer = normalizeText(item.answer);

    if (!question || !answer) {
      continue;
    }

    const key = question.toLowerCase();
    if (seenQuestions.has(key)) {
      continue;
    }

    seenQuestions.add(key);
    normalizedItems.push({ question, answer });
  }

  return normalizedItems;
}

function buildFallbackFaq(post: BlogPost): BlogFaq[] {
  const keyword = post.targetKeywords[0] ?? post.title.toLowerCase();
  const secondaryKeyword = post.targetKeywords[1] ?? "image file preparation";
  const primaryTool = post.toolAnchors[0]?.label ?? "the recommended tool";
  const secondaryTool = post.toolAnchors[1]?.label ?? primaryTool;

  if (post.cluster === "Image to PDF Hub") {
    return [
      {
        question: `What is the easiest way to handle ${keyword} on phone or desktop?`,
        answer:
          `Use ${primaryTool}, arrange pages in the right sequence, and export one final PDF after a readability check at 100% zoom.`,
      },
      {
        question: "Can I combine multiple images into a single PDF without losing order?",
        answer:
          "Yes. Add all images together, move them into the required order, and verify the first and last pages before downloading.",
      },
      {
        question: `Which setting is most important for ${secondaryKeyword}?`,
        answer:
          "Start with orientation and fit settings, because incorrect page layout causes more rejections than file size in most upload flows.",
      },
      {
        question: `Should I use ${primaryTool} or ${secondaryTool} for this topic?`,
        answer:
          `For image-to-PDF tasks, begin with ${primaryTool}. Use ${secondaryTool} only when you need to adjust source files first.`,
      },
    ];
  }

  if (post.cluster === "Compress Image Hub") {
    return [
      {
        question: `How can I hit strict limits while doing ${keyword}?`,
        answer:
          `Use ${primaryTool} in small steps, then stop as soon as you reach the target size and text remains readable.`,
      },
      {
        question: "Is one strong compression pass better than multiple small passes?",
        answer:
          "Multiple controlled adjustments usually preserve quality better. Extreme one-pass compression often creates visible artifacts.",
      },
      {
        question: `What should I check before uploading a file prepared for ${secondaryKeyword}?`,
        answer:
          "Confirm final KB size, preview at full zoom, and verify face or text clarity after export, not before editing.",
      },
      {
        question: "Can I complete compression directly from a mobile browser?",
        answer:
          "Yes. Modern mobile browsers handle this workflow well, as long as you run a final visual check before submission.",
      },
    ];
  }

  if (post.cluster === "HEIC to JPG Hub") {
    return [
      {
        question: `Why is ${keyword} still needed if HEIC is newer?`,
        answer:
          "HEIC is efficient for storage, but JPG remains more compatible across portals, chat apps, and older systems.",
      },
      {
        question: "Will conversion from HEIC to JPG reduce image quality too much?",
        answer:
          "A single clean conversion keeps quality practical for uploads. Avoid repeated re-export to prevent unnecessary loss.",
      },
      {
        question: `Which tool should I open first for ${secondaryKeyword}?`,
        answer:
          `Start with ${primaryTool}. If the output is still too large, use ${secondaryTool} to optimize size after conversion.`,
      },
      {
        question: "Can I convert iPhone photos without installing a separate app?",
        answer:
          "Yes. Browser-based converters work on iPhone and Android, so you can process files and download JPG directly.",
      },
    ];
  }

  if (post.cluster === "Resize Image and Passport Hub") {
    return [
      {
        question: `How do I avoid rejection while working on ${keyword}?`,
        answer:
          "Match exact dimensions first, then tune file size. Most rejections happen when size is correct but dimensions are off.",
      },
      {
        question: "What is the safest order: resize first or compress first?",
        answer:
          "Resize to required dimensions first, then compress only as much as needed to stay under size limits.",
      },
      {
        question: `Can ${primaryTool} handle both portrait photos and signature-style uploads?`,
        answer:
          `Yes. Use ${primaryTool} with strict width-height settings and verify clarity before final export.`,
      },
      {
        question: `What is a practical quality check for ${secondaryKeyword}?`,
        answer:
          "Open the final image at full zoom and ensure facial edges, text labels, and signature strokes remain sharp.",
      },
    ];
  }

  if (post.cluster === "JPG and PNG Hub") {
    return [
      {
        question: `How do I choose the right format for ${keyword}?`,
        answer:
          "Use JPG for photos and smaller files, and PNG when transparent backgrounds or crisp graphics are more important.",
      },
      {
        question: "Does PNG always give better quality than JPG?",
        answer:
          "PNG preserves details better for graphics and text, but JPG often looks excellent for photos at much smaller file sizes.",
      },
      {
        question: `Which tool should I use first when evaluating ${secondaryKeyword}?`,
        answer:
          `Start with ${primaryTool} to produce baseline outputs, then compare alternatives using ${secondaryTool} if needed.`,
      },
      {
        question: "Can format choice improve website speed or upload success?",
        answer:
          "Yes. Picking the right format can reduce file size significantly, which improves load time and lowers upload failures.",
      },
    ];
  }

  return [
    {
      question: `What is the fastest way to complete ${keyword} correctly?`,
      answer:
        `Use ${primaryTool}, follow the workflow step by step, and validate the final output before upload or sharing.`,
    },
    {
      question: "Can this workflow be done on Android and iPhone browsers?",
      answer:
        "Yes. The process works in modern mobile browsers, so no extra app is required for most use cases.",
    },
    {
      question: `How do I reduce errors for ${secondaryKeyword}?`,
      answer:
        "Set dimensions and format first, then adjust file size, and run a final readability check at full zoom.",
    },
    {
      question: "What should I verify in the final file before submission?",
      answer:
        "Check format, dimensions, file size, and readability. Keeping one backup version also helps with quick retries.",
    },
  ];
}

function getPostFaq(post: BlogPost): BlogFaq[] {
  const customFaq = post.faq ?? [];
  const fallbackFaq = buildFallbackFaq(post);
  const mergedFaq = uniqueFaqItems([...customFaq, ...fallbackFaq]);

  if (mergedFaq.length <= DEFAULT_FAQ_COUNT) {
    return mergedFaq;
  }

  return mergedFaq.slice(0, DEFAULT_FAQ_COUNT);
}

function formatReadableDate(dateValue: string): string {
  const parsed = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getUseCaseCopy(post: BlogPost): ClusterUseCaseCopy {
  const primaryKeyword = post.targetKeywords[0] ?? "image workflow";
  const secondaryKeyword = post.targetKeywords[1] ?? "file preparation";
  const primaryTool = post.toolAnchors[0]?.label ?? "the recommended tool";

  if (post.cluster === "Image to PDF Hub") {
    return {
      intro:
        "Image-to-PDF tasks are usually time-sensitive and detail-sensitive. The same file may pass in one portal and fail in another because of page order, orientation, or readability at verification time. These examples show how to apply a predictable process so you avoid last-minute edits and repeated uploads.",
      scenarios: [
        {
          title: "College or exam form packet",
          example:
            "A student has six screenshots and scans for one application. Instead of uploading mixed files individually, they combine everything into one PDF in the exact requested order and keep a clean first page with candidate details.",
          outcome:
            "Review teams process the submission faster, and the student avoids rejection caused by missing pages or wrong sequence.",
        },
        {
          title: "Freelancer invoice and receipt bundle",
          example:
            "A freelancer sends payment proof to a client each month. They merge invoices, payment screenshots, and signed notes into one document so the client accounting team receives one structured file rather than scattered attachments.",
          outcome:
            "Approvals move faster because each page is traceable and the receiver does not need to manually stitch files together.",
        },
        {
          title: "KYC or verification document upload",
          example:
            "During KYC, a user keeps image quality high, sets consistent margins, and checks every page at zoom before submission. They also keep a backup version with a slightly smaller file size in case the portal enforces stricter limits later.",
          outcome:
            "The upload succeeds on the first try and the same document can be reused for future verification workflows.",
        },
      ],
      closing:
        `For ${primaryKeyword}, treat output quality and page structure as equal priorities. A single well-ordered PDF produced with ${primaryTool} is usually more reliable than many separate image uploads.`,
      quickChecks: [
        "Keep page order exactly as the checklist requests.",
        "Verify small text and signatures at 100% zoom.",
        "Use one final PDF filename with date or reference id.",
        "Store a backup version in case re-upload is needed.",
      ],
    };
  }

  if (post.cluster === "Compress Image Hub") {
    return {
      intro:
        "Compression is most useful when done with intent, not as a random slider move. If you reduce size too aggressively, facial detail and text clarity drop first. These examples show how users can hit strict size targets while keeping practical visual quality for forms, chats, and work submissions.",
      scenarios: [
        {
          title: "Government portal size cap",
          example:
            "A candidate needs a photo under a fixed KB limit. They resize only when needed, then reduce quality in small steps and check clarity after each export rather than doing one extreme compression pass.",
          outcome:
            "The final file stays within limit and still looks clean enough for identity verification.",
        },
        {
          title: "WhatsApp client proof sharing",
          example:
            "A designer shares product previews over WhatsApp. Instead of sending full camera originals, they pre-compress for mobile viewing and preserve enough sharpness around edges and labels so clients can approve quickly.",
          outcome:
            "Files send faster on mobile data and the visual quality remains strong for decision-making.",
        },
        {
          title: "Recruiter or HR upload field",
          example:
            "An applicant uploads photos on a career portal with strict size validation. They keep one safe version slightly below the maximum, such as 190KB when the limit is 200KB, to avoid random validation failures.",
          outcome:
            "Submission completes smoothly without repeating edits minutes before deadline.",
        },
      ],
      closing:
        `Use ${primaryTool} with a controlled loop: compress, verify, and adjust once. That method keeps ${secondaryKeyword} practical while reliably hitting file-size constraints.`,
      quickChecks: [
        "Adjust one setting at a time for predictable output.",
        "Check face and text clarity before saving final file.",
        "Keep the final file slightly below the allowed max.",
        "Retain one original image for future edits.",
      ],
    };
  }

  if (post.cluster === "HEIC to JPG Hub") {
    return {
      intro:
        "HEIC is efficient on iPhone storage, but many external systems still expect JPG. Conversion is not just a format switch; it is a compatibility step that prevents avoidable friction across devices, browsers, and upload portals. These scenarios highlight where conversion saves the most time.",
      scenarios: [
        {
          title: "iPhone to Windows handoff",
          example:
            "A user transfers photos from iPhone to a Windows laptop for editing and submission. HEIC files open inconsistently in older tools, so they convert to JPG once and continue with a format every desktop app understands.",
          outcome:
            "The workflow becomes stable across apps, and file sharing no longer depends on platform-specific support.",
        },
        {
          title: "Portal rejects HEIC upload",
          example:
            "An exam portal accepts only JPG even though the original photo looks fine. The user converts HEIC to JPG, validates size and dimensions, then uploads without changing core image composition.",
          outcome:
            "The same photo passes validation immediately after conversion, avoiding stressful re-capture.",
        },
        {
          title: "Team collaboration across mixed devices",
          example:
            "A small team shares field photos through chat and email. Converting HEIC to JPG before distribution ensures Android users, desktop browsers, and document tools can all preview files without extra plugins.",
          outcome:
            "Communication is faster because no one has to troubleshoot unsupported file formats.",
        },
      ],
      closing:
        `For ${primaryKeyword}, compatibility is the real win. Converting early with ${primaryTool} avoids downstream issues in editing, sharing, and form submission.`,
      quickChecks: [
        "Convert from original HEIC files when possible.",
        "Avoid repeated conversion loops to limit quality drift.",
        "Check orientation and metadata-sensitive uploads.",
        "Store one JPG archive for frequent reuse.",
      ],
    };
  }

  if (post.cluster === "Resize Image and Passport Hub") {
    return {
      intro:
        "Resize workflows are usually rejected for small technical mismatches, not because the photo content is wrong. Most portals validate pixel dimensions, size limits, and format in one pass. These real-world cases show how a structured resize routine prevents repeated rejection cycles.",
      scenarios: [
        {
          title: "Passport or ID dimension mismatch",
          example:
            "A user has a clear image but wrong dimensions. They crop with face-centered framing, resize to the exact required pixel value, and only then optimize size to match portal limits.",
          outcome:
            "The photo remains compliant and visually clear, reducing rejection risk from technical checks.",
        },
        {
          title: "Job portal photo and signature upload",
          example:
            "An applicant handles photo and signature separately with different limits. They prepare each file against its own rule set and avoid applying one preset to both assets.",
          outcome:
            "Both uploads pass together, avoiding partial submission failures and rework.",
        },
        {
          title: "Marketplace and profile image refresh",
          example:
            "A seller updates storefront profile and listing images. They resize once per target slot and keep reusable templates so future updates stay consistent without guesswork.",
          outcome:
            "Brand visuals remain sharp and consistent across all surfaces with less manual editing.",
        },
      ],
      closing:
        `When handling ${primaryKeyword}, sequence matters: dimension accuracy first, then file-size tuning. Using ${primaryTool} with that order keeps both compliance and quality intact.`,
      quickChecks: [
        "Match exact pixel values before compression.",
        "Keep face and key text regions centered.",
        "Validate file size after final export only.",
        "Save reusable presets for frequent form types.",
      ],
    };
  }

  if (post.cluster === "JPG and PNG Hub") {
    return {
      intro:
        "Choosing between JPG, PNG, and newer web formats directly affects speed, quality, and compatibility. The right format depends on image purpose, not personal preference. These examples show how teams decide format strategy using practical output goals rather than broad assumptions.",
      scenarios: [
        {
          title: "Website hero image optimization",
          example:
            "A content site tests JPG, WebP, and AVIF for large hero images. They compare visual quality on mobile and pick the smallest acceptable format, while keeping a fallback for older clients.",
          outcome:
            "Pages load faster without obvious quality loss, improving user experience and engagement.",
        },
        {
          title: "Logo and transparent graphics",
          example:
            "A product team needs transparent icons for dark and light backgrounds. They keep PNG or alpha-capable formats for clean edges instead of forcing JPG, which adds unwanted background artifacts.",
          outcome:
            "UI assets remain sharp and reusable across themes and placements.",
        },
        {
          title: "Campaign assets for multi-channel sharing",
          example:
            "A marketer prepares one creative for website, ad platform, and email. They export multiple variants based on channel constraints instead of trying one universal file.",
          outcome:
            "Each channel gets the best balance of compatibility and file size with fewer manual fixes.",
        },
      ],
      closing:
        `For ${primaryKeyword}, keep decisions purpose-driven: photo, graphic, or transparency need. A simple format matrix and ${primaryTool} can prevent recurring export mistakes.`,
      quickChecks: [
        "Use format based on image purpose, not habit.",
        "Test quality on mobile and desktop before publishing.",
        "Keep transparent assets separate from photo workflows.",
        "Maintain fallback formats for strict compatibility targets.",
      ],
    };
  }

  return {
    intro:
      "Real-world success usually comes from predictable steps, not complex settings. Applying examples to your exact requirement helps reduce trial-and-error and keeps output quality stable across devices and submission portals.",
    scenarios: [
      {
        title: "Time-sensitive submission",
        example:
          "You prepare one clean file using a fixed checklist and validate every requirement before upload.",
        outcome:
          "Fewer retries and faster acceptance.",
      },
      {
        title: "Cross-device sharing",
        example:
          "You convert and optimize once so recipients on Android, iPhone, and desktop can open the file immediately.",
        outcome:
          "No compatibility confusion during review.",
      },
      {
        title: "Repeatable workflow",
        example:
          "You save a successful version and reuse the same settings for future uploads.",
        outcome:
          "Consistent quality and less manual effort.",
      },
    ],
    closing:
      "Use examples as templates and adjust only one variable at a time for controlled, predictable outcomes.",
    quickChecks: [
      "Verify dimensions, format, and size in that order.",
      "Preview final output before sharing or uploading.",
      "Keep one backup copy of approved output.",
      "Document settings that worked for reuse.",
    ],
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  const canonicalPath = `/blog/${post.slug}`;
  const ogImage = getBlogOgImagePath(post.slug);
  const metaTitle = buildBlogMetaTitle(post);
  const metaDescription = buildBlogMetaDescription(post);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      locale: "en_IN",
      siteName: "Image Tools",
      url: canonicalPath,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      creator: TWITTER_CREATOR,
      images: [ogImage],
    },
    keywords: post.targetKeywords,
  };
}

function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedPosts
    .map((slug) => getBlogPost(slug))
    .filter((item): item is BlogPost => Boolean(item));
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const canonicalPath = `/blog/${post.slug}`;
  const canonicalUrl = `${NORMALIZED_SITE_URL}${canonicalPath}`;
  const ogImagePath = getBlogOgImagePath(post.slug);
  const ogImageUrl = ogImagePath.startsWith("http")
    ? ogImagePath
    : `${NORMALIZED_SITE_URL}${ogImagePath}`;
  const metaDescription = buildBlogMetaDescription(post);
  const faqItems = getPostFaq(post);
  const relatedPosts = getRelatedPosts(post);
  const formattedUpdatedAt = formatReadableDate(post.updatedAt);
  const useCaseCopy = getUseCaseCopy(post);
  const sectionToc = post.sections.map((section, index) => ({
    id: `${slugifyHeading(section.heading) || "section"}-${index + 1}`,
    heading: section.heading,
  }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDescription,
    datePublished: post.updatedAt,
    dateModified: post.updatedAt,
    image: [
      {
        "@type": "ImageObject",
        url: ogImageUrl,
        width: 1200,
        height: 630,
      },
    ],
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${NORMALIZED_SITE_URL}${post.author.profilePath ?? "/about"}`,
      worksFor: {
        "@type": "Organization",
        name: "Image Tools",
      },
      description: post.author.bio,
    },
    editor: {
      "@type": "Person",
      name: post.reviewer.name,
      url: `${NORMALIZED_SITE_URL}${post.reviewer.profilePath ?? "/about"}`,
      description: post.reviewer.bio,
    },
    publisher: {
      "@type": "Organization",
      name: "Image Tools",
      logo: {
        "@type": "ImageObject",
        url: `${NORMALIZED_SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    inLanguage: "en-IN",
    keywords: post.targetKeywords,
  };

  const breadcrumbJsonLd = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <BlogReadingProgress targetId="blog-article-content" topOffset={62} />

      <article
        id="blog-article-content"
        className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8"
      >
      <script
        id="schema-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          id="schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <Link
        href="/blog"
        prefetch
        className="inline-flex rounded-full border border-[#d4cfc4] bg-[#fffdf9] px-3 py-1.5 text-xs font-semibold text-[#6b6760] transition hover:border-[#e8672a] hover:text-[#1c1a14]"
      >
        Back to blog
      </Link>

      <nav
        aria-label="breadcrumb"
        className="mt-4 rounded-2xl border border-[#d4cfc4] bg-white px-4 py-2.5 text-xs text-[#6b6760]"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" prefetch className="hover:text-[#1c1a14] hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/blog" prefetch className="hover:text-[#1c1a14] hover:underline">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#1c1a14]">{post.title}</li>
        </ol>
      </nav>

      <header className="mt-4 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#edcfbe] bg-[#fff3ed] px-2.5 py-1 text-[11px] font-semibold text-[#a34a24]">
            {post.cluster}
          </span>
          <span className="rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-2.5 py-1 text-[11px] font-semibold text-[#2a7a5e]">
            {post.readMinutes} min read
          </span>
        </div>

        <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-[-0.03em] text-[#1c1a14] sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#6b6760] sm:text-base">{post.description}</p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
          Updated <time dateTime={post.updatedAt}>{formattedUpdatedAt}</time>
        </p>

        <section
          aria-label="Author and reviewer information"
          className="mt-4 rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#e8e1d6] bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6760]">Author</p>
              <p className="mt-1 text-sm font-bold text-[#1c1a14]">{post.author.name}</p>
              <p className="mt-1 text-xs text-[#6b6760]">{post.author.role}</p>
            </div>
            <div className="rounded-xl border border-[#e8e1d6] bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6760]">Reviewed By</p>
              <p className="mt-1 text-sm font-bold text-[#1c1a14]">{post.reviewer.name}</p>
              <p className="mt-1 text-xs text-[#6b6760]">{post.reviewer.role}</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-6 text-[#6b6760]">
            {post.author.bio} Every guide is reviewed for technical accuracy, practical upload constraints, and cross-device compatibility before publication updates.
            <Link href="/about" prefetch className="ml-1 font-semibold text-[#1c1a14] underline-offset-2 hover:underline">
              Learn about the editorial process
            </Link>
            .
          </p>
        </section>

        <div className="mt-5 rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
            Target keywords
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.targetKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1c1a14]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <nav id="toc" aria-label="table of contents" className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b6760]">
            Table of Contents
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-[#1c1a14]">
            {sectionToc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="hover:text-[#c75322] hover:underline">
                  {item.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {post.intro.map((paragraph, index) => (
          <p
            key={`${post.slug}-intro-${index}`}
            className={index === 0 ? "mt-6 text-sm leading-7 text-[#1c1a14] sm:text-base" : "mt-4 text-sm leading-7 text-[#6b6760] sm:text-base"}
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-7 space-y-7">
          {post.sections.map((section, index) => (
            <section key={`${post.slug}-${section.heading}`}>
              <h2 id={sectionToc[index]?.id} className="scroll-mt-28 text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph, index) => (
                <p key={`${section.heading}-p-${index}`} className="mt-3 text-sm leading-7 text-[#6b6760]">
                  {paragraph}
                </p>
              ))}

              {section.steps && section.steps.length > 0 ? (
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
                  {section.steps.map((step) => (
                    <li key={`${section.heading}-${step}`}>{step}</li>
                  ))}
                </ol>
              ) : null}

              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
                  {section.bullets.map((bullet) => (
                    <li key={`${section.heading}-${bullet}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">
          Real-world examples and use-cases
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#6b6760]">{useCaseCopy.intro}</p>

        <div className="mt-5 space-y-4">
          {useCaseCopy.scenarios.map((scenario) => (
            <div key={scenario.title} className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <h3 className="text-base font-bold text-[#1c1a14]">{scenario.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6b6760]">{scenario.example}</p>
              <p className="mt-2 text-sm leading-7 text-[#6b6760]">
                <span className="font-semibold text-[#1c1a14]">Why this works: </span>
                {scenario.outcome}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-7 text-[#6b6760]">{useCaseCopy.closing}</p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
          {useCaseCopy.quickChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>

        <p className="mt-3 text-sm leading-7 text-[#6b6760]">
          A useful habit is to maintain a tiny &quot;approved settings&quot; note for each workflow you run often.
          Include the target dimensions, size range, preferred format, and the final quality setting that
          passed successfully. Reusing that note can save significant time and helps keep output quality
          consistent across future submissions, even when you are working quickly from mobile.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Useful links for this topic</h2>
        <p className="mt-3 text-sm leading-7 text-[#6b6760]">
          Use these relevant tools while following this guide.
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {post.toolAnchors.map((anchor, index) => (
            <li key={`${anchor.href}-${anchor.label}-${index}`}>
              <Link
                href={anchor.href}
                prefetch
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#edcfbe] bg-[#fff7f2] px-3 py-1.5 text-sm font-semibold text-[#a34a24] transition hover:border-[#e8672a] hover:bg-[#fff0e8] hover:text-[#c75322]"
              >
                <Link2 className="h-3.5 w-3.5 shrink-0 text-[#e8672a]" aria-hidden="true" />
                <span>{anchor.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Final submission checklist</h2>
        <p className="mt-3 text-sm leading-7 text-[#6b6760]">
          Before uploading, compare your final file against the portal rules one by one: format,
          dimensions, and file size. Most rejections happen because one of these values is slightly
          outside the allowed limit.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
          <li>Confirm orientation and crop so the subject remains centered and readable.</li>
          <li>Check the file size after export, not before editing, to avoid last-minute failures.</li>
          <li>Preview at 100% zoom and verify text, stamp edges, and signatures are clear.</li>
          <li>Use a simple file name and keep one backup copy before final submission.</li>
        </ul>
        <p className="mt-3 text-sm leading-7 text-[#6b6760]">
          If a portal still rejects the upload, return to this guide and adjust only one setting at a
          time. A controlled retry process usually resolves the issue faster than repeating the full
          workflow from the beginning.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Share this guide</h2>
        <p className="mt-3 text-sm leading-7 text-[#6b6760]">
          Share this guide with teammates or friends who need the same workflow.
        </p>
        <BlogShareButtons canonicalUrl={canonicalUrl} title={post.title} />
      </section>

      <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">FAQs ({faqItems.length})</h2>
        <div className="mt-4 space-y-4">
          {faqItems.map((item, index) => (
            <div key={item.question} className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <span className="inline-flex rounded-full border border-[#d4cfc4] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#6b6760]">
                Q{index + 1}
              </span>
              <h3 className="text-base font-bold text-[#1c1a14]">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-[#6b6760]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Related posts</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                prefetch
                className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_24px_rgba(28,26,20,0.08)]"
              >
                <h3 className="text-sm font-bold leading-6 text-[#1c1a14]">{relatedPost.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#6b6760]">{relatedPost.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      </article>
    </>
  );
}
