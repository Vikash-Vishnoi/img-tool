import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { FormatConvertClient } from "@/components/FormatConvertClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import {
  FORMAT_TOOL_PAGE_CONFIGS,
  PDF_TOOL_PAGE_CONFIGS,
  type FormatToolPageConfig,
  type FormatToolPageSlug,
  type PdfToolPageConfig,
  type PdfToolPageSlug,
} from "@/lib/toolPageConfigs";

export function createFormatToolPage(slug: FormatToolPageSlug): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const tool = getTool(slug);
  const config: FormatToolPageConfig = FORMAT_TOOL_PAGE_CONFIGS[slug];

  const metadata = generateToolMetadata(tool);

  function Page() {
    return (
      <ToolPageShell tool={tool} showFaq>
        <FormatConvertClient
          from={config.from}
          to={config.to}
          title={config.title}
          description={config.description ?? tool.description}
          inputLabel={config.inputLabel}
          allowOutputSourceFormat={config.allowOutputSourceFormat}
        />
      </ToolPageShell>
    );
  }

  return { metadata, Page };
}

export function createPdfToolPage(slug: PdfToolPageSlug): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const tool = getTool(slug);
  const config: PdfToolPageConfig = PDF_TOOL_PAGE_CONFIGS[slug];

  const metadata = generateToolMetadata(tool);

  function Page() {
    return (
      <ToolPageShell tool={tool} footerPaddingClassName="pb-10">
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
