import FAQSection from "@/components/FAQSection";
import type { FaqItem } from "@/lib/seo";

export type ToolFaqSectionProps = {
  faqs?: FaqItem[];
  heading?: string;
};

export function ToolFaqSection({ faqs, heading }: ToolFaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return <FAQSection faqs={faqs} heading={heading} />;
}
