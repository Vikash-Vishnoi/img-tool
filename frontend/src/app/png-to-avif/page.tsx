import { createFormatToolPage } from "@/lib/pageFactories/formatToolPageFactory";

const { metadata, Page } = createFormatToolPage("png-to-avif");

export { metadata };
export default Page;
