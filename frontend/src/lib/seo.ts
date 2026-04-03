import type { Metadata } from "next";
import {
  pngToWebpFAQs,
  resizeAadharPhotoFAQs,
  resizePassportPhotoFAQs,
  resizeTo200kbFAQs,
} from "@/lib/faqData";

export type FaqItem = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  slug: string;
  path: `/${string}`;
  title: string;
  description: string;
  keywords: string[];
  faqs?: FaqItem[];
  howTo?: ToolHowToTemplate;
  faqHeading?: string;
  related?: Array<ToolDefinition["slug"]>;
};

export type ToolHowToStep = {
  id: string;
  name: string;
  text: string;
};

export type ToolHowTo = {
  name: string;
  description: string;
  steps: ToolHowToStep[];
};

export type ToolHowToTemplateStep = {
  name: string;
  text: string;
};

export type ToolHowToTemplate = {
  name: string;
  description: string;
  steps: ToolHowToTemplateStep[];
};

const AVIF_TO_JPG_FAQS: FaqItem[] = [
  {
    question: "Why should I convert AVIF to JPG before upload?",
    answer:
      "Many older apps, printers, and government portals accept JPG but fail on AVIF. Converting to JPG avoids format mismatch errors and gives broader compatibility.",
  },
  {
    question: "Will transparent areas in AVIF stay transparent in JPG?",
    answer:
      "No. JPG does not support transparency, so transparent regions are flattened to a solid background. Review logos and product shots after conversion.",
  },
  {
    question: "What JPG quality setting should I use for converted AVIF photos?",
    answer:
      "Start around 85 for photos and reduce gradually only if you need smaller size. This usually keeps facial detail and text edges clean.",
  },
  {
    question: "Can I convert multiple AVIF files to JPG in one run?",
    answer:
      "Yes. Batch conversion is supported. For large sets, process in smaller groups so previews remain responsive on mobile devices.",
  },
  {
    question: "Why is my JPG file sometimes larger than the original AVIF?",
    answer:
      "AVIF is usually more efficient than JPG. If you export JPG at high quality, file size can increase. Lower quality slightly or compress after conversion.",
  },
  {
    question: "Are AVIF to JPG conversions private on this page?",
    answer:
      "Yes. The workflow runs in your browser session, so source and output files stay on your device during processing.",
  },
];

const AVIF_TO_JPG_HOW_TO: ToolHowToTemplate = {
  name: "How to convert AVIF to JPG for app and portal compatibility",
  description:
    "Use this route when you need the widest support for uploads, sharing, and editing tools that do not handle AVIF reliably.",
  steps: [
    {
      name: "Upload AVIF source files",
      text: "Add one or more AVIF images from your device and confirm each file preview loads correctly.",
    },
    {
      name: "Set JPG output quality",
      text: "Start with a high quality setting for clarity, then lower in small steps only if you need a smaller final size.",
    },
    {
      name: "Check transparency-dependent images",
      text: "If the AVIF uses transparency, verify the flattened background in JPG still fits your intended use.",
    },
    {
      name: "Convert and validate readability",
      text: "Run conversion and inspect the output at full zoom to confirm face detail, text sharpness, and color consistency.",
    },
    {
      name: "Download and verify target compatibility",
      text: "Download JPG files and test them in the portal or app that previously rejected AVIF.",
    },
  ],
};

const AVIF_TO_PDF_FAQS: FaqItem[] = [
  {
    question: "Can I merge multiple AVIF images into one PDF?",
    answer:
      "Yes. Upload all AVIF files in order and generate one combined PDF with one image per page.",
  },
  {
    question: "Should I choose A4 or auto page size for AVIF to PDF?",
    answer:
      "Use A4 when uploading documents to form portals, and use auto or fit mode when preserving original image framing is more important.",
  },
  {
    question: "Will AVIF quality stay readable after PDF conversion?",
    answer:
      "Yes, if source images are clear and you avoid aggressive compression. Always review text and fine detail after PDF generation.",
  },
  {
    question: "How can I keep AVIF to PDF output under upload limits?",
    answer:
      "Use fewer pages per file or reduce image quality before PDF generation. You can also compress the source images first.",
  },
  {
    question: "Why does my PDF look blurry after converting AVIF screenshots?",
    answer:
      "Blurring usually comes from downscaling or low quality settings. Keep resolution high for text-heavy screenshots and regenerate the PDF.",
  },
  {
    question: "Is AVIF to PDF conversion private?",
    answer:
      "Yes. Processing happens in-browser, so image files are not uploaded to an external server.",
  },
];

const AVIF_TO_PDF_HOW_TO: ToolHowToTemplate = {
  name: "How to convert AVIF images into a submission-ready PDF",
  description:
    "Use this route when a portal requires PDF upload and your source files are in AVIF format.",
  steps: [
    {
      name: "Upload AVIF files in final page order",
      text: "Select all AVIF images for the document and arrange them in the same order you want in the PDF.",
    },
    {
      name: "Set page layout options",
      text: "Choose page size, orientation, and fit mode based on whether the output is for printing or online form submission.",
    },
    {
      name: "Generate PDF and inspect each page",
      text: "Create the PDF and confirm that text, seals, signatures, and photo regions remain readable.",
    },
    {
      name: "Check final file size against portal limits",
      text: "Before download, confirm the PDF stays below upload caps to avoid repeated rejection attempts.",
    },
    {
      name: "Download and run a quick upload test",
      text: "Upload the generated PDF once on the target portal to validate format acceptance before final submission.",
    },
  ],
};

const AVIF_TO_PNG_FAQS: FaqItem[] = [
  {
    question: "When should I convert AVIF to PNG instead of JPG?",
    answer:
      "Choose PNG when you need transparency support, crisp text overlays, or editing workflows that benefit from lossless output.",
  },
  {
    question: "Does AVIF to PNG keep transparent backgrounds?",
    answer:
      "Yes. PNG supports alpha transparency, so transparent regions are preserved when source AVIF images include them.",
  },
  {
    question: "Why are PNG outputs larger than AVIF files?",
    answer:
      "AVIF usually compresses better than PNG. Larger PNG files are expected, especially for detailed photos and gradients.",
  },
  {
    question: "Is AVIF to PNG good for screenshots and graphics?",
    answer:
      "Yes. PNG is often preferred for UI captures, icons, and assets where sharp edges and exact detail matter.",
  },
  {
    question: "Can I batch convert AVIF files to PNG?",
    answer:
      "Yes. You can process multiple AVIF files in one session and download all converted PNG outputs.",
  },
  {
    question: "Are AVIF to PNG files processed privately?",
    answer:
      "Yes. Conversion runs in-browser and files remain on your device during the workflow.",
  },
];

const AVIF_TO_PNG_HOW_TO: ToolHowToTemplate = {
  name: "How to convert AVIF to PNG with transparency preserved",
  description:
    "Use this route for design, editing, and documentation workflows where PNG output is safer than JPG.",
  steps: [
    {
      name: "Upload AVIF images",
      text: "Add one or more AVIF files and confirm each file previews correctly before conversion.",
    },
    {
      name: "Choose PNG output",
      text: "Set PNG as the target format when you need transparency and pixel-stable detail.",
    },
    {
      name: "Validate alpha and edge quality",
      text: "Check transparent areas, logos, and fine edges to ensure output is ready for overlays or design use.",
    },
    {
      name: "Convert and review output size",
      text: "Run conversion and confirm file size is acceptable for your destination workflow.",
    },
    {
      name: "Download and reuse in editing tools",
      text: "Download the PNG files and open them in your editor, CMS, or documentation system.",
    },
  ],
};

const AVIF_TO_WEBP_FAQS: FaqItem[] = [
  {
    question: "Why convert AVIF to WebP if AVIF is already efficient?",
    answer:
      "WebP has broader support across older web stacks and plugins. Conversion helps when tooling or CMS pipelines do not handle AVIF reliably.",
  },
  {
    question: "Will AVIF to WebP conversion reduce visual quality?",
    answer:
      "It can, depending on quality settings. Use a high quality baseline first, then optimize only as much as your target needs.",
  },
  {
    question: "Is WebP better for website compatibility than AVIF?",
    answer:
      "In many environments, yes. WebP is commonly supported by themes, builders, and image optimization plugins with fewer fallback issues.",
  },
  {
    question: "Can WebP output keep transparency from AVIF?",
    answer:
      "Yes. WebP supports alpha transparency, so transparent backgrounds can be retained when present in the source file.",
  },
  {
    question: "What quality range is practical for AVIF to WebP?",
    answer:
      "For web photos, start around 80 to 85 and adjust while checking real page previews. For graphics, keep quality higher to avoid edge artifacts.",
  },
  {
    question: "Is AVIF to WebP processing private on this page?",
    answer:
      "Yes. Conversion happens locally in your browser without external upload.",
  },
];

const AVIF_TO_WEBP_HOW_TO: ToolHowToTemplate = {
  name: "How to convert AVIF to WebP for reliable web delivery",
  description:
    "Use this route when AVIF causes compatibility issues in your CMS, site builder, or downstream publishing tools.",
  steps: [
    {
      name: "Upload AVIF source files",
      text: "Select the AVIF images you want to publish and confirm all previews are loaded.",
    },
    {
      name: "Set WebP quality for your page goal",
      text: "Choose a quality level that balances loading speed with visual clarity for banners, cards, or content images.",
    },
    {
      name: "Check transparency and edges",
      text: "Inspect logos, icons, and cutout images to confirm alpha handling and edge smoothness.",
    },
    {
      name: "Convert and validate in-browser preview",
      text: "Run conversion and inspect output before publishing, especially on text-heavy or gradient images.",
    },
    {
      name: "Download and test on your live stack",
      text: "Upload converted WebP files to your CMS or app and confirm rendering in your real production environment.",
    },
  ],
};

const COMPRESS_AVIF_FAQS: FaqItem[] = [
  {
    question: "How much can I compress AVIF before quality issues appear?",
    answer:
      "It depends on image content. Photos usually tolerate moderate compression well, while text and UI graphics show artifacts sooner.",
  },
  {
    question: "Why does AVIF sometimes shrink only a little after compression?",
    answer:
      "Many AVIF files are already highly optimized. Additional reduction may be limited unless you lower quality more aggressively.",
  },
  {
    question: "What AVIF quality range is practical for uploads?",
    answer:
      "Start around medium-high quality, then reduce in small steps until the file passes limits without visible damage at full zoom.",
  },
  {
    question: "Does AVIF compression change image dimensions?",
    answer:
      "Compression alone targets file size and quality. Dimensions remain unchanged unless you run a separate resize workflow.",
  },
  {
    question: "Should I convert AVIF to JPG if a portal rejects AVIF?",
    answer:
      "Yes. Some portals validate only JPG or PNG. In those cases, convert format first, then optimize size for the final upload target.",
  },
  {
    question: "Are compressed AVIF files processed privately?",
    answer:
      "Yes. Compression runs on-device in the browser and files are not uploaded during processing.",
  },
];

const COMPRESS_AVIF_HOW_TO: ToolHowToTemplate = {
  name: "How to compress AVIF without breaking detail",
  description:
    "Use controlled compression passes so images meet size limits while preserving readable text and clean edges.",
  steps: [
    {
      name: "Upload your AVIF image",
      text: "Add the AVIF file and note its original size before making any quality adjustments.",
    },
    {
      name: "Choose a realistic target",
      text: "Set your target based on destination limits such as form uploads, messaging, or web publishing budgets.",
    },
    {
      name: "Compress in small quality steps",
      text: "Lower quality gradually and avoid one extreme reduction so important details do not collapse.",
    },
    {
      name: "Inspect artifacts at full zoom",
      text: "Check skin textures, text edges, and flat gradients for blockiness or banding before final export.",
    },
    {
      name: "Download and verify acceptance",
      text: "Download the compressed AVIF and test the exact upload target. Convert to JPG if the destination rejects AVIF.",
    },
  ],
};

