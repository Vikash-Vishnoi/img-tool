import { createPdfToolPage } from "@/lib/pageFactories/pdfToolPageFactory";

const { metadata, Page } = createPdfToolPage("png-to-pdf");

export { metadata };
export default Page;
