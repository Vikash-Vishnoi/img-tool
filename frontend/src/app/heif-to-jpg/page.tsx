import { permanentRedirect } from "next/navigation";

export default function HeifToJpgRedirectPage() {
	permanentRedirect("/heic-to-jpg");
}
