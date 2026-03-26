import { CompressImageClient } from "./CompressImageClient";
import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("compress-image");

export const metadata: Metadata = generateToolMetadata(tool);

export default function CompressImagePage() {
  return (
    <ToolPageShell tool={tool}>
      <CompressImageClient />
    </ToolPageShell>
  );
}
