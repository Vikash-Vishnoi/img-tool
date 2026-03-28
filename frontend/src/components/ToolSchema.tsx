import { type ToolDefinition } from "@/lib/seo";

export type ToolSchemaProps = {
  tool: ToolDefinition;
};

function jsonLd(data: unknown): string {
  return JSON.stringify(data);
}

export function ToolSchema({ tool }: ToolSchemaProps) {
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(webAppJsonLd) }}
    />
  );
}
