import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("avif-to-pdf");

export { metadata };
export default Page;
