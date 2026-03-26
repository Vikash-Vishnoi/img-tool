import type { Metadata } from "next";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("webp-to-pdf");

export const metadata: Metadata = generateToolMetadata(tool);

export default function WebpToPdfPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ImageToPdfClient
        title="WebP to PDF Converter"
        description="Convert WebP images into one PDF in your browser. Files stay on your device."
        inputLabel="Upload WebP images"
        accept={["image/webp", ".webp"]}
        uploadHelperText="You can select multiple WebP images. Max file size 100 MB each (up to 30 images)."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="webp-to-pdf" />
      </div>
    </>
  );
}
