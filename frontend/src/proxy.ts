import { NextRequest, NextResponse } from "next/server";

const FALLBACK_CANONICAL_HOST = "image-tools.tech";
const RENDER_HOST_SUFFIX = ".onrender.com";

function getCanonicalHost(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return FALLBACK_CANONICAL_HOST;
  }

  try {
    return new URL(siteUrl).host.toLowerCase();
  } catch {
    return FALLBACK_CANONICAL_HOST;
  }
}

function getRequestHost(request: NextRequest): string {
  const hostHeader = request.headers.get("host") ?? "";
  return hostHeader.split(":")[0].toLowerCase();
}

function isLocalHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1";
}

export function proxy(request: NextRequest) {
  const requestHost = getRequestHost(request);

  if (!requestHost || isLocalHost(requestHost)) {
    return NextResponse.next();
  }

  if (!requestHost.endsWith(RENDER_HOST_SUFFIX)) {
    return NextResponse.next();
  }

  const canonicalHost = getCanonicalHost();
  if (requestHost === canonicalHost) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.protocol = "https:";
  redirectUrl.host = canonicalHost;

  return NextResponse.redirect(redirectUrl, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
