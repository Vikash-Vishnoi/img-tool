import type { Metadata } from "next";
import { FormatConvertClient } from "@/components/FormatConvertClient";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolSchema } from "@/components/ToolSchema";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("image-converter");

export const metadata: Metadata = generateToolMetadata(tool);

export default function ImageConverterPage() {
  return (
    <>
      <ToolSchema tool={tool} />

      <FormatConvertClient
        from="jpg"
        to="png"
        title="Universal Image Converter"
        description="Upload JPG, JPEG, PNG, WebP, AVIF, or HEIC/HEIF and convert to your chosen output extension directly in the browser."
        inputLabel="Upload image files"
        allowOutputSourceFormat
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <RelatedTools currentSlug="image-converter" />
      </div>
    </>
  );
}
