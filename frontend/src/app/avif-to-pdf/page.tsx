import { createPdfToolPage } from "@/lib/pageFactories/pdfToolPageFactory";

const { metadata, Page } = createPdfToolPage("avif-to-pdf");

export { metadata };
export default Page;
