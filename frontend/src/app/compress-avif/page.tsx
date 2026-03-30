import { createCompressToolPage } from "@/lib/pageFactories/compressToolPageFactory";

const { metadata, Page } = createCompressToolPage("compress-avif");

export { metadata };
export default Page;
