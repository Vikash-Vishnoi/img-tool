import { CompressImageClient } from "./CompressImageClient";
import type { Metadata } from "next";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("compress-image");

export const metadata: Metadata = generateToolMetadata(tool);

export default function CompressImagePage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <CompressImageClient />
      <div className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="compress-image" />
      </div>
    </>
  );
}
