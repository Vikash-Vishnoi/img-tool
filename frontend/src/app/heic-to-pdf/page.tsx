import { createPdfToolPage } from "@/lib/pageFactories/pdfToolPageFactory";

const { metadata, Page } = createPdfToolPage("heic-to-pdf");

export { metadata };
export default Page;
