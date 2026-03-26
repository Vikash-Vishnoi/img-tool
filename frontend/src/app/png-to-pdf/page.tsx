import type { Metadata } from "next";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("png-to-pdf");

export const metadata: Metadata = generateToolMetadata(tool);

export default function PngToPdfPage() {
  return (
    <>
      <ToolSchema tool={tool} />
      <ImageToPdfClient
        title="PNG to PDF Converter"
        description="Convert PNG images into one PDF in your browser. Files stay on your device."
        inputLabel="Upload PNG images"
        accept={["image/png", ".png"]}
        uploadHelperText="You can select multiple PNG images. Max file size 100 MB each (up to 30 images)."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="png-to-pdf" />
      </div>
    </>
  );
}