const COMPRESS_IMAGE_FAQS: FaqItem[] = [
  {
    question: "What is the best way to compress mixed image formats on one page?",
    answer:
      "Start with one file at a time to find a quality baseline, then repeat the same logic for the rest of the batch. Different formats respond differently to the same settings.",
  },
  {
    question: "Should I use target KB mode or quality-based compression first?",
    answer:
      "Use target KB mode when a portal has strict size limits, and use quality tuning when visual clarity is more important than an exact number.",
  },
  {
    question: "Can I compress JPG, PNG, WebP, AVIF, and HEIC files here?",
    answer:
      "Yes. This route is the general compression entry point for common image formats used in uploads, messaging, and publishing.",
  },
  {
    question: "Why do files with similar dimensions end up with different compressed sizes?",
    answer:
      "File size depends on format, texture complexity, noise, and color transitions. Two images with identical resolution can compress very differently.",
  },
  {
    question: "How do I reduce rejection risk after compression for government portals?",
    answer:
      "Keep the final size slightly below the stated limit, verify readability at full zoom, and confirm the required output format before upload.",
  },
  {
    question: "Are compressed files processed privately on this tool?",
    answer:
      "Yes. Compression runs in the browser, and files stay on your device during processing.",
  },
];

const COMPRESS_IMAGE_HOW_TO: ToolHowToTemplate = {
  name: "How to compress images across formats with predictable results",
  description:
    "Use this route for a format-agnostic workflow when you need smaller files for messaging, web upload, or form submission.",
  steps: [
    {
      name: "Upload your image file",
      text: "Add the source image and note original file size so you can measure real compression gain.",
    },
    {
      name: "Choose optimization method",
      text: "Pick target size mode for strict limits or quality mode when visual output quality is your main priority.",
    },
    {
      name: "Adjust settings in small increments",
      text: "Make gradual changes instead of one aggressive jump to avoid sudden clarity loss.",
    },
    {
      name: "Inspect details at full zoom",
      text: "Check text edges, skin texture, logos, and flat gradients before finalizing.",
    },
    {
      name: "Download and validate upload acceptance",
      text: "Export the final file and test it on the exact destination portal or app.",
    },
  ],
};

const COMPRESS_JPG_FAQS: FaqItem[] = [
  {
    question: "What JPG quality setting is usually safe for form uploads?",
    answer:
      "A mid-to-high quality range is often a good starting point. Lower it gradually only as needed to meet file-size caps.",
  },
  {
    question: "Why does recompressing JPG repeatedly degrade quality?",
    answer:
      "JPG is lossy. Each additional save can introduce new artifacts, so work from the original source whenever possible.",
  },
  {
    question: "How can I avoid blocky artifacts in compressed JPG photos?",
    answer:
      "Reduce compression intensity, avoid repeated re-exports, and verify faces and text at full zoom before download.",
  },
  {
    question: "Can compressed JPG files become larger in some cases?",
    answer:
      "Yes. If the source is already optimized or your export quality is higher, the new file can be equal or slightly larger.",
  },
  {
    question: "Should I resize dimensions before compressing JPG for strict limits?",
    answer:
      "If size targets are very low, resizing first can help more than aggressive quality loss alone.",
  },
  {
    question: "Is JPG compression on this route private?",
    answer:
      "Yes. Processing happens locally in your browser session.",
  },
];

const COMPRESS_JPG_HOW_TO: ToolHowToTemplate = {
  name: "How to compress JPG while keeping practical clarity",
  description:
    "Use this route when the final destination requires JPG and you need smaller files without over-compressing.",
  steps: [
    {
      name: "Upload original JPG file",
      text: "Use the earliest source version available to avoid stacking artifacts from older compressed copies.",
    },
    {
      name: "Set initial quality target",
      text: "Start from a quality level that preserves readability, then move lower only if required by file-size limits.",
    },
    {
      name: "Compress and compare before/after",
      text: "Run compression and compare visual output against the source at full zoom.",
    },
    {
      name: "Refine for size or detail",
      text: "Adjust quality in small steps until your balance of size and clarity is acceptable.",
    },
    {
      name: "Download and upload-check",
      text: "Download the compressed JPG and validate it on the target form, app, or website.",
    },
  ],
};

const COMPRESS_PNG_FAQS: FaqItem[] = [
  {
    question: "Can I compress PNG without losing transparency?",
    answer:
      "Yes. PNG alpha channels can remain intact, which is important for logos, stickers, and overlays.",
  },
  {
    question: "Why are compressed PNG files still large compared to JPG?",
    answer:
      "PNG preserves more exact pixel data. For photo-heavy content, PNG often remains larger than JPG or WebP.",
  },
  {
    question: "Is PNG compression suitable for screenshots and UI assets?",
    answer:
      "Yes. PNG is commonly used for text-heavy captures and interface graphics where edge sharpness matters.",
  },
  {
    question: "Should I convert PNG to JPG or WebP for stricter file limits?",
    answer:
      "If transparency is not required, converting format can reduce size more than PNG-only compression.",
  },
  {
    question: "How do I keep text readable in compressed PNG output?",
    answer:
      "Apply moderate compression and inspect text, icons, and thin lines at full zoom before final export.",
  },
  {
    question: "Is PNG compression private on this page?",
    answer:
      "Yes. Compression is performed in-browser and files are not uploaded externally.",
  },
];

const COMPRESS_PNG_HOW_TO: ToolHowToTemplate = {
  name: "How to compress PNG while preserving edges and alpha",
  description:
    "Use this route for transparency-safe optimization when PNG is mandatory for your workflow.",
  steps: [
    {
      name: "Upload PNG source",
      text: "Add the PNG file and confirm whether transparency is required for final usage.",
    },
    {
      name: "Apply moderate compression first",
      text: "Start with a conservative setting to preserve text edges and smooth gradients.",
    },
    {
      name: "Check alpha and artifact risk",
      text: "Inspect transparent regions and icon outlines for halos or quality regressions.",
    },
    {
      name: "Adjust toward target size",
      text: "Increase compression gradually until file size is acceptable without damaging readability.",
    },
    {
      name: "Download and verify destination",
      text: "Export the compressed PNG and validate rendering in your app, site, or upload portal.",
    },
  ],
};

const COMPRESS_WEBP_FAQS: FaqItem[] = [
  {
    question: "When does compressing WebP again make sense?",
    answer:
      "It helps when current files still exceed budgets for page speed or platform limits. Start with small quality reductions.",
  },
  {
    question: "Why do some WebP files barely shrink after compression?",
    answer:
      "Many WebP assets are already optimized. Additional savings may be small unless you accept stronger quality trade-offs.",
  },
  {
    question: "Can WebP compression keep transparency?",
    answer:
      "Yes. WebP can retain alpha, so transparent assets can stay transparent after compression.",
  },
  {
    question: "What quality range is practical for WebP web images?",
    answer:
      "Begin around medium-high quality for photos and slightly higher for UI assets, then tune based on real page previews.",
  },
  {
    question: "Should I use WebP or JPG for older compatibility stacks?",
    answer:
      "WebP is broadly supported today, but some legacy pipelines still prefer JPG. Keep a fallback plan when older systems are involved.",
  },
  {
    question: "Is WebP compression on this route private?",
    answer:
      "Yes. All processing is local to your browser session.",
  },
];

const COMPRESS_WEBP_HOW_TO: ToolHowToTemplate = {
  name: "How to compress WebP for faster delivery",
  description:
    "Use this route to tighten file-size budgets for web pages, product galleries, and app media payloads.",
  steps: [
    {
      name: "Upload WebP file",
      text: "Add your source WebP image and note its current size against your delivery budget.",
    },
    {
      name: "Choose initial quality setting",
      text: "Start with a gentle quality reduction to avoid visible degradation.",
    },
    {
      name: "Compress and inspect visual impact",
      text: "Check fine textures, gradients, and text overlays to confirm output quality stays usable.",
    },
    {
      name: "Tune for final size target",
      text: "Iterate in small steps until the file meets your loading or upload threshold.",
    },
    {
      name: "Download and run real page test",
      text: "Export and test in your actual site or app view rather than relying only on editor preview.",
    },
  ],
};

const COMPRESS_HEIC_FAQS: FaqItem[] = [
  {
    question: "Can I compress HEIC photos from iPhone directly?",
    answer:
      "Yes. This route is designed for HEIC images and helps reduce file size before sharing or form uploads.",
  },
  {
    question: "Does this compressor support HEIF files too?",
    answer:
      "Yes. HEIC and HEIF variants are supported in the same workflow.",
  },
  {
    question: "Why do some portals reject compressed HEIC images?",
    answer:
      "Many portals validate only JPG or PNG. In that case, convert format after compression or convert first and optimize the accepted format.",
  },
  {
    question: "What quality strategy works best for HEIC compression?",
    answer:
      "Start conservative, then reduce in small increments until size limits are met without losing face detail.",
  },
  {
    question: "Will HEIC metadata always remain after compression?",
    answer:
      "Metadata handling can vary by browser and processing path. Verify required fields separately if your workflow depends on metadata.",
  },
  {
    question: "Is HEIC compression private on this route?",
    answer:
      "Yes. Files are processed locally in-browser and are not uploaded to an external server.",
  },
];

const COMPRESS_HEIC_HOW_TO: ToolHowToTemplate = {
  name: "How to compress iPhone HEIC images for uploads",
  description:
    "Use this route when original HEIC photos are too large for messaging, forms, or document portals.",
  steps: [
    {
      name: "Upload HEIC or HEIF file",
      text: "Select the iPhone image from your device and confirm the file is detected correctly.",
    },
    {
      name: "Set your size goal",
      text: "Pick a practical target based on portal limits or sharing constraints.",
    },
    {
      name: "Apply controlled compression",
      text: "Reduce quality in small steps so important facial and text detail remains intact.",
    },
    {
      name: "Preview and verify readability",
      text: "Inspect the output at full zoom before download, especially for ID-style or text-heavy photos.",
    },
    {
      name: "Download and confirm accepted format",
      text: "Export the compressed file and convert to JPG if the destination does not accept HEIC/HEIF.",
    },
  ],
};

const HEIC_TO_JPG_FAQS: FaqItem[] = [
  {
    question: "Why convert iPhone HEIC photos to JPG before upload?",
    answer:
      "Many exam and government portals still expect JPG/JPEG. Converting HEIC to JPG avoids unsupported format errors during submission.",
  },
  {
    question: "Will HEIC to JPG conversion affect photo quality?",
    answer:
      "JPG is lossy, so some compression is normal. With practical quality settings, visual differences are usually minimal for form and sharing use cases.",
  },
  {
    question: "Can I convert multiple HEIC files to JPG in one batch?",
    answer:
      "Yes. You can process multiple iPhone photos in one run and download converted JPG files together.",
  },
  {
    question: "Why does orientation look different after HEIC conversion?",
    answer:
      "Some viewers interpret orientation metadata differently. Always preview converted JPG output and rotate if needed before upload.",
  },
  {
    question: "Do HEIF files also work on this HEIC to JPG route?",
    answer:
      "Yes. HEIC and HEIF variants are supported in the same conversion flow.",
  },
  {
    question: "Is HEIC to JPG conversion private on this page?",
    answer:
      "Yes. Conversion runs locally in-browser and files are not uploaded to an external server.",
  },
];

