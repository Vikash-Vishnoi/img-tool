import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import {
  PDF_TOOL_PAGE_CONFIGS,
  type PdfToolPageConfig,
  type PdfToolPageSlug,
} from "@/lib/toolPageConfigs";

export function createPdfToolPage(slug: PdfToolPageSlug): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const tool = getTool(slug);
  const config: PdfToolPageConfig = PDF_TOOL_PAGE_CONFIGS[slug];

  const metadata = generateToolMetadata(tool);

  function Page() {
    return (
      <ToolPageShell tool={tool} showFaq footerPaddingClassName="pb-10">
        <ImageToPdfClient
          title={config.title}
          description={config.description}
          inputLabel={config.inputLabel}
          accept={config.accept}
          uploadHelperText={config.uploadHelperText}
        />
      </ToolPageShell>
    );
  }

  return { metadata, Page };
}