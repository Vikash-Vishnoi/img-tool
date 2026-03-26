import type { Metadata } from "next";
import { FormatConvertClient } from "@/components/FormatConvertClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("webp-to-avif");

export const metadata: Metadata = generateToolMetadata(tool);

export default function WebpToAvifPage() {
  const faq = tool.faqs ?? [];

  return (
    <>
      <ToolSchema tool={tool} />

      <FormatConvertClient
        from="webp"
        to="avif"
        title="WebP to AVIF Converter"
        description={tool.description}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        {faq.length > 0 ? (
          <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
            <h2 className="text-lg font-extrabold tracking-[-0.02em]">FAQ</h2>
            <div className="mt-4 space-y-5">
              {faq.map((item, index) => (
                <div key={`${item.question}-${index}`} className="space-y-1">
                  <h3 className="text-sm font-semibold">{item.question}</h3>
                  <p className="text-sm leading-6 text-[#6b6760]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <RelatedTools currentSlug="webp-to-avif" />
      </div>
    </>
  );
}
