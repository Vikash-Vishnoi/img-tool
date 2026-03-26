import type { Metadata } from "next";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("jpg-to-pdf");

export const metadata: Metadata = generateToolMetadata(tool);

export default function JpgToPdfPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ImageToPdfClient
        title="JPG to PDF Converter"
        description="Convert JPG and JPEG images into one PDF in your browser. Files stay on your device."
        inputLabel="Upload JPG/JPEG images"
        accept={["image/jpeg", ".jpg", ".jpeg"]}
        uploadHelperText="You can select multiple JPG/JPEG images. Max file size 100 MB each (up to 30 images)."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="jpg-to-pdf" />
      </div>
    </>
  );
}