const HEIC_TO_JPG_HOW_TO: ToolHowToTemplate = {
  name: "How to convert iPhone HEIC photos to JPG for portal compatibility",
  description:
    "Use this route when your destination rejects HEIC or only accepts JPG/JPEG uploads.",
  steps: [
    {
      name: "Upload HEIC or HEIF images",
      text: "Add one or more iPhone photo files and confirm previews load correctly.",
    },
    {
      name: "Set JPG output preferences",
      text: "Choose practical quality settings based on whether you prioritize clarity or smaller file size.",
    },
    {
      name: "Convert and inspect orientation",
      text: "Run conversion and verify that orientation and framing remain correct in the output.",
    },
    {
      name: "Check detail at full zoom",
      text: "Inspect face regions, text, and fine edges to ensure quality is acceptable for your workflow.",
    },
    {
      name: "Download and upload-test",
      text: "Download JPG files and validate acceptance on the exact portal or app.",
    },
  ],
};

const HEIC_TO_PNG_FAQS: FaqItem[] = [
  {
    question: "When should I convert HEIC to PNG instead of JPG?",
    answer:
      "Use PNG when you need sharper edges for graphics or screenshots, or when repeated edits are expected.",
  },
  {
    question: "Will HEIC to PNG files be larger than JPG output?",
    answer:
      "Usually yes. PNG often produces larger files, especially for photo-heavy images, because it preserves more exact detail.",
  },
  {
    question: "Is HEIC to PNG suitable for text-heavy captures?",
    answer:
      "Yes. PNG is commonly preferred for interface captures and text overlays where crisp edges matter.",
  },
  {
    question: "Can I batch convert iPhone HEIC files to PNG?",
    answer:
      "Yes. You can convert multiple files in one session and export all PNG outputs.",
  },
  {
    question: "Do HEIF files work for HEIC to PNG conversion?",
    answer:
      "Yes. HEIF variants are accepted in the same workflow.",
  },
  {
    question: "Is HEIC to PNG conversion private?",
    answer:
      "Yes. Processing happens in-browser and files stay on your device.",
  },
];

const HEIC_TO_PNG_HOW_TO: ToolHowToTemplate = {
  name: "How to convert HEIC to PNG for editing-friendly output",
  description:
    "Use this route when you need PNG output for design, documentation, or text clarity workflows.",
  steps: [
    {
      name: "Upload HEIC source files",
      text: "Select iPhone HEIC or HEIF files and confirm all previews render correctly.",
    },
    {
      name: "Choose PNG output",
      text: "Set PNG as target format when you need high-detail, editing-stable images.",
    },
    {
      name: "Convert and review size impact",
      text: "Run conversion and check output size, since PNG can be larger than other formats.",
    },
    {
      name: "Verify sharpness at full zoom",
      text: "Inspect text edges, icons, and gradients to confirm visual quality.",
    },
    {
      name: "Download for editing or upload",
      text: "Export PNG files and use them in your destination app, CMS, or submission flow.",
    },
  ],
};

const HEIC_TO_WEBP_FAQS: FaqItem[] = [
  {
    question: "Why convert HEIC photos to WebP for websites?",
    answer:
      "WebP usually gives smaller files than JPG or PNG while maintaining good quality, which helps with faster page loads.",
  },
  {
    question: "Is WebP more compatible than HEIC for publishing stacks?",
    answer:
      "Yes. Most CMS and browser pipelines support WebP more reliably than HEIC.",
  },
  {
    question: "Will HEIC to WebP conversion reduce quality?",
    answer:
      "Quality depends on export settings. Start with a high baseline and reduce gradually until file size goals are met.",
  },
  {
    question: "Can I convert HEIC to WebP in batch mode?",
    answer:
      "Yes. Multiple files can be converted in one session for web-ready output.",
  },
  {
    question: "What quality range is practical for HEIC to WebP output?",
    answer:
      "A medium-high range is often a good starting point. Fine-tune after checking real browser previews.",
  },
  {
    question: "Are HEIC to WebP conversions private on this route?",
    answer:
      "Yes. Conversion is local to your browser and files are not uploaded externally.",
  },
];

const HEIC_TO_WEBP_HOW_TO: ToolHowToTemplate = {
  name: "How to convert HEIC to WebP for lightweight publishing",
  description:
    "Use this route when you want smaller web images from iPhone photos without relying on HEIC support downstream.",
  steps: [
    {
      name: "Upload HEIC or HEIF photos",
      text: "Add source files from your iPhone export and confirm preview readiness.",
    },
    {
      name: "Set WebP quality target",
      text: "Pick an initial quality setting that balances page speed and visual quality.",
    },
    {
      name: "Convert and compare output",
      text: "Generate WebP output and compare with source for detail retention.",
    },
    {
      name: "Validate in browser context",
      text: "Check converted images in your actual web layout or preview environment.",
    },
    {
      name: "Download and publish",
      text: "Export WebP files and deploy to your CMS, storefront, or content workflow.",
    },
  ],
};

const HEIC_TO_AVIF_FAQS: FaqItem[] = [
  {
    question: "Why convert HEIC to AVIF if both are modern formats?",
    answer:
      "AVIF can offer stronger compression for web delivery and CDN pipelines where AVIF support is available.",
  },
  {
    question: "Will HEIC to AVIF always reduce file size?",
    answer:
      "Not always. Size depends on source complexity and chosen quality settings. Some already-optimized HEIC files may shrink only slightly.",
  },
  {
    question: "Is HEIC to AVIF useful for website performance work?",
    answer:
      "Yes, especially when your delivery stack supports AVIF and you want smaller payloads for image-heavy pages.",
  },
  {
    question: "Can I batch convert HEIC images to AVIF?",
    answer:
      "Yes. You can process multiple iPhone photos and export AVIF outputs together.",
  },
  {
    question: "Should I keep JPG fallback after converting to AVIF?",
    answer:
      "For maximum compatibility across old systems, keep fallback formats for channels that still reject AVIF.",
  },
  {
    question: "Is HEIC to AVIF conversion private?",
    answer:
      "Yes. Files are processed on-device in your browser session.",
  },
];

const HEIC_TO_AVIF_HOW_TO: ToolHowToTemplate = {
  name: "How to convert HEIC to AVIF for modern delivery pipelines",
  description:
    "Use this route when your destination supports AVIF and you want tighter image-size budgets.",
  steps: [
    {
      name: "Upload HEIC files from iPhone",
      text: "Add source HEIC or HEIF images and confirm preview rendering before conversion.",
    },
    {
      name: "Choose AVIF quality settings",
      text: "Start with a quality baseline that protects visible detail, then tune downward if needed.",
    },
    {
      name: "Convert and assess visual quality",
      text: "Generate AVIF output and inspect gradients, textures, and edges at full zoom.",
    },
    {
      name: "Review size gains against target",
      text: "Compare original and converted size to confirm practical savings for your workflow.",
    },
    {
      name: "Download and test compatibility",
      text: "Export AVIF files and validate in your target app, browser, or CDN setup.",
    },
  ],
};

const HEIC_TO_PDF_FAQS: FaqItem[] = [
  {
    question: "Can I merge multiple HEIC photos into one PDF?",
    answer:
      "Yes. Upload multiple HEIC/HEIF files, keep the desired order, and generate one consolidated PDF.",
  },
  {
    question: "Is HEIC to PDF useful for government and exam form uploads?",
    answer:
      "Yes. Many portals request PDF documents, and this route helps package iPhone photos into a compatible file format.",
  },
  {
    question: "How do I keep HEIC to PDF output readable?",
    answer:
      "Use clear source photos, avoid aggressive compression, and verify text and face regions after PDF generation.",
  },
  {
    question: "What if the generated PDF is too large?",
    answer:
      "Compress source images first or split pages across smaller PDFs to satisfy strict upload limits.",
  },
  {
    question: "Can I use HEIF files on this HEIC to PDF page?",
    answer:
      "Yes. HEIC and HEIF variants are supported for PDF creation.",
  },
  {
    question: "Is HEIC to PDF processing private on this route?",
    answer:
      "Yes. Conversion and PDF generation run in your browser session without external upload.",
  },
];

const HEIC_TO_PDF_HOW_TO: ToolHowToTemplate = {
  name: "How to convert HEIC photos into a PDF for submissions",
  description:
    "Use this route when you need a portal-friendly PDF from iPhone image files.",
  steps: [
    {
      name: "Upload HEIC or HEIF photos",
      text: "Add all required photos and arrange them in final page order.",
    },
    {
      name: "Configure page layout",
      text: "Choose orientation and page sizing based on whether the PDF is for upload or print.",
    },
    {
      name: "Generate PDF output",
      text: "Create the document and inspect each page for readability and cropping.",
    },
    {
      name: "Check file-size constraints",
      text: "Confirm final PDF size is below your portal's maximum upload limit.",
    },
    {
      name: "Download and validate upload",
      text: "Export the PDF and run one real upload test on the target portal.",
    },
  ],
};

const IMAGE_CONVERTER_FAQS: FaqItem[] = [
  {
    question: "Which image formats can I convert on this universal route?",
    answer:
      "You can convert among common formats such as JPG, PNG, WebP, AVIF, and HEIC/HEIF depending on browser support and source integrity.",
  },
  {
    question: "Can I upload mixed formats together in one batch?",
    answer:
      "Yes. You can add mixed inputs and export them to one selected output format in the same run.",
  },
  {
    question: "Why does some converted output look larger than expected?",
    answer:
      "File size depends on chosen output format and quality settings. Converting from modern compressed formats to PNG or high-quality JPG can increase size.",
  },
  {
    question: "Will transparency be preserved in every output format?",
    answer:
      "Transparency is preserved in PNG/WebP/AVIF when supported, but JPG does not support alpha and will flatten transparent areas.",
  },
  {
    question: "Is this route useful for quick compatibility fixes?",
    answer:
      "Yes. It is designed for fast format switching when a website, app, or portal rejects your current image extension.",
  },
  {
    question: "Are conversions on this page private?",
    answer:
      "Yes. Processing runs in your browser session and files remain on your device.",
  },
];

const IMAGE_CONVERTER_HOW_TO: ToolHowToTemplate = {
  name: "How to use the universal image converter for mixed sources",
  description:
    "Use this route when you want one workflow to normalize different image formats quickly.",
  steps: [
    {
      name: "Upload one or more image files",
      text: "Add JPG, PNG, WebP, AVIF, or HEIC/HEIF files and verify each source loads in preview.",
    },
    {
      name: "Choose a single target output format",
      text: "Select the format your destination accepts, such as JPG for compatibility or WebP/AVIF for smaller web payloads.",
    },
    {
      name: "Adjust output quality if available",
      text: "Use quality controls to balance visual fidelity and file size before running conversion.",
    },
    {
      name: "Convert and inspect representative files",
      text: "Check a few outputs at full zoom to confirm detail, transparency handling, and color are acceptable.",
    },
    {
      name: "Download and test in final destination",
      text: "Export all outputs and run a real upload test in the portal, CMS, or app you are targeting.",
    },
  ],
};

const JPG_TO_PNG_FAQS: FaqItem[] = [
  {
    question: "When should I convert JPG to PNG?",
    answer:
      "Convert JPG to PNG when you need cleaner edges for graphics, repeated edits, or text-heavy visuals where compression artifacts are distracting.",
  },
  {
    question: "Can JPG to PNG restore true transparency?",
    answer:
      "No. If the original JPG has no alpha channel, conversion cannot recreate transparent backgrounds automatically.",
  },
  {
    question: "Why is PNG output usually larger than JPG?",
    answer:
      "PNG often stores data with less loss, so files can become larger, especially for photo scenes with many color variations.",
  },
  {
    question: "Is JPG to PNG useful for screenshots with text?",
    answer:
      "Yes. PNG can preserve sharper text edges and UI lines better than heavily compressed JPG in many cases.",
  },
  {
    question: "Can I convert multiple JPGs to PNG together?",
    answer:
      "Yes. Batch conversion is supported so you can export many PNG files in one run.",
  },
  {
    question: "Is JPG to PNG conversion private on this page?",
    answer:
      "Yes. Conversion runs locally in your browser without external file upload.",
  },
];

