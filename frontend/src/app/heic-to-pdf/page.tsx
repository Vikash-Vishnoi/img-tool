import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("heic-to-pdf");

export { metadata };
export default Page;
