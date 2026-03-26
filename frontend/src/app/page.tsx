import Link from "next/link";
import { TOOLS } from "@/lib/seo";
import {
  ArrowLeftRight,
  CheckCircle2,
  Download,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Gauge,
  Minimize2,
  ImagePlus,
  FileImage,
  FileText,
} from "lucide-react";

export default function Home() {
  const getToolLabel = (title: string) => title.split("—")[0].trim();

  const featuredTools = [
    {
      title: "Image Converter",
      description: "Convert IMG, PNG, JPEG, AVIF, WebP, and more in seconds.",
      badge: "Quick convert",
      icon: ArrowLeftRight,
      iconClassName: "text-[#225ce0] bg-[#ecf2ff] border-[#d7e4ff]",
      href: "/image-converter",
    },
    {
      title: "Compress Images",
      description: "Reduce file size for JPG, PNG, WebP, AVIF, HEIC, and HEIF.",
      badge: "Browser-only",
      icon: Gauge,
      iconClassName: "text-[#087f5b] bg-[#e7f7f1] border-[#bde8d8]",
      href: "/compress-jpg",
    },
    {
      title: "Resize Image",
      description: "Resize images for social, web, and docs.",
      badge: "Edit",
      icon: Minimize2,
      iconClassName: "text-[#8a5a00] bg-[#fff5df] border-[#f5dfad]",
      href: "/resize-image",
    },
    {
      title: "Image to PDF",
      description: "Combine multiple images into one PDF in your browser.",
      badge: "PDF",
      icon: ImagePlus,
      iconClassName: "text-[#7b3fa8] bg-[#f7effd] border-[#ead6fb]",
      href: "/image-to-pdf",
    },
    {
      title: "PDF to Image",
      description: "Convert PDF pages to JPG, PNG, WebP, or AVIF instantly.",
      badge: "PDF",
      icon: FileImage,
      iconClassName: "text-[#a63d00] bg-[#fff0e9] border-[#ffd8c7]",
      href: "/pdf-to-image",
    },
    {
      title: "Government Form Photo",
      description: "Resize and compress images for government and job portals.",
      badge: "Govt-ready",
      icon: FileText,
      iconClassName: "text-[#1f6c8f] bg-[#eaf8ff] border-[#cdeeff]",
      href: "/resize-image-to-200kb",
    },
  ] as const;

  const trustPills = [
    { label: "100% Private", Icon: ShieldCheck },
    { label: "Instant conversion", Icon: Sparkles },
    { label: "Unlimited free", Icon: ArrowLeftRight },
    { label: "Works on iPhone & Android", Icon: Smartphone },
  ] as const;

  const howToUseSteps = [
    {
      title: "Upload your image",
      description: "Drop JPG, PNG, WebP, AVIF, or HEIC files into the uploader.",
      Icon: MousePointerClick,
    },
    {
      title: "Pick output format",
      description: "Choose convert, compress, resize, or export to PDF.",
      Icon: ArrowLeftRight,
    },
    {
      title: "Download instantly",
      description: "Save the final file right away with one click.",
      Icon: Download,
    },
  ] as const;

  const statsCards = [
    { value: "100%", label: "Free forever" },
    { value: "0 bytes", label: "Uploaded" },
    { value: "Mobile", label: "Ready" },
    { value: "iPhone", label: "Supported" },
  ] as const;

  const sectionStyleFeatured = { contentVisibility: "auto", containIntrinsicSize: "720px" } as const;
  const sectionStyleStats = { contentVisibility: "auto", containIntrinsicSize: "320px" } as const;
  const sectionStyleHowTo = { contentVisibility: "auto", containIntrinsicSize: "560px" } as const;
  const sectionStyleAllTools = { contentVisibility: "auto", containIntrinsicSize: "820px" } as const;

  const toolsForHome = [...TOOLS].sort((a, b) => {
    const aLabel = getToolLabel(a.title);
    const bLabel = getToolLabel(b.title);
    return aLabel.localeCompare(bLabel);
  });

  const getToolCategory = (slug: string): "Convert" | "PDF" | "Compress" | "Resize" | "Other" => {
    if (slug.includes("pdf")) return "PDF";
    if (slug.includes("compress")) return "Compress";
    if (slug.includes("resize")) return "Resize";

    if (
      slug.includes("to-") ||
      slug === "image-converter" ||
      slug.includes("heic") ||
      slug.includes("heif")
    ) {
      return "Convert";
    }

    return "Other";
  };

  const orderedCategories: Array<"Convert" | "PDF" | "Compress" | "Resize" | "Other"> = [
    "Convert",
    "PDF",
    "Compress",
    "Resize",
    "Other",
  ];

  const groupedTools = orderedCategories
    .map((category) => ({
      category,
      tools: toolsForHome.filter((tool) => getToolCategory(tool.slug) === category),
    }))
    .filter((group) => group.tools.length > 0);

  const getToolIcon = (slug: string) => {
    if (slug.includes("compress")) return Gauge;
    if (slug.includes("resize")) return Minimize2;
    if (slug.includes("pdf")) return FileText;
    if (slug.includes("heic")) return Smartphone;
    if (slug.includes("image-converter")) return ArrowLeftRight;
    if (
      slug.includes("jpg") ||
      slug.includes("png") ||
      slug.includes("webp") ||
      slug.includes("avif")
    ) {
      return FileImage;
    }
    return ImagePlus;
  };

  const getToolIconBadgeClass = (slug: string) => {
    if (slug.includes("compress")) return "border-[#bde8d8] bg-[#e7f7f1] text-[#087f5b]";
    if (slug.includes("resize")) return "border-[#f5dfad] bg-[#fff5df] text-[#8a5a00]";
    if (slug.includes("pdf")) return "border-[#ead6fb] bg-[#f7effd] text-[#7b3fa8]";
    if (slug.includes("heic")) return "border-[#dfd9cd] bg-[#f2f0ea] text-[#1c1a14]";
    if (slug.includes("image-converter")) return "border-[#d7e4ff] bg-[#ecf2ff] text-[#225ce0]";
    if (slug.includes("jpg")) return "border-[#ffd8c7] bg-[#fff0e9] text-[#a63d00]";
    if (slug.includes("png")) return "border-[#cdeeff] bg-[#eaf8ff] text-[#1f6c8f]";
    if (slug.includes("webp")) return "border-[#d9edc2] bg-[#eef8e3] text-[#477a1e]";
    if (slug.includes("avif")) return "border-[#f7d8e5] bg-[#fff0f6] text-[#9d2f62]";
    return "border-[#e3ddd2] bg-[#fffdf9] text-[#6b6760]";
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-3 pb-10 pt-10 sm:px-5 lg:px-6">
      <section className="relative overflow-hidden rounded-[24px] border border-[#d4cfc4] bg-[#fffdf9] px-5 py-12 text-center sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4cfc4]/60" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d4cfc4]/40" />

        <div className="relative z-10 mx-auto inline-flex items-center gap-2 rounded-full border border-[#d4cfc4] bg-[#ede8df] px-4 py-2 text-xs font-semibold text-[#6b6760]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8672a] text-white">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
          </span>
          Free forever · No sign-up · iPhone-friendly
        </div>

        <h1 className="relative z-10 mt-6 text-balance text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          Convert and compress images.
          <span className="block text-[#e8672a]">Instantly.</span>
        </h1>
        <p className="relative z-10 mt-3 text-lg italic text-[#6b6760] [font-family:Georgia,'Times New Roman',serif]">
          Your files never leave your device.
        </p>

        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-2">
          {trustPills.map(({ label, Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-3 py-1.5 text-xs font-semibold text-[#2a7a5e]"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[20px] border border-[#d4cfc4] bg-white p-5 sm:p-6" style={sectionStyleFeatured}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold tracking-[-0.03em]">Featured tools</h2>
          <span className="text-xs text-[#6b6760] [font-family:var(--font-jetbrains-mono),monospace]">
            quick start
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              prefetch
              className="group rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 transition hover:-translate-y-0.5 hover:border-[#e8672a] hover:shadow-[0_8px_20px_rgba(28,26,20,0.08)]"
            >
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${tool.iconClassName}`}
              >
                <tool.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold">{tool.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6b6760]">{tool.description}</p>
              <span className="mt-3 inline-flex rounded-full border border-[#d4cfc4] px-2.5 py-1 text-[11px] font-semibold text-[#6b6760]">
                {tool.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[20px] bg-[#1c1a14] p-6 text-[#f7f3ec] sm:p-8" style={sectionStyleStats}>
        <div className="mb-5 flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-[#f7f3ec]/55">
          <span>Trusted by creators</span>
          <span>Live in browser</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {statsCards.map((card) => (
            <div
              key={card.value}
              className="flex min-h-[92px] flex-col justify-between rounded-xl border border-[#f7f3ec]/15 bg-[#2a2720] p-3"
            >
              <div className="text-3xl leading-none text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
                {card.value}
              </div>
              <div className="text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">{card.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[20px] border border-[#d4cfc4] bg-white p-5 sm:p-6" style={sectionStyleHowTo}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold tracking-[-0.03em]">How to use</h2>
          <span className="text-xs text-[#6b6760] [font-family:var(--font-jetbrains-mono),monospace]">
            3 simple steps
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {howToUseSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7e4ff] bg-[#ecf2ff] text-[#225ce0]">
                  <step.Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-[#6b6760]">0{index + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-[#1c1a14]">{step.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6b6760]">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2a7a5e]">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          No account required. Start instantly.
        </div>
      </section>

      <section id="all-tools" className="mt-7 scroll-mt-24 sm:scroll-mt-28" style={sectionStyleAllTools}>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em]">All tools</h2>
          <span className="text-xs text-[#6b6760] [font-family:var(--font-jetbrains-mono),monospace]">
            {TOOLS.length} tools
          </span>
        </div>

        <div className="space-y-6">
          {groupedTools.map((group) => (
            <div key={group.category} className="rounded-2xl border border-[#d4cfc4] bg-[#fffdf9] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#1c1a14]">
                  {group.category}
                </h3>
                <span className="rounded-full border border-[#d4cfc4] px-2.5 py-1 text-[11px] font-semibold text-[#6b6760]">
                  {group.tools.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.tools.map((tool) => {
                  const ToolIcon = getToolIcon(tool.slug);
                  const iconBadgeClass = getToolIconBadgeClass(tool.slug);

                  return (
                    <Link
                      key={tool.slug}
                      href={tool.path}
                      prefetch
                      className="flex items-center gap-2 rounded-xl border border-[#d4cfc4] bg-white px-3 py-3 text-sm font-semibold text-[#1c1a14] transition hover:border-[#e8672a] hover:bg-[#fff7f2]"
                    >
                      <span
                        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${iconBadgeClass}`}
                      >
                        <ToolIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="truncate">{getToolLabel(tool.title)}</span>
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
