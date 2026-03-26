import type { FaqItem } from "@/lib/seo";

export type ToolFaqSectionProps = {
  faqs?: FaqItem[];
};

export function ToolFaqSection({ faqs }: ToolFaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
      <h2 className="text-lg font-extrabold tracking-[-0.02em]">FAQ</h2>
      <div className="mt-4 space-y-5">
        {faqs.map((item, index) => (
          <div key={`${item.question}-${index}`} className="space-y-1">
            <h3 className="text-sm font-semibold">{item.question}</h3>
            <p className="text-sm leading-6 text-[#6b6760]">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
