import type { ReactNode } from "react";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolFaqSection } from "@/components/ToolFaqSection";
import { ToolSchema } from "@/components/ToolSchema";
import type { ToolDefinition } from "@/lib/seo";

export type ToolPageShellProps = {
  tool: ToolDefinition;
  children: ReactNode;
  showFaq?: boolean;
  footerPaddingClassName?: string;
};

export function ToolPageShell({
  tool,
  children,
  showFaq = false,
  footerPaddingClassName = "pb-14",
}: ToolPageShellProps) {
  return (
    <>
      <ToolSchema tool={tool} />
      {children}
      <div className={`mx-auto w-full max-w-6xl px-4 ${footerPaddingClassName} sm:px-6 lg:px-8`}>
        {showFaq ? <ToolFaqSection faqs={tool.faqs} /> : null}
        <RelatedTools currentSlug={tool.slug} />
      </div>
    </>
  );
}
