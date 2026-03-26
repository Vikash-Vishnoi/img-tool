import { type FaqItem, type ToolDefinition } from "@/lib/seo";

export type ToolSchemaProps = {
  tool: ToolDefinition;
  faqs?: FaqItem[];
};

function jsonLd(data: unknown): string {
  return JSON.stringify(data);
}

export function ToolSchema({ tool, faqs }: ToolSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://image-tools.tech";
  const absoluteUrl = `${siteUrl.replace(/\/$/, "")}${tool.path}`;

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: absoluteUrl,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Android, iOS, Windows, macOS",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    isAccessibleForFree: true,
  };

  const resolvedFaqs = faqs ?? tool.faqs;

  const faqJsonLd = resolvedFaqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: resolvedFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(webAppJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
        />
      ) : null}
    </>
  );
}
