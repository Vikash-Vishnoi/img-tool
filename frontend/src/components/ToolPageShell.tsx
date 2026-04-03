import type { ReactNode } from "react";
import Link from "next/link";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolFaqSection } from "@/components/ToolFaqSection";
import { ToolSchema } from "@/components/ToolSchema";
import { BLOG_POSTS } from "@/lib/blog";
import {
  getTool,
  getToolFaqs,
  getToolHowTo,
  getToolHub,
  getToolSiblingRoutes,
  getToolWidgetGroup,
  type ToolDefinition,
} from "@/lib/seo";

export type ToolPageShellProps = {
  tool: ToolDefinition;
  children: ReactNode;
  showFaq?: boolean;
  footerPaddingClassName?: string;
};

function shouldShowFormatComparison(slug: string): boolean {
  if (slug === "image-converter") {
    return true;
  }

  if (slug.startsWith("pdf-to-") || slug.endsWith("-to-pdf")) {
    return false;
  }

  return /-to-(jpg|png|webp|avif)$/.test(slug);
}

function getToolUseCases(slug: string): string[] {
  if (slug === "image-converter") {
    return [
      "Normalize mixed image extensions before client delivery or upload.",
      "Convert one file set into a single required output format for faster reviews.",
      "Create compatible versions for apps and portals that reject modern formats.",
    ];
  }

  if (slug.startsWith("compress-")) {
    return [
      "Reduce file size for strict upload caps on forms, HR portals, and job sites.",
      "Prepare lightweight images for WhatsApp or email without obvious quality loss.",
      "Create backup variants just below size limits to avoid random validation errors.",
    ];
  }

  if (slug.startsWith("resize-")) {
    return [
      "Match exact width-height requirements before upload validation runs.",
      "Prepare photo and signature variants for different portal slots.",
      "Generate consistent social or marketplace image dimensions with reusable presets.",
    ];
  }

  if (slug.endsWith("-to-pdf") || slug === "image-to-pdf") {
    return [
      "Bundle multiple images into one document for submission workflows.",
      "Create portal-ready PDFs from mobile captures with correct page sequence.",
      "Share one clean, printable file instead of scattered image attachments.",
    ];
  }

  if (slug.startsWith("pdf-to-")) {
    return [
      "Extract page previews from PDFs for social sharing or quick review.",
      "Convert document pages into image files accepted by image-only upload fields.",
      "Prepare single-page visuals from larger PDFs for presentations and chat workflows.",
    ];
  }

  return [
    "Convert files into a format accepted by your destination portal or app.",
    "Prepare compatibility-safe versions before sharing across mixed devices.",
    "Create upload-ready outputs with clear quality and practical file size.",
  ];
}

