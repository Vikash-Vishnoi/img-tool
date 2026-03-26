import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("jpg-to-pdf");

export { metadata };
export default Page;