const JPG_TO_PNG_HOW_TO: ToolHowToTemplate = {
  name: "How to convert JPG to PNG for clearer editable output",
  description:
    "Use this route when you need PNG files for design edits, documentation, or cleaner text rendering.",
  steps: [
    {
      name: "Upload JPG source files",
      text: "Add one or more JPG images and confirm previews render correctly before conversion.",
    },
    {
      name: "Select PNG as target format",
      text: "Choose PNG output when clarity and editing stability are more important than smallest size.",
    },
    {
      name: "Convert and check output size",
      text: "Generate PNG files and review size impact, since PNG can be significantly larger than JPG.",
    },
    {
      name: "Inspect text and edges at zoom",
      text: "Validate line sharpness, icon edges, and color transitions to ensure output quality meets your need.",
    },
    {
      name: "Download for editing or sharing",
      text: "Export converted PNG files and use them in your editor, CMS, or submission flow.",
    },
  ],
};

const JPG_TO_AVIF_FAQS: FaqItem[] = [
  {
    question: "Why convert JPG to AVIF?",
    answer:
      "AVIF can deliver much smaller files than JPG at similar visual quality, which helps website speed and bandwidth efficiency.",
  },
  {
    question: "Will JPG to AVIF always reduce file size?",
    answer:
      "Usually yes, but exact savings depend on source complexity and selected quality. Very small or already optimized JPGs may shrink less.",
  },
  {
    question: "Is AVIF compatible everywhere after conversion?",
    answer:
      "AVIF support is strong in modern environments, but some legacy tools still prefer JPG or PNG. Keep fallback formats when needed.",
  },
  {
    question: "How should I choose AVIF quality settings?",
    answer:
      "Start with a medium-high quality baseline, then reduce gradually while checking skin tones, text, and gradients at full zoom.",
  },
  {
    question: "Can I batch convert JPG files to AVIF?",
    answer:
      "Yes. Multiple JPG files can be converted in one session for consistent modern output.",
  },
  {
    question: "Is JPG to AVIF conversion private?",
    answer:
      "Yes. Files are processed locally in-browser and remain on your device.",
  },
];

const JPG_TO_AVIF_HOW_TO: ToolHowToTemplate = {
  name: "How to convert JPG to AVIF for modern compression",
  description:
    "Use this route when you need smaller image payloads without major quality loss.",
  steps: [
    {
      name: "Upload JPG images",
      text: "Add one or more JPG files and confirm all sources are visible in preview.",
    },
    {
      name: "Choose AVIF output",
      text: "Select AVIF to target stronger compression for web delivery or storage savings.",
    },
    {
      name: "Set initial quality baseline",
      text: "Start with conservative quality to protect detail, then tune down only if you need smaller files.",
    },
    {
      name: "Convert and compare before and after",
      text: "Review output size and inspect critical visual areas like faces, edges, and gradients.",
    },
    {
      name: "Download and validate compatibility",
      text: "Export AVIF files and test in your target browser, app, or CMS pipeline.",
    },
  ],
};

const IMAGE_TO_PDF_FAQS: FaqItem[] = [
  {
    question: "Can I combine multiple images into one PDF document?",
    answer:
      "Yes. Upload all images, arrange them in order, and generate a single multi-page PDF.",
  },
  {
    question: "Which image formats are accepted for image to PDF conversion?",
    answer:
      "Common image types like JPG, PNG, and WebP are supported in this workflow, with browser-specific handling for other formats.",
  },
  {
    question: "How do I keep output readable for form submissions?",
    answer:
      "Use clear source images, avoid over-compression, and choose a page layout that preserves text and signature clarity.",
  },
  {
    question: "What if my generated PDF is too large to upload?",
    answer:
      "Compress source images first or lower image quality before PDF generation to reduce final file size.",
  },
  {
    question: "Can I control image order before creating the PDF?",
    answer:
      "Yes. Reorder images in the queue so pages appear in the exact sequence you need.",
  },
  {
    question: "Is image to PDF conversion private on this route?",
    answer:
      "Yes. PDF creation runs in-browser, so source images remain on your device.",
  },
];

const IMAGE_TO_PDF_HOW_TO: ToolHowToTemplate = {
  name: "How to convert images into a single PDF file",
  description:
    "Use this route to bundle photos, scans, or screenshots into one shareable PDF.",
  steps: [
    {
      name: "Upload all required images",
      text: "Add JPG, PNG, or WebP files and make sure each page candidate appears correctly in preview.",
    },
    {
      name: "Arrange page order",
      text: "Drag items into final sequence before export so the PDF reads in the intended order.",
    },
    {
      name: "Set layout and size preferences",
      text: "Choose page settings based on your use case, such as submission-friendly dimensions or print orientation.",
    },
    {
      name: "Generate PDF and review pages",
      text: "Create the document and inspect readability, cropping, and rotation on each page.",
    },
    {
      name: "Download and upload-test",
      text: "Export the PDF and run one real upload test on your target portal or sharing channel.",
    },
  ],
};

const JPG_TO_PDF_FAQS: FaqItem[] = [
  {
    question: "Can I convert multiple JPG files into one PDF?",
    answer:
      "Yes. Upload all JPG files, reorder them as needed, and generate one combined multi-page PDF.",
  },
  {
    question: "Is JPG to PDF suitable for document submissions?",
    answer:
      "Yes. It is commonly used for portal uploads where images must be submitted as a single PDF file.",
  },
  {
    question: "How can I keep text and signatures clear in the PDF?",
    answer:
      "Start with sharp source images, avoid heavy compression, and review each page at zoom before final download.",
  },
  {
    question: "What if the JPG to PDF output exceeds upload size limits?",
    answer:
      "Compress JPG inputs first or lower quality before conversion, then regenerate a smaller PDF.",
  },
  {
    question: "Can I change orientation or page layout in JPG to PDF?",
    answer:
      "Yes. Use layout controls to match portrait or landscape content and avoid awkward cropping.",
  },
  {
    question: "Is JPG to PDF conversion private on this page?",
    answer:
      "Yes. Processing happens locally in your browser and files are not uploaded to external servers.",
  },
];

const JPG_TO_PDF_HOW_TO: ToolHowToTemplate = {
  name: "How to convert JPG images to a clean submission-ready PDF",
  description:
    "Use this route when you need one PDF from multiple JPG photos for sharing or portal uploads.",
  steps: [
    {
      name: "Upload JPG files",
      text: "Add all JPG images you want in the document and confirm each one appears correctly.",
    },
    {
      name: "Reorder pages",
      text: "Arrange images in the exact reading sequence before creating the PDF.",
    },
    {
      name: "Set page layout options",
      text: "Choose orientation and fitting options so content is readable and not clipped.",
    },
    {
      name: "Generate PDF and inspect quality",
      text: "Create output and review each page for sharp text, correct rotation, and acceptable file size.",
    },
    {
      name: "Download and verify destination acceptance",
      text: "Export the final PDF and test upload in the exact portal or workflow you need.",
    },
  ],
};

