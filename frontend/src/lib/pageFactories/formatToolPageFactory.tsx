import type { Metadata } from "next";
import type { ReactElement } from "react";
import { FormatConvertClient } from "@/components/FormatConvertClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import {
  FORMAT_TOOL_PAGE_CONFIGS,
  type FormatToolPageConfig,
  type FormatToolPageSlug,
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