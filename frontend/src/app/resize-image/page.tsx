import { ResizeImageClient } from "./ResizeImageClient";
import type { Metadata } from "next";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("resize-image");

export const metadata: Metadata = generateToolMetadata(tool);

export default function ResizeImagePage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ResizeImageClient />
      <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="resize-image" />
      </div>
    </>
  );
}