export const TOOLS = [
  {
    slug: "image-converter",
    path: "/image-converter",
    title: "Universal Image Converter — Convert Any Image Extension Online",
    description:
      "Upload JPG, JPEG, PNG, WebP, AVIF, or HEIC/HEIF and convert to your chosen output extension in your browser with no upload.",
    keywords: [
      "image converter",
      "convert image extension",
      "jpg png webp avif heic converter",
      "universal image converter",
      "no upload",
    ],
    faqs: IMAGE_CONVERTER_FAQS,
    howTo: IMAGE_CONVERTER_HOW_TO,
    related: ["heic-to-jpg", "compress-image", "resize-image"],
  },
  {
    slug: "heic-to-jpg",
    path: "/heic-to-jpg",
    title: "HEIC to JPG Converter — Free, Instant, No Upload",
    description:
      "Convert iPhone HEIC photos to JPG free in your browser. No upload needed. Works on mobile (Android/iPhone) and on Windows/Mac.",
    keywords: ["heic to jpg", "convert heic", "iphone photo converter"],
    faqs: HEIC_TO_JPG_FAQS,
    howTo: HEIC_TO_JPG_HOW_TO,
    related: ["compress-image", "resize-image", "resize-image-to-200kb"],
  },
  {
    slug: "heic-to-png",
    path: "/heic-to-png",
    title: "HEIC to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIC and HEIF photos to PNG in your browser with no upload. Keeps transparency. Works on Android and iPhone instantly.",
    keywords: [
      "heic to png",
      "heif to png",
      "iphone photo to png",
      "convert heic",
      "no upload",
    ],
    faqs: HEIC_TO_PNG_FAQS,
    howTo: HEIC_TO_PNG_HOW_TO,
    related: ["heic-to-jpg", "png-to-jpg", "compress-image"],
  },
  {
    slug: "heic-to-webp",
    path: "/heic-to-webp",
    title: "HEIC to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert HEIC photos to WebP free in your browser for smaller, web-ready files. No upload needed, so images stay private. Works on Android and iPhone.",
    keywords: [
      "heic to webp",
      "heif to webp",
      "iphone photo to webp",
      "convert heic",
      "no upload",
    ],
    faqs: HEIC_TO_WEBP_FAQS,
    howTo: HEIC_TO_WEBP_HOW_TO,
    related: ["heic-to-jpg", "heic-to-png", "webp-to-jpg"],
  },
  {
    slug: "heic-to-avif",
    path: "/heic-to-avif",
    title: "HEIC to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert iPhone HEIC and HEIF photos to AVIF in your browser with no upload. Smaller files at high quality. Works on Android and iPhone.",
    keywords: [
      "heic to avif",
      "heif to avif",
      "iphone photo to avif",
      "convert heic",
      "no upload",
    ],
    faqs: HEIC_TO_AVIF_FAQS,
    howTo: HEIC_TO_AVIF_HOW_TO,
    related: ["heic-to-jpg", "heic-to-png", "webp-to-avif"],
  },
  {
    slug: "compress-image",
    path: "/compress-image",
    title: "Compress Image for WhatsApp — Reduce Size Free",
    description:
      "Compress JPG/PNG/WebP free in your browser—no upload needed. Works on mobile and helps meet government form upload limits.",
    keywords: [
      "compress image",
      "compress for whatsapp",
      "reduce image size",
      "no upload",
    ],
    faqs: COMPRESS_IMAGE_FAQS,
    howTo: COMPRESS_IMAGE_HOW_TO,
    related: ["resize-image-to-200kb", "resize-image", "heic-to-jpg"],
  },
  {
    slug: "compress-jpg",
    path: "/compress-jpg",
    title: "Compress JPG Without Losing Quality — Free Online",
    description:
      "Compress JPG photos free in your browser to reduce file size for uploads and sharing. No upload needed, so images stay private. Works on Android and iPhone.",
    keywords: ["compress jpg", "jpg compressor", "reduce jpg size", "no upload"],
    faqs: COMPRESS_JPG_FAQS,
    howTo: COMPRESS_JPG_HOW_TO,
    related: ["compress-image", "resize-jpg", "resize-image-to-200kb"],
  },
  {
    slug: "compress-png",
    path: "/compress-png",
    title: "Compress PNG File Size Online — Free, No Upload",
    description:
      "Compress PNG images in your browser with no upload. Keep quality while reducing file size for WhatsApp, email, and government portals. Works on mobile.",
    keywords: ["compress png", "png compressor", "reduce png size", "no upload"],
    faqs: COMPRESS_PNG_FAQS,
    howTo: COMPRESS_PNG_HOW_TO,
    related: ["compress-image", "resize-png", "png-to-jpg"],
  },
  {
    slug: "compress-webp",
    path: "/compress-webp",
    title: "Compress WebP Image — Free, No Upload, Works on Mobile",
    description:
      "Compress WebP images in your browser with no upload for smaller files and faster sharing. Works on Android and iPhone. Files stay on your device.",
    keywords: ["compress webp", "webp compressor", "reduce webp size", "no upload"],
    faqs: COMPRESS_WEBP_FAQS,
    howTo: COMPRESS_WEBP_HOW_TO,
    related: ["compress-image", "resize-webp", "webp-to-jpg"],
  },
  {
    slug: "compress-avif",
    path: "/compress-avif",
    title: "Compress AVIF Image — Free, No Upload, Works on Mobile",
    description:
      "Compress AVIF images in your browser with no upload. Files stay on your device—100% private. Works on Android and iPhone. Reduces size instantly.",
    keywords: ["compress avif", "avif compressor", "reduce avif size", "no upload"],
    faqs: COMPRESS_AVIF_FAQS,
    howTo: COMPRESS_AVIF_HOW_TO,
    related: ["compress-image", "resize-avif", "avif-to-jpg"],
  },
  {
    slug: "compress-heic",
    path: "/compress-heic",
    title: "Compress iPhone HEIC Photos — Reduce Size Free",
    description:
      "Compress iPhone HEIC photos in your browser with no upload—completely private. Reduce file size for WhatsApp, email, and government form uploads.",
    keywords: ["compress heic", "heic compressor", "reduce heic size", "no upload"],
    faqs: COMPRESS_HEIC_FAQS,
    howTo: COMPRESS_HEIC_HOW_TO,
    related: ["compress-image", "resize-heic", "heic-to-jpg"],
  },
  {
    slug: "png-to-webp",
    path: "/png-to-webp",
    title: "PNG to WebP Converter — Reduce Size 30%, Free",
    description:
      "Convert PNG to WebP free in your browser for faster page loads and smaller files. No upload needed, so images stay private. Works on Android and iPhone.",
    keywords: ["png to webp", "convert png", "webp converter", "no upload"],
    faqs: pngToWebpFAQs,
    related: ["webp-to-png", "webp-to-jpg", "compress-image"],
  },
  {
    slug: "jpg-to-png",
    path: "/jpg-to-png",
    title: "JPG to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to PNG free in your browser—no upload needed. Works on Android, iPhone, Windows, and Mac. Supports transparent backgrounds automatically.",
    keywords: ["jpg to png", "convert jpg", "png converter", "no upload"],
    faqs: JPG_TO_PNG_FAQS,
    howTo: JPG_TO_PNG_HOW_TO,
    related: ["png-to-jpg", "jpg-to-webp", "compress-image"],
  },
  {
    slug: "png-to-jpg",
    path: "/png-to-jpg",
    title: "PNG to JPG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to JPG free in your browser. No upload needed, works on mobile. White background applied to transparent PNGs automatically for clean output.",
    keywords: [
      "png to jpg",
      "png to jpeg",
      "convert png to jpg",
      "no upload",
    ],
    related: ["jpg-to-png", "compress-image", "resize-image"],
  },
  {
    slug: "jpg-to-webp",
    path: "/jpg-to-webp",
    title: "JPG to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG to WebP free in your browser. No upload needed. WebP files are 30% smaller than JPG. Works on mobile. Great for faster websites and apps.",
    keywords: ["jpg to webp", "convert jpg", "webp converter", "no upload"],
    related: ["png-to-webp", "compress-image", "resize-image"],
  },
  {
    slug: "webp-to-jpg",
    path: "/webp-to-jpg",
    title: "WebP to JPG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP to JPG free in your browser—no upload needed. Useful when a website or app doesn't accept WebP. Works on Android and iPhone. Instant download.",
    keywords: [
      "webp to jpg",
      "webp to jpeg",
      "convert webp",
      "no upload",
    ],
    related: ["jpg-to-webp", "webp-to-png", "compress-image"],
  },
  {
    slug: "webp-to-png",
    path: "/webp-to-png",
    title: "WebP to PNG Converter — Transparent Background, Free",
    description:
      "Convert WebP to PNG free in your browser. No upload needed, works on mobile. Keeps transparent backgrounds. Supports Android, iPhone, Windows, and Mac.",
    keywords: ["webp to png", "convert webp", "png converter", "no upload"],
    related: ["png-to-webp", "jpg-to-png", "compress-image"],
  },
  {
    slug: "jpg-to-avif",
    path: "/jpg-to-avif",
    title: "JPG to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert JPG to AVIF free in your browser. No upload needed. AVIF files are 30–50% smaller than JPG. Works on Android and iPhone without any app install.",
    keywords: ["jpg to avif", "convert jpg", "avif converter", "no upload"],
    faqs: JPG_TO_AVIF_FAQS,
    howTo: JPG_TO_AVIF_HOW_TO,
    related: ["png-to-avif", "webp-to-avif", "compress-image"],
  },
  {
    slug: "png-to-avif",
    path: "/png-to-avif",
    title: "PNG to AVIF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG to AVIF free in your browser. No upload needed, works on mobile. AVIF gives smaller files at the same visual quality as PNG. Instant download.",
    keywords: ["png to avif", "convert png", "avif converter", "no upload"],
    related: ["jpg-to-avif", "webp-to-avif", "compress-image"],
  },
  {
    slug: "webp-to-avif",
    path: "/webp-to-avif",
    title: "WebP to AVIF Converter — Free, No Upload, Smaller Files",
    description:
      "Convert WebP to AVIF free in your browser—no upload needed. AVIF gives maximum compression at the same quality. Works on Android and iPhone instantly.",
    keywords: ["webp to avif", "convert webp", "avif converter", "no upload"],
    related: ["jpg-to-avif", "png-to-avif", "compress-image"],
  },
  {
    slug: "avif-to-jpg",
    path: "/avif-to-jpg",
    title: "AVIF to JPG Converter — Free Online, No Install",
    description:
      "Convert AVIF to JPG free in your browser for wider app and form compatibility. No upload needed, so files stay private. Works on Android and iPhone.",
    keywords: ["avif to jpg", "avif to jpeg", "convert avif", "no upload"],
    faqs: AVIF_TO_JPG_FAQS,
    howTo: AVIF_TO_JPG_HOW_TO,
    related: ["avif-to-png", "avif-to-webp", "compress-image"],
  },
  {
    slug: "avif-to-png",
    path: "/avif-to-png",
    title: "AVIF to PNG Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF to PNG free in your browser. No upload needed, works on mobile. Preserves transparency and supports Android, iPhone, Windows, and Mac.",
    keywords: ["avif to png", "convert avif", "png converter", "no upload"],
    faqs: AVIF_TO_PNG_FAQS,
    howTo: AVIF_TO_PNG_HOW_TO,
    related: ["avif-to-jpg", "avif-to-webp", "compress-image"],
  },
  {
    slug: "avif-to-webp",
    path: "/avif-to-webp",
    title: "AVIF to WebP Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF to WebP free in your browser—no upload needed. Useful when you need wide browser support and small files. Works on mobile instantly.",
    keywords: ["avif to webp", "convert avif", "webp converter", "no upload"],
    faqs: AVIF_TO_WEBP_FAQS,
    howTo: AVIF_TO_WEBP_HOW_TO,
    related: ["avif-to-jpg", "avif-to-png", "compress-image"],
  },
  {
    slug: "resize-image",
    path: "/resize-image",
    title: "Resize Image to Passport Size — Free Online",
    description:
      "Resize images to passport size, Aadhaar photo, WhatsApp DP, Instagram, and more—free, instant, no upload. Works on Android and iPhone.",
    keywords: [
      "resize image",
      "passport size photo",
      "passport photo 35x45mm",
      "413x531 passport photo",
      "aadhar photo size",
      "aadhar photo 35x35mm",
      "413x413 aadhar photo",
      "whatsapp dp size 500x500",
      "instagram post size 1080x1080",
      "facebook cover size 820x312",
      "resize online",
      "image resizer",
      "no upload",
    ],
    related: ["resize-image-to-200kb", "compress-image", "image-to-pdf"],
  },
  {
    slug: "resize-jpg",
    path: "/resize-jpg",
    title: "Resize JPG Image — Free, No Upload, Works on Mobile",
    description:
      "Resize JPG photos by pixels or presets free in your browser for social posts and forms. No upload needed, and images stay private. Includes custom dimensions.",
    keywords: ["resize jpg", "jpg resizer", "resize photo", "no upload"],
    related: ["resize-image", "resize-image-to-200kb", "compress-jpg"],
  },
  {
    slug: "resize-png",
    path: "/resize-png",
    title: "Resize PNG Image — Free, No Upload, Works on Mobile",
    description:
      "Resize PNG images by pixels or presets free in your browser for social posts and forms. No upload needed, and images stay private. Includes custom dimensions.",
    keywords: ["resize png", "png resizer", "resize image", "no upload"],
    related: ["resize-image", "compress-png", "png-to-jpg"],
  },
  {
    slug: "resize-webp",
    path: "/resize-webp",
    title: "Resize WebP Image — Free, No Upload, Works on Mobile",
    description:
      "Resize WebP images by pixels or presets free in your browser for sharing and uploads. No upload needed, and images stay private. Includes custom dimensions.",
    keywords: ["resize webp", "webp resizer", "resize image", "no upload"],
    related: ["resize-image", "compress-webp", "webp-to-jpg"],
  },
  {
    slug: "resize-avif",
    path: "/resize-avif",
    title: "Resize AVIF Image — Free, No Upload, Works on Mobile",
    description:
      "Resize AVIF images by pixels or preset sizes in your browser with no upload. Supports passport, WhatsApp DP, Instagram, and custom dimensions. Works on mobile.",
    keywords: ["resize avif", "avif resizer", "resize image", "no upload"],
    related: ["resize-image", "compress-avif", "avif-to-jpg"],
  },
  {
    slug: "resize-heic",
    path: "/resize-heic",
    title: "Resize HEIC Image — Free, No Upload, Works on Mobile",
    description:
      "Resize WebP images by pixels or presets free in your browser for faster sharing and uploads. No upload needed, and files stay private. Includes custom sizes.",
    keywords: ["resize heic", "heic resizer", "iphone photo resize", "no upload"],
    related: ["resize-image", "compress-heic", "heic-to-jpg"],
  },
  {
    slug: "resize-passport-photo",
    path: "/resize-passport-photo",
    title: "Passport Size Photo Resize — 35x45mm Free",
    description:
      "Resize any image to passport photo size 35x45 mm (413x531 px) free in your browser. No upload needed, files stay private. Works on Android and iPhone.",
    keywords: ["passport photo 35x45mm", "413x531", "resize passport photo", "no upload"],
    faqs: resizePassportPhotoFAQs,
    faqHeading: "Passport photo size - common questions",
    related: ["resize-image", "resize-image-to-200kb", "resize-aadhar-photo"],
  },
  {
    slug: "resize-aadhar-photo",
    path: "/resize-aadhar-photo",
    title: "Resize Photo for Aadhaar — Under 200KB Free",
    description:
      "Resize any image to Aadhaar photo size 35x35 mm (413x413 px) free in your browser. No upload needed, files stay private. Works on Android and iPhone.",
    keywords: ["aadhar photo 35x35mm", "413x413", "resize aadhar photo", "no upload"],
    faqs: resizeAadharPhotoFAQs,
    related: ["resize-image", "resize-passport-photo", "resize-image-to-200kb"],
  },
  {
    slug: "resize-whatsapp-dp",
    path: "/resize-whatsapp-dp",
    title: "Resize Image for WhatsApp DP — 500x500px Free",
    description:
      "Resize image to WhatsApp DP size 500×500 px in your browser with no upload. Free, instant, works on Android and iPhone. Perfect square crop for profile.",
    keywords: ["whatsapp dp size", "500x500", "resize whatsapp dp", "no upload"],
    related: ["resize-image", "resize-instagram-post", "compress-image"],
  },
  {
    slug: "resize-instagram-post",
    path: "/resize-instagram-post",
    title: "Resize Image for Instagram Post — 1080x1080 Free",
    description:
      "Resize image to Instagram post size 1080×1080 px in your browser with no upload. Free, instant, works on Android and iPhone. No app install needed.",
    keywords: ["instagram post size", "1080x1080", "resize instagram post", "no upload"],
    related: ["resize-image", "resize-instagram-story", "compress-image"],
  },
  {
    slug: "resize-instagram-story",
    path: "/resize-instagram-story",
    title: "Resize Instagram Story / Reel 1080x1920 px — Free Online",
    description:
      "Resize image to Instagram story and reel size 1080×1920 px in your browser with no upload. Free, instant, works on Android and iPhone. No install needed.",
    keywords: ["instagram story size", "1080x1920", "resize instagram reel", "no upload"],
    related: ["resize-image", "resize-instagram-post", "compress-image"],
  },
  {
    slug: "resize-youtube-thumbnail",
    path: "/resize-youtube-thumbnail",
    title: "YouTube Thumbnail Resize — 1280x720px Free",
    description:
      "Resize any image to YouTube thumbnail size 1280x720 px free in your browser for crisp 16:9 previews. No upload needed, files stay private. Instant download.",
    keywords: ["youtube thumbnail size", "1280x720", "resize youtube thumbnail", "no upload"],
    related: ["resize-image", "resize-facebook-post", "compress-image"],
  },
  {
    slug: "resize-facebook-post",
    path: "/resize-facebook-post",
    title: "Resize Facebook Post 1200x630 px — Free Online",
    description:
      "Resize any image to Facebook post size 1200x630 px free in your browser for clear social previews. No upload needed, files stay private. Instant download.",
    keywords: ["facebook post size", "1200x630", "resize facebook post", "no upload"],
    related: ["resize-image", "resize-facebook-cover", "compress-image"],
  },
  {
    slug: "resize-facebook-cover",
    path: "/resize-facebook-cover",
    title: "Facebook Cover Photo Size — 820x312px Resizer Free",
    description:
      "Resize image to Facebook cover photo size 820×312 px in your browser with no upload. Free, instant, works on Android and iPhone. No app or software needed.",
    keywords: ["facebook cover size", "820x312", "resize facebook cover", "no upload"],
    related: ["resize-image", "resize-facebook-post", "compress-image"],
  },
  {
    slug: "resize-signature-upload",
    path: "/resize-signature-upload",
    title: "Resize Signature for Online Form — Under 10KB Free",
    description:
      "Resize signature image to 400×150 px for online form uploads in your browser—no upload needed. Under 10KB output. Works on Android and iPhone.",
    keywords: ["signature size 400x150", "resize signature", "signature upload", "no upload"],
    related: ["resize-image", "resize-image-to-200kb", "compress-image"],
  },
  {
    slug: "resize-2x2-photo",
    path: "/resize-2x2-photo",
    title: "Resize Photo to 2x2 Inch — US Visa & Passport",
    description:
      "Resize any image to 2x2 inch photo size (600x600 px at 300 DPI) free in your browser. No upload needed, files stay private. Works on Android and iPhone.",
    keywords: ["2x2 inch photo", "600x600", "resize 2x2 photo", "no upload"],
    related: ["resize-image", "resize-passport-photo", "resize-aadhar-photo"],
  },
  {
    slug: "resize-product-square",
    path: "/resize-product-square",
    title: "Resize Product Image Square — Amazon Flipkart Size Free",
    description:
      "Resize product images to 1000x1000 px square free in your browser for ecommerce listings. No upload needed, so files stay private. Works on Android and iPhone.",
    keywords: ["product image 1000x1000", "resize product image", "square image", "no upload"],
    related: ["resize-image", "resize-instagram-post", "compress-image"],
  },
  {
    slug: "resize-image-to-200kb",
    path: "/resize-image-to-200kb",
    title: "Resize Image to 200KB — For Govt Form Uploads",
    description:
      "Resize and compress an image to a target size like 200KB for government form uploads—free, instant, no upload, works on mobile.",
    keywords: [
      "resize image to 200kb",
      "compress to 200kb",
      "under 200kb",
      "resize photo to 200kb",
      "government form upload",
      "no upload",
    ],
    faqs: resizeTo200kbFAQs,
    related: ["resize-image", "compress-image", "heic-to-jpg"],
  },
  {
    slug: "image-to-pdf",
    path: "/image-to-pdf",
    title: "Image to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert JPG, PNG, WebP images to a single PDF free in your browser—no upload needed. Works on mobile. Perfect for government form document submissions.",
    keywords: ["image to pdf", "jpg to pdf", "pdf converter", "no upload"],
    faqs: IMAGE_TO_PDF_FAQS,
    howTo: IMAGE_TO_PDF_HOW_TO,
    related: ["jpg-to-pdf", "png-to-pdf", "heic-to-pdf", "pdf-to-image"],
  },
  {
    slug: "pdf-to-image",
    path: "/pdf-to-image",
    title: "PDF to Image Converter — JPG, PNG, WebP, AVIF Free",
    description:
      "Convert PDF pages to images in your browser with no upload. Choose JPG, PNG, WebP, or AVIF and download one-by-one or all at once.",
    keywords: [
      "pdf to image",
      "pdf to jpg",
      "pdf to png",
      "pdf to webp",
      "pdf to avif",
      "no upload",
    ],
    related: ["image-to-pdf", "jpg-to-pdf", "png-to-pdf", "compress-image"],
  },
  {
    slug: "pdf-to-jpg",
    path: "/pdf-to-jpg",
    title: "PDF to JPG Converter — Free, No Upload",
    description:
      "Convert PDF pages to JPG free in your browser for sharing and submissions. No upload needed, so files stay private. Download one page or all pages at once.",
    keywords: ["pdf to jpg", "pdf to image", "no upload"],
    related: ["pdf-to-image", "pdf-to-png", "jpg-to-pdf"],
  },
  {
    slug: "pdf-to-png",
    path: "/pdf-to-png",
    title: "PDF to PNG Converter — Free, No Upload",
    description:
      "Convert PDF pages to PNG free in your browser for crisp text and graphics. No upload needed, so files stay private. Download one page or all pages at once.",
    keywords: ["pdf to png", "pdf to image", "no upload"],
    related: ["pdf-to-image", "png-to-pdf", "compress-png"],
  },
  {
    slug: "pdf-to-webp",
    path: "/pdf-to-webp",
    title: "PDF to WebP Converter — Free, No Upload",
    description:
      "Convert PDF pages to WebP free in your browser for smaller image files. No upload needed, so files stay private. Download one page or all pages at once.",
    keywords: ["pdf to webp", "pdf to image", "no upload"],
    related: ["pdf-to-image", "webp-to-pdf", "compress-webp"],
  },
  {
    slug: "pdf-to-avif",
    path: "/pdf-to-avif",
    title: "PDF to AVIF Converter — Free, No Upload",
    description:
      "Convert PDF pages to AVIF free in your browser for maximum compression. No upload needed, so files stay private. Download one page or all pages at once.",
    keywords: ["pdf to avif", "pdf to image", "no upload"],
    related: ["pdf-to-image", "avif-to-pdf", "compress-avif"],
  },
  {
    slug: "jpg-to-pdf",
    path: "/jpg-to-pdf",
    title: "JPG to PDF Converter — Free Online, No Watermark",
    description:
      "Convert JPG or JPEG images to PDF free in your browser for forms, sharing, and archives. No upload needed, so files stay private. Works on Android and iPhone.",
    keywords: ["jpg to pdf", "jpeg to pdf", "image to pdf", "no upload"],
    faqs: JPG_TO_PDF_FAQS,
    howTo: JPG_TO_PDF_HOW_TO,
    related: ["image-to-pdf", "png-to-pdf", "compress-image"],
  },
  {
    slug: "png-to-pdf",
    path: "/png-to-pdf",
    title: "PNG to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert PNG images into a single PDF in your browser. No upload required, works on mobile. Ideal for government form submissions and document sharing.",
    keywords: ["png to pdf", "convert png to pdf", "pdf converter", "no upload"],
    related: ["image-to-pdf", "jpg-to-pdf", "webp-to-pdf"],
  },
  {
    slug: "webp-to-pdf",
    path: "/webp-to-pdf",
    title: "WebP to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert WebP images into a single PDF in your browser with no upload. Works on Android and iPhone. Ideal for document submissions and government portals.",
    keywords: ["webp to pdf", "convert webp to pdf", "pdf converter", "no upload"],
    related: ["image-to-pdf", "png-to-pdf", "jpg-to-pdf"],
  },
  {
    slug: "heic-to-pdf",
    path: "/heic-to-pdf",
    title: "HEIC to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert iPhone HEIC photos to PDF in your browser—files converted on-device with no upload. Works on Android and iPhone. Useful for document submissions.",
    keywords: ["heic to pdf", "iphone heic to pdf", "pdf converter", "no upload"],
    faqs: HEIC_TO_PDF_FAQS,
    howTo: HEIC_TO_PDF_HOW_TO,
    related: ["image-to-pdf", "heic-to-jpg", "jpg-to-pdf"],
  },
  {
    slug: "avif-to-pdf",
    path: "/avif-to-pdf",
    title: "AVIF to PDF Converter — Free, No Upload, Works on Mobile",
    description:
      "Convert AVIF images to a single PDF free in your browser—no upload needed. Works on Android and iPhone. Ideal for government document submissions.",
    keywords: ["avif to pdf", "convert avif to pdf", "pdf converter", "no upload"],
    faqs: AVIF_TO_PDF_FAQS,
    howTo: AVIF_TO_PDF_HOW_TO,
    related: ["image-to-pdf", "avif-to-jpg", "png-to-pdf"],
  },
] as const satisfies readonly ToolDefinition[];

