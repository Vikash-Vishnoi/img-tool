import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import { PdfToImageClient } from "@/app/pdf-to-image/PdfToImageClient";

const tool = getTool("pdf-to-avif");

export const metadata: Metadata = generateToolMetadata(tool);

export default function PdfToAvifPage() {
  return (
    <ToolPageShell tool={tool}>
      <PdfToImageClient
        title="PDF to AVIF Converter"
        description="Convert each PDF page to AVIF in your browser with no upload. Download page-by-page or all at once."
        defaultOutputFormat="avif"
      />
    </ToolPageShell>
  );
}
