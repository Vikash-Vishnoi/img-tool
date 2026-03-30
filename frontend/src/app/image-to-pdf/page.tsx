import { createPdfToolPage } from "@/lib/pageFactories/pdfToolPageFactory";

const { metadata, Page } = createPdfToolPage("image-to-pdf");

export { metadata };
export default Page;
