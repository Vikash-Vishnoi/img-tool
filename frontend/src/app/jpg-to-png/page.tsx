import type { Metadata } from "next";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("jpg-to-png");

export const metadata: Metadata = generateToolMetadata(tool);

export default function JpgToPngPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <header className="space-y-3">
            <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
              JPG to PNG Converter
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-7 text-foreground/70">
              Coming soon. This tool will convert JPG to PNG in your browser—free,
              no upload, works on mobile.
            </p>
          </header>

          <div className="mt-8 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
            <div className="text-sm font-medium">Status</div>
            <div className="mt-2 text-sm text-foreground/70">
              Tool UI will be added next.
            </div>
          </div>

          <RelatedTools currentSlug="jpg-to-png" />
        </div>
      </main>
    </>
  );
}
