import { ResizeImageClient } from "../resize-image/ResizeImageClient";
import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("resize-image-to-200kb");

export const metadata: Metadata = generateToolMetadata(tool);

export default function ResizeImageTo200kbPage() {
  return (
    <ToolPageShell tool={tool}>
      <ResizeImageClient fixedTargetKb={200} hideTargetSizeBox defaultPresetKey="passport-india" />
    </ToolPageShell>
  );
}
