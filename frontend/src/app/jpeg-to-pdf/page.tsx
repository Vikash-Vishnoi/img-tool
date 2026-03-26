import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("jpeg-to-pdf");

export { metadata };
export default Page;
