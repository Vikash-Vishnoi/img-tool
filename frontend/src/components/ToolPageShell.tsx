import type { ReactNode } from "react";
import { DeferredRender } from "@/components/DeferredRender";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolFaqSection } from "@/components/ToolFaqSection";
import { ToolSchema } from "@/components/ToolSchema";
import { getToolFaqs, type ToolDefinition } from "@/lib/seo";

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
  const faqs = showFaq ? getToolFaqs(tool) : undefined;

  return (
    <>
      <ToolSchema tool={tool} />
      {children}
      <div className={`mx-auto w-full max-w-6xl px-4 ${footerPaddingClassName} sm:px-6 lg:px-8`}>
        <div className="mt-16 sm:mt-10">
          <DeferredRender>
            {showFaq ? <ToolFaqSection faqs={faqs} heading={tool.faqHeading} /> : null}
            <RelatedTools currentSlug={tool.slug} />
          </DeferredRender>
        </div>
      </div>
    </>
  );
}
