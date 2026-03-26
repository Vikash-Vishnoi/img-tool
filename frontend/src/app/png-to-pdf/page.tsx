import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("png-to-pdf");

export { metadata };
export default Page;
