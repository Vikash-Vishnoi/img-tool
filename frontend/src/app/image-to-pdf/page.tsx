import { createPdfToolPage } from "@/lib/pageFactories";

const { metadata, Page } = createPdfToolPage("image-to-pdf");

export { metadata };
export default Page;
