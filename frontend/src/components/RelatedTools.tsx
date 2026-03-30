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
      <h2 className="text-base font-extrabold tracking-[-0.01em] text-[#1c1a14]">Related tools</h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={tool.path}
              prefetch
              className="block rounded-xl border border-[#d4cfc4] bg-white px-3 py-2 text-sm font-semibold text-[#1c1a14] transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_18px_rgba(28,26,20,0.08)]"
            >
              {tool.title.split("—")[0].trim()}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