export function getTool(slug: ToolDefinition["slug"]): ToolDefinition {
  const found = (TOOLS as readonly ToolDefinition[]).find((t) => t.slug === slug);
  if (!found) throw new Error(`Unknown tool slug: ${slug}`);
  return found;
}

function normalizeToolNameForFaq(title: string): string {
  return title.replace(/\s+[—-]\s+.*$/, "").trim();
}

function buildDefaultFaqs(tool: ToolDefinition): FaqItem[] {
  const toolName = normalizeToolNameForFaq(tool.title);
  const workflowFamily = getToolWorkflowFamily(tool);
  const primaryRelatedTool = tool.related?.[0]
    ? normalizeToolNameForFaq(getTool(tool.related[0]).title)
    : "the related tool";
  const secondaryRelatedTool = tool.related?.[1]
    ? normalizeToolNameForFaq(getTool(tool.related[1]).title)
    : primaryRelatedTool;

  if (workflowFamily === "universal-convert") {
    return [
      {
        question: `What is the fastest way to use ${toolName}?`,
        answer:
          "Upload one or more images, choose the output format, and download converted files directly from your browser.",
      },
      {
        question: "Which file formats are supported in this converter?",
        answer:
          "It supports common image formats including JPG, PNG, WebP, AVIF, and HEIC/HEIF, based on browser support.",
      },
      {
        question: "Are my files uploaded while converting?",
        answer:
          "No. Conversion runs in-browser so your files stay on your device during processing.",
      },
      {
        question: `Can I optimize output after conversion?`,
        answer:
          `Yes. After conversion you can open ${primaryRelatedTool} or ${secondaryRelatedTool} for size or dimension adjustments.`,
      },
      {
        question: "Does this tool work on mobile browsers?",
        answer:
          "Yes. It works on modern Android and iPhone browsers and also on desktop.",
      },
      {
        question: "Do I need an account to convert images?",
        answer:
          "No account or app install is required. Open the tool, process files, and download results instantly.",
      },
    ];
  }

  if (workflowFamily === "format-convert") {
    return [
      {
        question: `How do I convert files with ${toolName}?`,
        answer:
          "Upload source files, keep default quality or tune settings, then export the converted output.",
      },
      {
        question: "Will conversion reduce image quality?",
        answer:
          "Quality depends on output format and settings. One clean conversion is usually sufficient for practical uploads.",
      },
      {
        question: "Can I convert multiple images at once?",
        answer:
          "Yes, where browser memory allows. For large batches, process in smaller sets for stability.",
      },
      {
        question: "Are converted files private?",
        answer:
          "Yes. Processing happens in your browser and files are not sent to an external upload server.",
      },
      {
        question: `What if the output file is still too large?`,
        answer:
          `After conversion, use ${primaryRelatedTool} to reduce size or ${secondaryRelatedTool} for target-specific adjustments.`,
      },
      {
        question: "Can I use this converter from phone?",
        answer:
          "Yes. The workflow is optimized for both mobile and desktop browsers.",
      },
    ];
  }

  if (workflowFamily === "image-to-pdf") {
    return [
      {
        question: `How do I create a PDF with ${toolName}?`,
        answer:
          "Upload one or more images, arrange their order, set page options, and export a final PDF.",
      },
      {
        question: "Can I combine multiple images into one PDF?",
        answer:
          "Yes. Add all pages together, reorder if needed, and download one consolidated document.",
      },
      {
        question: "How can I avoid rejection on upload portals?",
        answer:
          "Verify page order, readability, and final file size before submission.",
      },
      {
        question: "Does conversion happen on-device?",
        answer:
          "Yes. Image processing and PDF generation happen in your browser session.",
      },
      {
        question: `Can I reduce PDF source image size first?`,
        answer:
          `Yes. Use ${primaryRelatedTool} before PDF creation when source files are very large.`,
      },
      {
        question: "Is this usable on mobile?",
        answer:
          "Yes. You can create PDFs from phone browsers and download immediately.",
      },
    ];
  }

  if (workflowFamily === "pdf-to-image") {
    return [
      {
        question: `How do I convert PDF pages using ${toolName}?`,
        answer:
          "Upload a PDF, choose output format and quality, then export pages as images.",
      },
      {
        question: "Can I download all converted pages at once?",
        answer:
          "Yes. You can usually download page outputs individually or in one batch.",
      },
      {
        question: "Which format is best for document pages?",
        answer:
          "PNG is useful for crisp text, JPG for smaller size, and WebP/AVIF for stronger compression.",
      },
      {
        question: "Will page quality remain readable?",
        answer:
          "Yes, if you use practical quality settings and verify text at full zoom after export.",
      },
      {
        question: `Can I convert extracted pages back to PDF later?`,
        answer:
          `Yes. Use ${primaryRelatedTool} when you need to reassemble image pages into a PDF.`,
      },
      {
        question: "Are uploaded PDFs stored externally?",
        answer:
          "No. Conversion runs in-browser for private processing.",
      },
    ];
  }

  if (workflowFamily === "compress") {
    return [
      {
        question: `How should I use ${toolName} for best results?`,
        answer:
          "Compress in small steps and stop as soon as target size is reached with acceptable clarity.",
      },
      {
        question: "Should I use one heavy compression pass or multiple small passes?",
        answer:
          "Multiple controlled adjustments usually preserve readability better than one extreme pass.",
      },
      {
        question: "Can compression help with strict upload limits?",
        answer:
          "Yes. Keep final size slightly below the limit to avoid validation edge-case failures.",
      },
      {
        question: "What should I verify before uploading compressed output?",
        answer:
          "Check face/text clarity at full zoom and confirm final file size after export.",
      },
      {
        question: `What if I also need exact dimensions?`,
        answer:
          `Use ${primaryRelatedTool} when dimension compliance is required along with size reduction.`,
      },
      {
        question: "Is compression private and app-free?",
        answer:
          "Yes. Processing happens in-browser and no app installation is required.",
      },
    ];
  }

  return [
    {
      question: `How do I use ${toolName} correctly?`,
      answer:
        `Upload your file, choose the required dimension and settings, then export and verify before upload.`,
    },
    {
      question: "What is the right sequence for resize workflows?",
      answer:
        "Set dimensions first, then adjust quality or size target to reduce rejection risk.",
    },
    {
      question: "Can I use presets and custom dimensions together?",
      answer:
        "Yes. Start with a preset and fine-tune custom width and height if your portal requires exact values.",
    },
    {
      question: "How do I keep quality while resizing?",
      answer:
        "Avoid excessive downscaling in one step and confirm details at full zoom after export.",
    },
    {
      question: `Do I need additional tools after resize?`,
      answer:
        `If size is still high, open ${primaryRelatedTool} for controlled compression.`,
    },
    {
      question: "Does it support mobile uploads and no-app usage?",
      answer:
        "Yes. The workflow runs directly in modern mobile and desktop browsers.",
    },
  ];
}

