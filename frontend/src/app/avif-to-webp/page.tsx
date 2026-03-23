import type { Metadata } from "next";
import { FormatConvertClient } from "@/components/FormatConvertClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("avif-to-webp");

export const metadata: Metadata = generateToolMetadata(tool);

export default function AvifToWebpPage() {
  const faq = tool.faqs ?? [];

  return (
    <>
      <ToolSchema tool={tool} />

      <FormatConvertClient
        from="avif"
        to="webp"
        title="AVIF to WebP Converter"
        description={tool.description}
      />

      <div className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        {faq.length > 0 ? (
          <section className="mt-10 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
            <h2 className="text-lg font-semibold">FAQ</h2>
            <div className="mt-4 space-y-5">
              {faq.map((item) => (
                <div key={item.question} className="space-y-1">
                  <h3 className="text-sm font-semibold">{item.question}</h3>
                  <p className="text-sm leading-6 text-foreground/70">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <RelatedTools currentSlug="avif-to-webp" />
      </div>
    </>
  );
}
