import Link from "next/link";
import { getTool, type ToolDefinition, TOOLS } from "@/lib/seo";

export type RelatedToolsProps = {
  currentSlug: ToolDefinition["slug"];
};

export function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const current = getTool(currentSlug);

  const relatedSlugs = current.related?.length
    ? current.related
    : (TOOLS as readonly ToolDefinition[])
        .filter((t) => t.slug !== currentSlug)
        .slice(0, 3)
        .map((t) => t.slug);

  const related = relatedSlugs
    .map((slug) => getTool(slug))
    .filter((t) => t.slug !== currentSlug)
    .slice(0, 3);

  return (
    <section className="mt-8 rounded-2xl border border-[#d4cfc4] bg-white p-5 shadow-[0_4px_24px_rgba(28,26,20,0.06)] sm:p-6">
      <div className="mb-1 text-xs uppercase tracking-[0.08em] text-[#6b6760]">Next up</div>
      <h2 className="text-xl font-extrabold tracking-[-0.02em]">Related tools</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.path}
            prefetch
            className="rounded-xl border border-[#d4cfc4] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_18px_rgba(28,26,20,0.08)]"
          >
            <div className="text-sm font-bold text-[#1c1a14]">{tool.title.split("—")[0].trim()}</div>
            <div className="mt-1 text-xs leading-5 text-[#6b6760]">
              {tool.description.slice(0, 95)}...
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
