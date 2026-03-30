import { createPdfToolPage } from "@/lib/pageFactories/pdfToolPageFactory";

const { metadata, Page } = createPdfToolPage("jpg-to-pdf");

export { metadata };
export default Page;
