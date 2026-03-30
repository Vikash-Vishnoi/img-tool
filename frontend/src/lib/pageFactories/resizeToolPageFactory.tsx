import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ResizeImageClient } from "@/app/resize-image/ResizeImageClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";
import {
  RESIZE_TOOL_PAGE_CONFIGS,
  type ResizeToolPageConfig,
  type ResizeToolPageSlug,
} from "@/lib/toolPageConfigs";

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