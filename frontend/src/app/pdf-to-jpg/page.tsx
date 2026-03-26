import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import { PdfToImageClient } from "@/app/pdf-to-image/PdfToImageClient";

const tool = getTool("pdf-to-jpg");

export const metadata: Metadata = generateToolMetadata(tool);

export default function PdfToJpgPage() {
  return (
    <ToolPageShell tool={tool}>
      <PdfToImageClient
        title="PDF to JPG Converter"
        description="Convert each PDF page to JPG in your browser with no upload. Download page-by-page or all at once."
        defaultOutputFormat="jpg"
      />
    </ToolPageShell>
  );
}
