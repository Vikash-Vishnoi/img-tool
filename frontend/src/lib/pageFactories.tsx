import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CompressImageClient } from "@/app/compress-image/CompressImageClient";
import { ImageToPdfClient } from "@/app/image-to-pdf/ImageToPdfClient";
import { ResizeImageClient } from "@/app/resize-image/ResizeImageClient";
import { FormatConvertClient } from "@/components/FormatConvertClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import {
  COMPRESS_TOOL_PAGE_CONFIGS,
  FORMAT_TOOL_PAGE_CONFIGS,
  PDF_TOOL_PAGE_CONFIGS,
  RESIZE_TOOL_PAGE_CONFIGS,
  type CompressToolPageConfig,
  type CompressToolPageSlug,
  type FormatToolPageConfig,
  type FormatToolPageSlug,
  type PdfToolPageConfig,
  type PdfToolPageSlug,
  type ResizeToolPageConfig,
  type ResizeToolPageSlug,
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

export function createCompressToolPage(slug: CompressToolPageSlug): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const tool = getTool(slug);
  const config: CompressToolPageConfig = COMPRESS_TOOL_PAGE_CONFIGS[slug];

  const metadata = generateToolMetadata(tool);

  function Page() {
    return (
      <ToolPageShell tool={tool} showFaq>
        <CompressImageClient
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

export function createResizeToolPage(slug: ResizeToolPageSlug): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const tool = getTool(slug);
  const config: ResizeToolPageConfig = RESIZE_TOOL_PAGE_CONFIGS[slug];

  const metadata = generateToolMetadata(tool);

  function Page() {
    return (
      <ToolPageShell tool={tool} showFaq>
        <ResizeImageClient
          fixedTargetKb={config.fixedTargetKb}
          hideTargetSizeBox={config.hideTargetSizeBox}
          defaultPresetKey={config.defaultPresetKey}
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
