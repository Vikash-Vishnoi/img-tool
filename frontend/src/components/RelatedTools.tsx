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
    <section className="mt-10 rounded-2xl border border-foreground/10 bg-background p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Related tools</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.path}
            className="rounded-2xl border border-foreground/10 p-4 transition-colors hover:bg-foreground/[0.03]"
          >
            <div className="text-sm font-semibold">{tool.title}</div>
            <div className="mt-1 text-sm text-foreground/70">
              {tool.description}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