function normalizeFaqText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueFaqItems(items: FaqItem[]): FaqItem[] {
  const seen = new Set<string>();
  const normalized: FaqItem[] = [];

  for (const item of items) {
    const question = normalizeFaqText(item.question);
    const answer = normalizeFaqText(item.answer);

    if (!question || !answer) {
      continue;
    }

    const key = question.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalized.push({ question, answer });
  }

  return normalized;
}

export function getToolFaqs(tool: ToolDefinition): FaqItem[] {
  const fallbackFaqs = buildDefaultFaqs(tool);
  const customFaqs = tool.faqs ?? [];
  const mergedFaqs = uniqueFaqItems([...customFaqs, ...fallbackFaqs]);

  if (mergedFaqs.length <= 6) {
    return mergedFaqs;
  }

  return mergedFaqs.slice(0, 6);
}

type ToolWorkflowFamily =
  | "universal-convert"
  | "format-convert"
  | "image-to-pdf"
  | "pdf-to-image"
  | "compress"
  | "resize";

function getToolWorkflowFamily(tool: ToolDefinition): ToolWorkflowFamily {
  if (tool.slug === "image-converter") {
    return "universal-convert";
  }

  if (/^pdf-to-/.test(tool.slug)) {
    return "pdf-to-image";
  }

  if (tool.slug === "image-to-pdf" || /-to-pdf$/.test(tool.slug)) {
    return "image-to-pdf";
  }

  if (tool.slug.startsWith("compress-")) {
    return "compress";
  }

  if (tool.slug.startsWith("resize-")) {
    return "resize";
  }

  return "format-convert";
}

const TOOL_HUB_SLUG_BY_WORKFLOW: Record<ToolWorkflowFamily, ToolDefinition["slug"]> = {
  "universal-convert": "image-converter",
  "format-convert": "image-converter",
  "image-to-pdf": "image-to-pdf",
  "pdf-to-image": "pdf-to-image",
  compress: "compress-image",
  resize: "resize-image",
};

function uniqueToolsBySlug(items: ToolDefinition[]): ToolDefinition[] {
  const seen = new Set<string>();
  const unique: ToolDefinition[] = [];

  for (const item of items) {
    if (seen.has(item.slug)) {
      continue;
    }

    seen.add(item.slug);
    unique.push(item);
  }

  return unique;
}

export function getToolHub(tool: ToolDefinition): ToolDefinition {
  const workflowFamily = getToolWorkflowFamily(tool);
  const hubSlug = TOOL_HUB_SLUG_BY_WORKFLOW[workflowFamily];
  return getTool(hubSlug);
}

export function getToolSiblingRoutes(tool: ToolDefinition, limit = 4): ToolDefinition[] {
  const allTools = TOOLS as readonly ToolDefinition[];
  const workflowFamily = getToolWorkflowFamily(tool);
  const hubTool = getToolHub(tool);

  let familyCandidates: ToolDefinition[] = [];

  if (workflowFamily === "format-convert") {
    const formatPair = getFormatPairFromSlug(tool.slug);

    if (formatPair) {
      const sourcePrefix = `${formatPair.from.toLowerCase()}-to-`;
      const targetSuffix = `-to-${formatPair.to.toLowerCase()}`;
      const sameSource = allTools.filter((candidate) => candidate.slug.startsWith(sourcePrefix));
      const sameTarget = allTools.filter((candidate) => candidate.slug.endsWith(targetSuffix));
      familyCandidates = [...sameSource, ...sameTarget];
    }
  } else if (workflowFamily === "compress") {
    familyCandidates = allTools.filter((candidate) => candidate.slug.startsWith("compress-"));
  } else if (workflowFamily === "resize") {
    familyCandidates = allTools.filter((candidate) => candidate.slug.startsWith("resize-"));
  } else if (workflowFamily === "image-to-pdf") {
    familyCandidates = allTools.filter(
      (candidate) => candidate.slug === "image-to-pdf" || candidate.slug.endsWith("-to-pdf"),
    );
  } else if (workflowFamily === "pdf-to-image") {
    familyCandidates = allTools.filter((candidate) => candidate.slug.startsWith("pdf-to-"));
  } else {
    familyCandidates = allTools.filter(
      (candidate) =>
        getToolWorkflowFamily(candidate) === "format-convert" || candidate.slug === "image-converter",
    );
  }

  const prioritizedRelated = (tool.related ?? []).map((slug) => getTool(slug));

  return uniqueToolsBySlug([...prioritizedRelated, ...familyCandidates])
    .filter((candidate) => candidate.slug !== tool.slug)
    .filter((candidate) => candidate.slug !== hubTool.slug)
    .slice(0, limit);
}

export type ToolWidgetGroup = {
  heading: string;
  description: string;
  tools: ToolDefinition[];
};

export function getToolWidgetGroup(tool: ToolDefinition): ToolWidgetGroup | null {
  const allTools = TOOLS as readonly ToolDefinition[];
  const workflowFamily = getToolWorkflowFamily(tool);

  if (workflowFamily === "format-convert") {
    const formatPair = getFormatPairFromSlug(tool.slug);

    if (!formatPair) {
      return null;
    }

    const sourcePrefix = `${formatPair.from.toLowerCase()}-to-`;
    const widgets = allTools
      .filter((candidate) => candidate.slug.startsWith(sourcePrefix) || candidate.slug === `${formatPair.from.toLowerCase()}-to-pdf`)
      .filter((candidate) => candidate.slug !== tool.slug)
      .slice(0, 4);

    if (widgets.length === 0) {
      return null;
    }

    return {
      heading: `${formatPair.from} conversion widgets`,
      description: `Switch output formats quickly when a portal or app changes accepted file types for ${formatPair.from} sources.`,
      tools: widgets,
    };
  }

  if (workflowFamily === "image-to-pdf") {
    const widgets = allTools
      .filter((candidate) => candidate.slug === "image-to-pdf" || candidate.slug.endsWith("-to-pdf"))
      .filter((candidate) => candidate.slug !== tool.slug)
      .slice(0, 4);

    if (widgets.length === 0) {
      return null;
    }

    return {
      heading: "Image to PDF widgets",
      description: "Jump to format-specific PDF converters when your source image type is fixed by the submission flow.",
      tools: widgets,
    };
  }

  if (workflowFamily === "pdf-to-image") {
    const widgets = allTools
      .filter((candidate) => candidate.slug.startsWith("pdf-to-"))
      .filter((candidate) => candidate.slug !== tool.slug)
      .slice(0, 4);

    if (widgets.length === 0) {
      return null;
    }

    return {
      heading: "PDF to image widgets",
      description: "Pick the output format that best fits readability, compatibility, or file-size constraints.",
      tools: widgets,
    };
  }

  if (workflowFamily === "compress") {
    const widgets = allTools
      .filter((candidate) => candidate.slug.startsWith("compress-"))
      .filter((candidate) => candidate.slug !== tool.slug)
      .slice(0, 4);

    if (widgets.length === 0) {
      return null;
    }

    return {
      heading: "Compression widgets by format",
      description: "Open a format-specific compressor when you need predictable output under strict upload limits.",
      tools: widgets,
    };
  }

  if (workflowFamily === "resize") {
    const preferredResizeSlugs: ToolDefinition["slug"][] = [
      "resize-passport-photo",
      "resize-aadhar-photo",
      "resize-signature-upload",
      "resize-image-to-200kb",
      "resize-instagram-post",
      "resize-whatsapp-dp",
    ];

    const preferredResizeTools = preferredResizeSlugs.map((slug) => getTool(slug));
    const allResizeTools = allTools.filter((candidate) => candidate.slug.startsWith("resize-"));
    const widgets = uniqueToolsBySlug([...preferredResizeTools, ...allResizeTools])
      .filter((candidate) => candidate.slug !== tool.slug)
      .slice(0, 4);

    if (widgets.length === 0) {
      return null;
    }

    return {
      heading: "Resize widgets for common intents",
      description: "Move between passport, Aadhaar, signature, and social presets without rebuilding settings from scratch.",
      tools: widgets,
    };
  }

  const universalWidgets = allTools
    .filter((candidate) =>
      [
        "heic-to-jpg",
        "jpg-to-png",
        "png-to-webp",
        "webp-to-jpg",
      ].includes(candidate.slug),
    )
    .filter((candidate) => candidate.slug !== tool.slug)
    .slice(0, 4);

  if (universalWidgets.length === 0) {
    return null;
  }

  return {
    heading: "Popular conversion widgets",
    description: "Use quick conversion shortcuts for the most common compatibility requests.",
    tools: universalWidgets,
  };
}

