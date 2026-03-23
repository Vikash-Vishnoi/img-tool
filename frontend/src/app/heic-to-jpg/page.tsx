import type { Metadata } from "next";
import { HeicToJpgClient } from "./HeicToJpgClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("heic-to-jpg");

export const metadata: Metadata = generateToolMetadata(tool);

export default function HeicToJpgPage() {
  const faq = tool.faqs ?? [];

  return (
    <>
      <ToolSchema tool={tool} />

      <HeicToJpgClient />

      <div className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
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

        <RelatedTools currentSlug="heic-to-jpg" />
      </div>
    </>
  );
}
