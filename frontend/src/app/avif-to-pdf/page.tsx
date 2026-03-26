import type { Metadata } from "next";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("avif-to-pdf");

export const metadata: Metadata = generateToolMetadata(tool);

export default function AvifToPdfPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ImageToPdfClient
        title="AVIF to PDF Converter"
        description="Convert AVIF images into one PDF in your browser. Files stay on your device."
        inputLabel="Upload AVIF images"
        accept={["image/avif", ".avif"]}
        uploadHelperText="You can select multiple AVIF images. Max file size 100 MB each (up to 30 images)."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="avif-to-pdf" />
      </div>
    </>
  );
}
