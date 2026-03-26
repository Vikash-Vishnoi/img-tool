import type { Metadata } from "next";
import { HeicToJpgClient } from "./HeicToJpgClient";
import { ToolPageShell } from "@/components/ToolPageShell";
import { generateToolMetadata, getTool } from "@/lib/seo";

const tool = getTool("heic-to-jpg");

export const metadata: Metadata = generateToolMetadata(tool);

export default function HeicToJpgPage() {
  return (
    <ToolPageShell tool={tool} showFaq>
      <HeicToJpgClient />
    </ToolPageShell>
  );
}
