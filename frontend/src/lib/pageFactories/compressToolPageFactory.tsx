import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CompressImageClient } from "@/app/compress-image/CompressImageClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import {
  COMPRESS_TOOL_PAGE_CONFIGS,
  type CompressToolPageConfig,
  type CompressToolPageSlug,
} from "@/lib/toolPageConfigs";

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