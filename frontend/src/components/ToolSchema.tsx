import { getToolFaqs, getToolFeatureList, getToolHowTo, type ToolDefinition } from "@/lib/seo";

export type ToolSchemaProps = {
  tool: ToolDefinition;
};

function jsonLd(data: unknown): string {
  return JSON.stringify(data);
}

export function ToolSchema({ tool }: ToolSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://image-tools.tech";
  const absoluteUrl = `${siteUrl.replace(/\/$/, "")}${tool.path}`;
  const howTo = getToolHowTo(tool);
  const featureList = getToolFeatureList(tool);

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
    featureList,
    isAccessibleForFree: true,
  };

  const faqs = getToolFaqs(tool);
  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    totalTime: "PT2M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "Source file(s)",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Web browser",
      },
    ],
    step: howTo.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      url: `${absoluteUrl}#${step.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(howToJsonLd) }}
      />
    </>
  );
}