function getFormatPairFromSlug(slug: string): { from: string; to: string } | null {
  const match = slug.match(/^([a-z0-9]+)-to-([a-z0-9]+)$/);
  if (!match) {
    return null;
  }

  return {
    from: match[1].toUpperCase(),
    to: match[2].toUpperCase(),
  };
}

export function getToolFeatureList(tool: ToolDefinition): string[] {
  const workflowFamily = getToolWorkflowFamily(tool);
  const formatPair = getFormatPairFromSlug(tool.slug);
  const shared = [
    "Private browser-based processing",
    "Works on Android, iPhone, and desktop browsers",
    "No sign-in or app installation required",
  ];

  if (workflowFamily === "universal-convert") {
    return [
      "Convert JPG, PNG, WebP, AVIF, and HEIC/HEIF in one workflow",
      "Select output extension and export instantly",
      ...shared,
    ];
  }

  if (workflowFamily === "format-convert") {
    return [
      formatPair
        ? `Convert ${formatPair.from} to ${formatPair.to} directly in browser`
        : "Convert between common image formats",
      "Adjust quality for size and readability balance",
      ...shared,
    ];
  }

  if (workflowFamily === "image-to-pdf") {
    return [
      "Merge multiple images into one PDF",
      "Reorder pages and control layout before export",
      ...shared,
    ];
  }

  if (workflowFamily === "pdf-to-image") {
    return [
      "Extract PDF pages as JPG, PNG, WebP, or AVIF",
      "Download individual pages or full batch output",
      ...shared,
    ];
  }

  if (workflowFamily === "compress") {
    return [
      "Reduce file size for upload limits",
      "Tune compression settings with preview validation",
      ...shared,
    ];
  }

  return [
    "Resize by preset or custom dimensions",
    "Support exact upload requirements for forms and profiles",
    ...shared,
  ];
}

function withHowToStepIds(
  tool: ToolDefinition,
  steps: Array<Pick<ToolHowToStep, "name" | "text">>,
): ToolHowToStep[] {
  return steps.map((step, index) => ({
    id: `${tool.slug}-step-${index + 1}`,
    name: step.name,
    text: step.text,
  }));
}

export function getToolHowTo(tool: ToolDefinition): ToolHowTo {
  if (tool.howTo) {
    return {
      name: tool.howTo.name,
      description: tool.howTo.description,
      steps: withHowToStepIds(tool, tool.howTo.steps),
    };
  }

  const toolName = normalizeToolNameForFaq(tool.title);
  const workflowFamily = getToolWorkflowFamily(tool);

  if (workflowFamily === "universal-convert") {
    return {
      name: `How to use ${toolName}`,
      description:
        "Convert between common image formats in three quick steps without uploading files to a server.",
      steps: withHowToStepIds(tool, [
        {
          name: "Upload your source images",
          text: "Select one or more images from your device. The converter supports common formats including JPG, PNG, WebP, AVIF, and HEIC.",
        },
        {
          name: "Choose output format and settings",
          text: "Pick the format you want for download and adjust quality or size preferences if needed.",
        },
        {
          name: "Convert and download",
          text: "Run conversion, review the output preview, and download your final files instantly.",
        },
      ]),
    };
  }

  if (workflowFamily === "format-convert") {
    return {
      name: `How to use ${toolName}`,
      description:
        "Convert files to your target image format in a quick browser workflow designed for mobile and desktop.",
      steps: withHowToStepIds(tool, [
        {
          name: "Upload source files",
          text: `Select the image files you want to convert with ${toolName}.`,
        },
        {
          name: "Set output preferences",
          text: "Choose output quality or sizing options to balance clarity and file size.",
        },
        {
          name: "Export converted images",
          text: "Start conversion and download each result once processing is complete.",
        },
      ]),
    };
  }

  if (workflowFamily === "image-to-pdf") {
    return {
      name: `How to use ${toolName}`,
      description:
        "Combine your images into a clean PDF in a predictable flow suitable for uploads and document sharing.",
      steps: withHowToStepIds(tool, [
        {
          name: "Add your images",
          text: "Upload one or multiple images from your device in the required order.",
        },
        {
          name: "Set page layout",
          text: "Adjust page size, orientation, and fit settings before generating the file.",
        },
        {
          name: "Generate and download PDF",
          text: "Create the final PDF, review readability, and download it for submission.",
        },
      ]),
    };
  }

  if (workflowFamily === "pdf-to-image") {
    return {
      name: `How to use ${toolName}`,
      description:
        "Extract PDF pages as image files with consistent quality settings for easy sharing and reuse.",
      steps: withHowToStepIds(tool, [
        {
          name: "Upload your PDF",
          text: "Select the PDF file you want to convert to image pages.",
        },
        {
          name: "Choose output format",
          text: "Pick JPG, PNG, WebP, or AVIF and set quality options as needed.",
        },
        {
          name: "Convert pages and download",
          text: "Export pages, then download them individually or in one batch.",
        },
      ]),
    };
  }

  if (workflowFamily === "compress") {
    return {
      name: `How to use ${toolName}`,
      description:
        "Reduce file size while preserving practical readability by compressing in controlled steps.",
      steps: withHowToStepIds(tool, [
        {
          name: "Upload your image",
          text: "Select the file you want to compress from your device.",
        },
        {
          name: "Adjust compression settings",
          text: "Tune quality and target size until the preview meets your requirement.",
        },
        {
          name: "Download compressed output",
          text: "Export the optimized image and verify size and clarity before upload.",
        },
      ]),
    };
  }

  return {
    name: `How to use ${toolName}`,
    description:
      "Resize images with preset or custom dimensions to meet exact upload requirements.",
    steps: withHowToStepIds(tool, [
      {
        name: "Upload your image",
        text: "Select the image you want to resize from your device.",
      },
      {
        name: "Choose size settings",
        text: "Pick a preset or enter custom dimensions and optional size target.",
      },
      {
        name: "Export resized image",
        text: "Apply resizing, then download the result and confirm dimensions and file size.",
      },
    ]),
  };
}

type ToolMetadataOverride = {
  title?: string;
  canonicalPath?: `/${string}`;
};

export function getOgSvgPath(slug: string): `/${string}` {
  return `/og/${slug}.png`;
}

const TOOL_METADATA_OVERRIDES: Record<string, ToolMetadataOverride> = {
  "avif-to-jpg": { title: "AVIF to JPG Converter — Free, No Install" },
  "avif-to-pdf": { title: "AVIF to PDF Converter — Free, No Upload" },
  "avif-to-png": { title: "AVIF to PNG Converter — Free, No Upload" },
  "avif-to-webp": { title: "AVIF to WebP Converter — Free, No Upload" },
  "compress-avif": { title: "Compress AVIF Image — Free, No Upload" },
  "compress-heic": { title: "Compress iPhone HEIC Photos — Reduce Size Free" },
  "compress-image": { title: "Compress Image for WhatsApp — Free" },
  "compress-jpg": { title: "Compress JPG Without Losing Quality — Free" },
  "compress-png": { title: "Compress PNG File Size Online — Free" },
  "compress-webp": { title: "Compress WebP Image — Free, No Upload" },
  "heic-to-avif": { title: "HEIC to AVIF Converter — Free, Smaller Files" },
  "heic-to-jpg": {
    title: "HEIC to JPG Converter for India Form Uploads — Free, No Upload",
  },
  "heic-to-pdf": { title: "HEIC to PDF Converter — Free, No Upload" },
  "heic-to-png": { title: "HEIC to PNG Converter — Free, No Upload" },
  "heic-to-webp": { title: "HEIC to WebP Converter — Free, No Upload" },
  "image-converter": { title: "Universal Image Converter — Free Online" },
  "image-to-pdf": { title: "Image to PDF Converter — Free, No Upload" },
  "jpg-to-avif": { title: "JPG to AVIF Converter — Free, No Upload" },
  "jpg-to-pdf": { title: "JPG to PDF Converter — Free, No Watermark" },
  "jpg-to-png": { title: "JPG to PNG Converter — Free, No Upload" },
  "jpg-to-webp": { title: "JPG to WebP Converter — Free, No Upload" },
  "png-to-avif": { title: "PNG to AVIF Converter — Free, No Upload" },
  "png-to-jpg": { title: "PNG to JPG Converter — Free, No Upload" },
  "png-to-pdf": { title: "PNG to PDF Converter — Free, No Upload" },
  "resize-avif": { title: "Resize AVIF Image — Free, No Upload" },
  "resize-facebook-cover": {
    title: "Facebook Cover Photo Size — 820x312 Resizer Free",
  },
  "resize-heic": { title: "Resize HEIC Image — Free, No Upload" },
  "resize-image": { title: "Resize Image — Passport, WhatsApp, Instagram Free" },
  "resize-image-to-200kb": {
    title: "Resize Image to 200KB for Govt Forms — Free Online",
  },
  "resize-instagram-post": {
    title: "Resize for Instagram Post — 1080x1080 Free",
  },
  "resize-instagram-story": {
    title: "Instagram Story Resize — 1080x1920 Free",
  },
  "resize-jpg": { title: "Resize JPG Image — Free, No Upload" },
  "resize-png": { title: "Resize PNG Image — Free, No Upload" },
  "resize-passport-photo": {
    title: "Passport Photo Resize for India Forms — 35x45mm Free",
  },
  "resize-product-square": {
    title: "Resize Product Image Square — Amazon Flipkart Free",
  },
  "resize-signature-upload": {
    title: "Resize Signature for India Form Upload — Under 10KB",
  },
  "resize-aadhar-photo": {
    title: "Aadhaar Photo Resize for UIDAI Upload — Under 200KB",
  },
  "resize-webp": { title: "Resize WebP Image — Free, No Upload" },
  "webp-to-avif": { title: "WebP to AVIF Converter — Free, Smaller Files" },
  "webp-to-jpg": { title: "WebP to JPG Converter — Free, No Upload" },
  "webp-to-pdf": { title: "WebP to PDF Converter — Free, No Upload" },
  "webp-to-png": { title: "WebP to PNG Converter — Transparent BG, Free" },
};

export function generateToolMetadata(tool: ToolDefinition): Metadata {
  const override = TOOL_METADATA_OVERRIDES[tool.slug];
  const title = override?.title ?? tool.title;
  const description = tool.description;
  const canonicalPath = override?.canonicalPath ?? tool.path;
  const ogImage = getOgSvgPath(tool.slug);

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalPath,
      locale: "en",
      siteName: "Image Tools",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
