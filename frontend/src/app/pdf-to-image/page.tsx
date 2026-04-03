import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import { PdfToImageClient } from "./PdfToImageClient";

const tool = getTool("pdf-to-image");

export const metadata: Metadata = generateToolMetadata(tool);

export default function PdfToImagePage() {
  return (
    <ToolPageShell tool={tool} showFaq>
      <PdfToImageClient />
    </ToolPageShell>
  );
}
