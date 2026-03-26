import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  FileImage,
  FileText,
  Infinity,
  Lock,
  RefreshCw,
  Ruler,
  Shrink,
  Smartphone,
  Zap,
} from "lucide-react";
import { TOOLS } from "@/lib/seo";

type FeaturedIcon =
  | "converter"
  | "compress"
  | "resize"
  | "imagePdf"
  | "pdfImage"
  | "resize200kb";

const featuredIconMap: Record<FeaturedIcon, LucideIcon> = {
  converter: RefreshCw,
  compress: Shrink,
  resize: Ruler,
  imagePdf: FileText,
  pdfImage: FileImage,
  resize200kb: Shrink,
};

function getToolIcon(slug: string): LucideIcon {
  if (slug === "image-converter") return RefreshCw;
  if (slug.includes("-to-pdf") || slug === "image-to-pdf") return FileText;
  if (slug.includes("compress")) return Shrink;
  if (slug.includes("resize")) return Ruler;
  if (slug.startsWith("heic")) return Smartphone;
  return FileImage;
}

type ToolCategory = "Convert" | "PDF" | "Compress" | "Resize";

function getToolCategory(slug: string): ToolCategory {
  if (slug.includes("compress")) return "Compress";
  if (slug.includes("resize")) return "Resize";
  if (slug.includes("-to-pdf") || slug === "image-to-pdf" || slug.startsWith("pdf-to-")) {
    return "PDF";
  }
  return "Convert";
}

