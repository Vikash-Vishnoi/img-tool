"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

type BlogShareButtonsProps = {
  canonicalUrl: string;
  title: string;
};

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M18.244 2H21l-6.58 7.52L22.2 22h-6.1l-4.78-6.26L5.84 22H3.08l7.02-8.02L2 2h6.26l4.32 5.72L18.244 2zm-1.08 18h1.69L7.34 3.9H5.53L17.164 20z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.2c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.4V11H7v3h2.8v8h3.7z" />
    </svg>
  );
}

function LinkedinLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M6.94 8.5a2.03 2.03 0 1 1 0-4.06 2.03 2.03 0 0 1 0 4.06zM5.2 20h3.47V9.9H5.2V20zm5.3 0h3.33v-5.15c0-1.36.26-2.68 1.94-2.68 1.65 0 1.68 1.55 1.68 2.77V20h3.34v-5.72c0-2.81-.6-4.97-3.9-4.97-1.58 0-2.63.87-3.06 1.7h-.05V9.9H10.5c.04.75 0 10.1 0 10.1z" />
    </svg>
  );
}

function RedditLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M14.6 15.2c.17.17.17.45 0 .62-.6.6-1.58.89-2.6.89-1.03 0-2-.3-2.6-.9a.44.44 0 1 1 .63-.61c.42.42 1.14.66 1.98.66.84 0 1.56-.24 1.98-.66.17-.17.45-.17.62 0zM9.2 13.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm5.6-.9a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0zm3.2-.2c0-.96-.78-1.74-1.74-1.74-.47 0-.9.19-1.2.5-.86-.6-2.02-.98-3.3-1.03l.7-2.2 1.87.44a1.35 1.35 0 1 0 .26-1.2l-2.18-.52a.44.44 0 0 0-.53.3l-.84 2.66c-1.38.03-2.62.41-3.53 1.03a1.73 1.73 0 0 0-2.95 1.24c0 .66.37 1.24.9 1.54a3.8 3.8 0 0 0-.04.52c0 2.16 2.5 3.92 5.57 3.92 3.08 0 5.58-1.76 5.58-3.92 0-.17-.01-.35-.04-.52.52-.3.88-.87.88-1.52z" />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.03 0C5.43 0 .06 5.37.06 11.97c0 2.1.55 4.15 1.58 5.97L0 24l6.24-1.64a11.92 11.92 0 0 0 5.79 1.48h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.2-3.49-8.39zM12.03 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.22-3.7.97.99-3.6-.23-.37a9.85 9.85 0 0 1-1.52-5.23C2.16 6.5 6.56 2.1 12.03 2.1c2.63 0 5.1 1.02 6.95 2.87a9.8 9.8 0 0 1 2.88 6.99c0 5.47-4.4 9.85-9.83 9.85zm5.4-7.35c-.3-.15-1.77-.87-2.05-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.37-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.2-.23-.56-.47-.49-.66-.5h-.56c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.49 1.72.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M9.78 15.47l-.4 5.64c.58 0 .83-.25 1.13-.55l2.7-2.58 5.6 4.1c1.03.57 1.75.27 2.03-.95l3.68-17.23h.01c.33-1.53-.55-2.13-1.56-1.75L1.36 10.48C-.1 11.05-.08 11.86 1.1 12.22l5.52 1.72L19.44 5.9c.6-.38 1.15-.17.7.2" />
    </svg>
  );
}

function PinterestLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.65 19.31c-.05-.82-.1-2.08.02-2.98l1.5-6.35s-.37-.74-.37-1.83c0-1.72 1-3 2.25-3 1.06 0 1.57.8 1.57 1.76 0 1.07-.68 2.67-1.03 4.16-.3 1.26.64 2.29 1.88 2.29 2.26 0 3.78-2.9 3.78-6.33 0-2.61-1.75-4.57-4.94-4.57-3.6 0-5.84 2.69-5.84 5.7 0 1.04.31 1.78.8 2.35.22.26.25.37.17.67-.06.22-.19.76-.25.97-.08.31-.33.42-.61.31-1.72-.7-2.52-2.57-2.52-4.67 0-3.47 2.94-7.63 8.73-7.63 4.65 0 7.7 3.36 7.7 6.96 0 4.76-2.65 8.32-6.56 8.32-1.31 0-2.55-.7-2.97-1.49l-.8 3.05c-.29 1.12-.86 2.5-1.3 3.35A10 10 0 1 0 12 2z" />
    </svg>
  );
}

function QuoraLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.74 0 3.38-.44 4.8-1.22l2.2 1.22-.63-2.94A9.95 9.95 0 0 0 22 12c0-5.52-4.48-10-10-10zm0 2.2c4.3 0 7.8 3.5 7.8 7.8 0 1.83-.64 3.51-1.7 4.84l-.44-2.07-2.14.45.67 3.12A7.77 7.77 0 0 1 12 19.8c-4.3 0-7.8-3.5-7.8-7.8S7.7 4.2 12 4.2zm0 2.4c-2.98 0-5.4 2.42-5.4 5.4s2.42 5.4 5.4 5.4 5.4-2.42 5.4-5.4-2.42-5.4-5.4-5.4zm0 2.2c1.76 0 3.2 1.44 3.2 3.2s-1.44 3.2-3.2 3.2-3.2-1.44-3.2-3.2 1.44-3.2 3.2-3.2z" />
    </svg>
  );
}

function baseButtonClass() {
  return "inline-flex items-center gap-1.5 rounded-full border border-[#d4cfc4] bg-[#fffdf9] px-3 py-1.5 text-sm font-semibold text-[#1c1a14] transition hover:border-[#e8672a] hover:text-[#c75322]";
}

export default function BlogShareButtons({ canonicalUrl, title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedShareUrl = encodeURIComponent(canonicalUrl);
  const encodedShareText = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`,
      Icon: XLogo,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      Icon: FacebookLogo,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
      Icon: LinkedinLogo,
    },
    {
      label: "Share on Reddit",
      href: `https://www.reddit.com/submit?url=${encodedShareUrl}&title=${encodedShareText}`,
      Icon: RedditLogo,
    },
    {
      label: "Share on Quora",
      href: `https://www.quora.com/share?url=${encodedShareUrl}&title=${encodedShareText}`,
      Icon: QuoraLogo,
    },
    {
      label: "Share on Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedShareUrl}&description=${encodedShareText}`,
      Icon: PinterestLogo,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedShareText}%20${encodedShareUrl}`,
      Icon: WhatsAppLogo,
    },
    {
      label: "Share on Telegram",
      href: `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedShareText}`,
      Icon: TelegramLogo,
    },
  ];

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (_err) {
      setCopied(false);
      window.open(canonicalUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {shareLinks.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseButtonClass()}
        >
          <Icon />
          {label}
        </a>
      ))}

      <button
        type="button"
        onClick={handleCopyLink}
        className={baseButtonClass()}
        aria-live="polite"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
