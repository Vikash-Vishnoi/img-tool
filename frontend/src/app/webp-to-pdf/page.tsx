import { createPdfToolPage } from "@/lib/pageFactories/pdfToolPageFactory";

const { metadata, Page } = createPdfToolPage("webp-to-pdf");

export { metadata };
export default Page;