export default function Home() {
  const trustPills = [
    { label: "100% Private", icon: Lock },
    { label: "Instant conversion", icon: Zap },
    { label: "Unlimited free", icon: Infinity },
    { label: "Works on mobile", icon: Smartphone },
  ] as const;

  const featuredTools = [
    {
      title: "Image Converter (Online & Free)",
      description:
        "Convert JPG, PNG, WebP, and AVIF formats in seconds, directly in your browser.",
      badge: "Most searched",
      meta: "JPG to PNG, PNG to JPG",
      icon: "converter" as const,
      href: "/image-converter",
    },
    {
      title: "Image Compressor (Reduce KB)",
      description:
        "Compress JPG, PNG, and WebP images online without noticeable quality loss.",
      badge: "No upload",
      meta: "Compress image to 200KB",
      icon: "compress" as const,
      href: "/compress-image",
    },
    {
      title: "Resize Image (Pixels & KB)",
      description:
        "Resize photos by width and height for websites, forms, and social media posts.",
      badge: "Editor",
      meta: "Custom dimensions",
      icon: "resize" as const,
      href: "/resize-image",
    },
    {
      title: "Image to PDF Converter",
      description:
        "Convert multiple JPG, PNG, or WebP files into a single PDF online.",
      badge: "PDF",
      meta: "Merge images to PDF",
      icon: "imagePdf" as const,
      href: "/image-to-pdf",
    },
    {
      title: "PDF to Image",
      description:
        "Convert PDF pages to JPG, PNG, or WebP images quickly in your browser.",
      badge: "PDF",
      meta: "Extract pages as images",
      icon: "pdfImage" as const,
      href: "/pdf-to-image",
    },
    {
      title: "Resize Image to 200KB",
      description:
        "Resize and compress images to a 200KB target for forms and quick uploads.",
      badge: "Target size",
      meta: "Government upload ready",
      icon: "resize200kb" as const,
      href: "/resize-image-to-200kb",
    },
  ] as const;

  const orderedSlugs = [
    "image-converter",
    "compress-image",
    "resize-image",
    "resize-image-to-200kb",
    "heic-to-png",
    "image-to-pdf",
    "jpg-to-pdf",
    "png-to-pdf",
    "heic-to-pdf",
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Choose a tool",
      description:
        "Pick a converter, compressor, or PDF tool based on what you need.",
      detail: "No account required",
    },
    {
      step: "02",
      title: "Add your images",
      description:
        "Drop files in, adjust options if needed, and preview before processing.",
      detail: "Works on desktop and mobile",
    },
    {
      step: "03",
      title: "Download instantly",
      description:
        "Get the converted or optimized file right away, fully on your device.",
      detail: "Private by default",
    },
  ] as const;

  const toolsForHome = [...TOOLS].sort((a, b) => {
    const indexA = orderedSlugs.indexOf(a.slug);
    const indexB = orderedSlugs.indexOf(b.slug);

    const rankA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const rankB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    if (rankA !== rankB) return rankA - rankB;

    const aLabel = a.title.split("—")[0].trim();
    const bLabel = b.title.split("—")[0].trim();
    return aLabel.localeCompare(bLabel);
  });

  const categoryOrder: ToolCategory[] = ["Convert", "PDF", "Compress", "Resize"];
  const categorizedTools = categoryOrder
    .map((category) => ({
      category,
      tools: toolsForHome.filter((tool) => getToolCategory(tool.slug) === category),
    }))
    .filter((group) => group.tools.length > 0);

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 pb-10 pt-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[24px] border border-[#d4cfc4] bg-[#fffdf9] px-5 py-12 text-center sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4cfc4]/60" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4cfc4]/40" />

        <div className="relative z-10 mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">
            ✦
          </span>
          Free forever · No sign-up · Private by default
        </div>

        <h1 className="relative z-10 mt-6 text-balance text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          Convert and compress images.
          <span className="block text-[#e8672a]">Instantly.</span>
        </h1>
        <p className="relative z-10 mt-3 text-lg italic text-[#6b6760] [font-family:Georgia,'Times New Roman',serif]">
          Your files never leave your device.
        </p>

        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-2">
          {trustPills.map((pill) => {
            const Icon = pill.icon;

            return (
              <span
                key={pill.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-3 py-1.5 text-xs font-semibold text-[#2a7a5e]"
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.1} aria-hidden="true" />
                {pill.label}
              </span>
            );
          })}
        </div>
      </section>

      <section
        className="mt-7 rounded-[20px] border border-[#d4cfc4] bg-white p-5 sm:p-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "760px" }}
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.09em] text-[#6b6760]">
              Featured
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em]">
              Start with the most-used tools
            </h2>
          </div>
          <Link
            href="/image-converter"
            prefetch
            className="inline-flex rounded-full border border-[#d4cfc4] bg-[#fffdf9] px-3 py-1.5 text-[11px] font-semibold text-[#6b6760] transition hover:border-[#e8672a] hover:text-[#1c1a14]"
          >
            Open converter
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => {
            const Icon = featuredIconMap[tool.icon];

            return (
              <Link
                key={tool.title}
                href={tool.href}
                prefetch
                className="group flex h-full flex-col rounded-2xl border border-[#d4cfc4] bg-[#f7f3ec] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_20px_rgba(28,26,20,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#edcfbe] bg-[#fff3ed] text-[#c75322]">
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <span className="inline-flex rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6b6760]">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold leading-5">{tool.title}</h3>
                <p className="mt-2 min-h-[58px] text-xs leading-5 text-[#6b6760]">
                  {tool.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#e8e1d6] pt-3">
                  <span className="rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-2.5 py-1 text-[11px] font-semibold text-[#2a7a5e]">
                    {tool.meta}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#a34a24] transition group-hover:translate-x-0.5">
                    Open tool
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section
        className="mt-7 overflow-hidden rounded-[20px] border border-[#d4cfc4] bg-[#fff7f2] p-5 sm:p-6"
        style={{ contentVisibility: "auto", containIntrinsicSize: "540px" }}
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.09em] text-[#8b5a42]">
              How it works
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">3 simple steps</h2>
          </div>
          <Link
            href="/image-converter"
            prefetch
            className="hidden rounded-full border border-[#e8672a] bg-[#e8672a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d4581f] sm:inline-flex"
          >
            Try it now
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {howItWorksSteps.map((item) => (
            <div key={item.step} className="rounded-2xl border border-[#edcfbe] bg-white p-4">
              <div className="inline-flex rounded-full border border-[#f2d9cb] bg-[#fff3ed] px-2.5 py-1 text-[11px] font-bold text-[#c75322] [font-family:var(--font-jetbrains-mono),monospace]">
                Step {item.step}
              </div>
              <h3 className="mt-3 text-base font-extrabold tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#6b6760]">{item.description}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9a7f6d]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/image-converter"
          prefetch
          className="mt-4 inline-flex rounded-full border border-[#e8672a] bg-[#e8672a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d4581f] sm:hidden"
        >
          Try it now
        </Link>
      </section>

      <section
        className="mt-7 rounded-[20px] bg-[#1c1a14] p-6 text-[#f7f3ec] sm:p-8"
        style={{ contentVisibility: "auto", containIntrinsicSize: "320px" }}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              100%
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">
              Free forever
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              0 bytes
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">Uploaded</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              Mobile
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">Ready</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              24/7
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">
              Available
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7" style={{ contentVisibility: "auto", containIntrinsicSize: "820px" }}>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em]">All tools</h2>
          <span className="text-xs text-[#6b6760] [font-family:var(--font-jetbrains-mono),monospace]">
            {TOOLS.length} tools
          </span>
        </div>

        <div className="space-y-5">
          {categorizedTools.map((group) => (
            <div key={group.category} className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#6b6760]">
                  {group.category}
                </h3>
                <span className="rounded-full border border-[#d4cfc4] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6b6760]">
                  {group.tools.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.tools.map((tool) => {
                  const Icon = getToolIcon(tool.slug);

                  return (
                    <Link
                      key={tool.slug}
                      href={tool.path}
                      prefetch
                      className="flex items-center gap-2 rounded-xl border border-[#d4cfc4] bg-white px-3 py-3 text-sm font-semibold text-[#1c1a14] transition hover:border-[#e8672a] hover:bg-[#fff7f2]"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e8e1d6] bg-[#fff7f2] text-[#a34a24]">
                        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="truncate">{tool.title.split("—")[0].trim()}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
