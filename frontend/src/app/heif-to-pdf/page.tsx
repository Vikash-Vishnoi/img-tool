import { permanentRedirect } from "next/navigation";

export default function HeifToPdfRedirectPage() {
	permanentRedirect("/heic-to-pdf");
}
