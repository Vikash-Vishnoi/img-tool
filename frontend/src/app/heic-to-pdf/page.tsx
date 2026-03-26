import type { Metadata } from "next";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("heic-to-pdf");

export const metadata: Metadata = generateToolMetadata(tool);

export default function HeicToPdfPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ImageToPdfClient
        title="HEIC to PDF Converter"
        description="Convert iPhone HEIC/HEIF photos into one PDF in your browser. Files stay on your device."
        inputLabel="Upload HEIC/HEIF images"
        accept={["image/heic", "image/heif", ".heic", ".heif"]}
        uploadHelperText="You can select multiple HEIC/HEIF images. Max file size 100 MB each (up to 30 images)."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="heic-to-pdf" />
      </div>
    </>
  );
}
