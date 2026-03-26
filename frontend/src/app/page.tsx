import Link from "next/link";
import { TOOLS } from "@/lib/seo";

export default function Home() {
  const featuredTools = [
    {
      title: "Universal Image Converter",
      description: "Upload once, pick output format, and convert instantly.",
      badge: "Start here",
      icon: "🔄",
      href: "/image-converter",
    },
    {
      title: "Compress Images",
      description: "Reduce file size for JPG/PNG/WebP without uploading.",
      badge: "Browser-only",
      icon: "🗜️",
      href: "/compress-image",
    },
    {
      title: "Resize Image",
      description: "Resize images for social, web, and docs.",
      badge: "Edit",
      icon: "📐",
      href: "/resize-image",
    },
    {
      title: "Image to PDF",
      description: "Combine multiple images into one PDF in your browser.",
      badge: "PDF",
      icon: "📄",
      href: "/image-to-pdf",
    },
    {
      title: "JPG to PDF",
      description: "Turn JPG/JPEG files into a single PDF quickly.",
      badge: "PDF",
      icon: "🖼️",
      href: "/jpg-to-pdf",
    },
    {
      title: "PNG to PDF",
      description: "Convert multiple PNG images to one PDF file.",
      badge: "PDF",
      icon: "📘",
      href: "/png-to-pdf",
    },
    {
      title: "HEIC to PDF",
      description: "Convert iPhone HEIC/HEIF photos to PDF on-device.",
      badge: "iPhone",
      icon: "📱",
      href: "/heic-to-pdf",
    },
  ] as const;

  const toolsForHome = [...TOOLS].sort((a, b) => {
    const aLabel = a.title.split("—")[0].trim();
    const bLabel = b.title.split("—")[0].trim();
    return aLabel.localeCompare(bLabel);
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
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
          {[
            "🔒 100% Private",
            "⚡ Instant conversion",
            "♾ Unlimited free",
            "📱 Works on mobile",
          ].map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-3 py-1.5 text-xs font-semibold text-[#2a7a5e]"
            >
              {pill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[20px] border border-[#d4cfc4] bg-white p-5 sm:p-6" style={{ contentVisibility: "auto", containIntrinsicSize: "720px" }}>
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
              <div className="mb-2 text-2xl">{tool.icon}</div>
              <h3 className="text-sm font-bold">{tool.title}</h3>
              <p className="mt-1 text-xs leading-5 text-[#6b6760]">{tool.description}</p>
              <span className="mt-3 inline-flex rounded-full border border-[#d4cfc4] px-2.5 py-1 text-[11px] font-semibold text-[#6b6760]">
                {tool.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[20px] bg-[#1c1a14] p-6 text-[#f7f3ec] sm:p-8" style={{ contentVisibility: "auto", containIntrinsicSize: "320px" }}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div>
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              100%
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">Free forever</div>
          </div>
          <div>
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              0 bytes
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">Uploaded</div>
          </div>
          <div>
            <div className="text-3xl text-[#f0c744] [font-family:var(--font-jetbrains-mono),monospace]">
              Mobile
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.08em] text-[#f7f3ec]/55">Ready</div>
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {toolsForHome.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.path}
              prefetch
              className="rounded-xl border border-[#d4cfc4] bg-white px-3 py-3 text-sm font-semibold text-[#1c1a14] transition hover:border-[#e8672a] hover:bg-[#fff7f2]"
            >
              {tool.title.split("—")[0].trim()}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
