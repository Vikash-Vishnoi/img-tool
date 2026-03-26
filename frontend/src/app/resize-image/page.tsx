import { ResizeImageClient } from "./ResizeImageClient";
import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("resize-image");

export const metadata: Metadata = generateToolMetadata(tool);

export default function ResizeImagePage() {
  return (
    <ToolPageShell tool={tool}>
      <ResizeImageClient />
    </ToolPageShell>
  );
}
