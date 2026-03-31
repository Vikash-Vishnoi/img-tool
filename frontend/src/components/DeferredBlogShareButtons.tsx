"use client";

import dynamic from "next/dynamic";
import DeferredOnVisible from "@/components/DeferredOnVisible";

const BlogShareButtons = dynamic(() => import("@/components/BlogShareButtons"), {
  ssr: false,
});

export type DeferredBlogShareButtonsProps = {
  canonicalUrl: string;
  title: string;
};

export default function DeferredBlogShareButtons({
  canonicalUrl,
  title,
}: DeferredBlogShareButtonsProps) {
  return (
    <DeferredOnVisible rootMargin="180px 0px" placeholderMinHeight={46}>
      <BlogShareButtons canonicalUrl={canonicalUrl} title={title} />
    </DeferredOnVisible>
  );
}
