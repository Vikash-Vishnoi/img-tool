import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import { PdfToImageClient } from "@/app/pdf-to-image/PdfToImageClient";

const tool = getTool("pdf-to-webp");

export const metadata: Metadata = generateToolMetadata(tool);

export default function PdfToWebpPage() {
  return (
    <ToolPageShell tool={tool} showFaq>
      <PdfToImageClient
        title="PDF to WebP Converter"
        description="Convert each PDF page to WebP in your browser with no upload. Download page-by-page or all at once."
        defaultOutputFormat="webp"
      />
    </ToolPageShell>
  );
}