export function ToolPageShell({
  tool,
  children,
  showFaq = false,
  footerPaddingClassName = "pb-14",
}: ToolPageShellProps) {
  const faqs = showFaq ? getToolFaqs(tool) : undefined;
  const howTo = getToolHowTo(tool);
  const hubTool = getToolHub(tool);
  const siblingRoutes = getToolSiblingRoutes(tool);
  const widgetGroup = getToolWidgetGroup(tool);
  const relatedTools = [...(tool.related ?? []), ...siblingRoutes.map((sibling) => sibling.slug)]
    .filter((slug, index, list) => list.indexOf(slug) === index)
    .slice(0, 3)
    .map((slug) => getTool(slug));
  const relatedGuides = BLOG_POSTS
    .filter((post) => post.hubToolPaths.includes(tool.path))
    .slice(0, 2);
  const toolUseCases = getToolUseCases(tool.slug);
  const showFormatComparison = shouldShowFormatComparison(tool.slug);
  const comparisonHeaders = showFormatComparison
    ? { left: "Format", middle: "Best for", right: "Watch out for" }
    : { left: "Priority", middle: "What to verify", right: "Quick action" };
  const comparisonRows = showFormatComparison
    ? [
        {
          left: "JPG",
          middle: "Photos, fast uploads, broad compatibility",
          right: "Repeated edits can reduce clarity",
        },
        {
          left: "PNG",
          middle: "Graphics, text-heavy images, transparency",
          right: "Files can be larger than JPG/WebP",
        },
        {
          left: "WebP",
          middle: "Web use, lower transfer size",
          right: "Some older systems may need JPG fallback",
        },
        {
          left: "AVIF",
          middle: "High compression with practical visual quality",
          right: "Legacy app compatibility can vary",
        },
      ]
    : [
        {
          left: "Dimensions first",
          middle: "Match exact width-height requirement from portal notice",
          right: "Apply preset or custom pixel values before size tuning",
        },
        {
          left: "Format compliance",
          middle: "Confirm accepted extension (JPG/PNG/PDF)",
          right: "Convert once, then keep one backup in accepted format",
        },
        {
          left: "Size buffer",
          middle: "Stay slightly below hard limits to avoid random rejection",
          right: "Target 5 to 10 percent under the published cap",
        },
        {
          left: "Final readability",
          middle: "Check text, faces, and signatures at full zoom",
          right: "Re-export from original source if output looks soft",
        },
      ];
  const targetSizeTool = getTool("resize-image-to-200kb");
  const compressTool = getTool("compress-image");

  return (
    <>
      <ToolSchema tool={tool} />
      {children}
      <div className={`mx-auto w-full max-w-6xl px-4 ${footerPaddingClassName} sm:px-6 lg:px-8`}>
        <section
          className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7"
          aria-labelledby={`${tool.slug}-howto-heading`}
        >
          <h2
            id={`${tool.slug}-howto-heading`}
            className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]"
          >
            {howTo.name}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">{howTo.description}</p>

          <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {howTo.steps.map((step, index) => (
              <li
                key={step.id}
                id={step.id}
                className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4"
              >
                <span className="inline-flex rounded-full border border-[#edcfbe] bg-[#fff3ed] px-2 py-0.5 text-[11px] font-semibold text-[#a34a24]">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 text-base font-bold text-[#1c1a14]">{step.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[#6b6760]">{step.text}</p>
              </li>
            ))}
          </ol>

          {relatedTools.length > 0 ? (
            <p className="mt-4 text-sm leading-7 text-[#6b6760]">
              Related workflows: {relatedTools.map((relatedTool, index) => (
                <span key={relatedTool.slug}>
                  <Link
                    href={relatedTool.path}
                    prefetch={false}
                    className="font-semibold text-[#1c1a14] underline-offset-2 hover:text-[#c75322] hover:underline"
                  >
                    {relatedTool.title}
                  </Link>
                  {index < relatedTools.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ) : null}
        </section>

        <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Common use cases</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            Use this route when one specific file rule is blocking your upload, review, or sharing workflow.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
            {toolUseCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </section>

        <section
          role="note"
          className="privacy-note mt-6 rounded-3xl border border-[#f0c7b0] bg-[#fff7f2] p-6 sm:p-7"
        >
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Privacy and on-device processing</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            Files never leave your device while you use this tool. Processing runs directly in your browser session so you can validate
            results before download without sending source files to an external upload queue.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            For sensitive workflows, keep one local backup copy and verify format, dimensions, and size after export. That simple review
            step prevents most last-minute rejection loops on strict portals and form systems.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Hub and sibling routes</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            Use the hub for the main workflow, then switch to sibling routes when a portal demands a specific format or preset.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={hubTool.path}
              prefetch={false}
              className="rounded-2xl border border-[#edcfbe] bg-[#fff3ed] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_24px_rgba(28,26,20,0.08)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#a34a24]">Hub page</p>
              <h3 className="mt-1 text-sm font-bold leading-6 text-[#1c1a14]">{hubTool.title}</h3>
            </Link>
            {siblingRoutes.map((sibling) => (
              <Link
                key={sibling.slug}
                href={sibling.path}
                prefetch={false}
                className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_24px_rgba(28,26,20,0.08)]"
              >
                <h3 className="text-sm font-bold leading-6 text-[#1c1a14]">{sibling.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        {widgetGroup ? (
          <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">{widgetGroup.heading}</h2>
            <p className="mt-3 text-sm leading-7 text-[#6b6760]">{widgetGroup.description}</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {widgetGroup.tools.map((widgetTool) => (
                <Link
                  key={widgetTool.slug}
                  href={widgetTool.path}
                  prefetch={false}
                  className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_24px_rgba(28,26,20,0.08)]"
                >
                  <h3 className="text-sm font-bold leading-6 text-[#1c1a14]">
                    {widgetTool.title.split("—")[0].trim()}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Quick comparison table</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            Use this table as a fast decision layer before final export so you avoid avoidable retries in upload and review workflows.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#d4cfc4] text-left text-[#6b6760]">
                  <th className="px-3 py-2 font-semibold">{comparisonHeaders.left}</th>
                  <th className="px-3 py-2 font-semibold">{comparisonHeaders.middle}</th>
                  <th className="px-3 py-2 font-semibold">{comparisonHeaders.right}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr
                    key={`${row.left}-${index}`}
                    className={index < comparisonRows.length - 1 ? "border-b border-[#ece7dd] text-[#1c1a14]" : "text-[#1c1a14]"}
                  >
                    <td className="px-3 py-2 font-semibold">{row.left}</td>
                    <td className="px-3 py-2">{row.middle}</td>
                    <td className="px-3 py-2">{row.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-[#f0c7b0] bg-[#fff7f2] p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Upload rejected? Try this quick fix flow</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
            <li>Confirm required format first (JPG/PNG/PDF) before adjusting any other setting.</li>
            <li>Match exact dimensions when a portal requires strict width and height.</li>
            <li>Keep final size slightly below the limit (for example 190KB for a 200KB cap).</li>
          </ul>
          <p className="mt-4 text-sm leading-7 text-[#6b6760]">
            Useful helpers: <Link href={compressTool.path} prefetch={false} className="font-semibold text-[#1c1a14] underline-offset-2 hover:text-[#c75322] hover:underline">{compressTool.title}</Link> and <Link href={targetSizeTool.path} prefetch={false} className="font-semibold text-[#1c1a14] underline-offset-2 hover:text-[#c75322] hover:underline">{targetSizeTool.title}</Link>.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Quality control before final upload</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            Most failed uploads come from one missed rule during final export. A short quality control pass keeps workflow speed high while
            reducing repeated edits. Focus on dimensions, format, and readability in that order because each downstream validator checks
            those values independently.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            When a file still fails, change only one variable at a time and test again. Controlled retries make it easier to isolate
            the real failure cause compared with random full-reset edits.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#6b6760]">
            <li>Re-check extension and MIME expectation before the next upload attempt.</li>
            <li>Confirm final file size after export and keep a small margin under strict limits.</li>
            <li>Preview at 100 percent zoom to validate face detail, text edges, and signature strokes.</li>
            <li>Keep one approved backup copy so urgent re-uploads take seconds, not minutes.</li>
          </ul>
        </section>

        <section className="mt-6 rounded-3xl border border-[#d4cfc4] bg-white p-6 sm:p-7">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1c1a14]">Guides for this workflow</h2>
          <p className="mt-3 text-sm leading-7 text-[#6b6760]">
            Read one focused guide before final upload to avoid common rejection mistakes.
          </p>
          {relatedGuides.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/blog/${guide.slug}`}
                  prefetch={false}
                  className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_24px_rgba(28,26,20,0.08)]"
                >
                  <h3 className="text-sm font-bold leading-6 text-[#1c1a14]">{guide.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#6b6760]">{guide.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-[#6b6760]">
              Browse all practical walkthroughs in the{" "}
              <Link
                href="/blog"
                prefetch={false}
                className="font-semibold text-[#1c1a14] underline-offset-2 hover:text-[#c75322] hover:underline"
              >
                Image Tools blog
              </Link>
              {" "}to find route-specific examples and troubleshooting patterns.
            </p>
          )}
        </section>

        <div className="mt-16 sm:mt-10">
          {showFaq ? <ToolFaqSection faqs={faqs} heading={tool.faqHeading} /> : null}
          <RelatedTools currentSlug={tool.slug} />
        </div>
      </div>
    </>
  );
}
