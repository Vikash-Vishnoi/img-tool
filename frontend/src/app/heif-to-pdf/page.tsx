import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("heif-to-pdf");

export { metadata };
export default Page;
