import { ResizeTo200kbClient } from "./ResizeTo200kbClient";
import type { Metadata } from "next";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("resize-image-to-200kb");

export const metadata: Metadata = generateToolMetadata(tool);

export default function ResizeImageTo200kbPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ResizeTo200kbClient />
      <div className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="resize-image-to-200kb" />
      </div>
    </>
  );
}
