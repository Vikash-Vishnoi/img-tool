import Link from "next/link";

export default function Home() {
  const tools = [
    {
      title: "Compress Images",
      description: "Reduce file size for JPG/PNG/WebP without uploading.",
      badge: "Browser-only",
      href: "/compress-image",
    },
    {
      title: "HEIC to JPG",
      description: "Convert iPhone HEIC photos to shareable formats.",
      badge: "iPhone",
      href: "/heic-to-jpg",
    },
    {
      title: "JPG ↔ PNG",
      description: "Convert between JPG and PNG with a single click.",
      badge: "Convert",
      href: "/jpg-to-png",
    },
    {
      title: "WebP Converter",
      description: "Convert images to WebP for modern web performance.",
      badge: "WebP",
      href: "/png-to-webp",
    },
    {
      title: "AVIF Converter",
      description: "Convert images to AVIF for maximum compression.",
      badge: "AVIF",
      href: "/jpg-to-avif",
    },
    {
      title: "Resize / Crop",
      description: "Resize images for social, web, and docs.",
      badge: "Edit",
      href: "/resize-image",
    },
  ] as const;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight sm:text-4xl">
            ImgTools
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-7 text-foreground/70">
            Fast, private image conversions and optimizations that run in your
            browser.
          </p>
        </header>

        <section className="mt-10">
          <h2 className="sr-only">Tools</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group block rounded-2xl border border-foreground/10 bg-background p-5 transition-colors hover:bg-foreground/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold">{tool.title}</h3>
                  <span className="shrink-0 rounded-full border border-foreground/10 px-2.5 py-1 text-xs text-foreground/70">
                    {tool.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  {tool.description}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background">
                    Coming soon
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
