import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("webp-to-pdf");

export { metadata };
export default Page;
