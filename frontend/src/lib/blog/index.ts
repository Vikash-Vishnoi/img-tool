import type { BlogPhase, BlogPost } from "./types";
import { post as post_how_to_convert_image_to_pdf } from "./how-to-convert-image-to-pdf";
import { post as post_how_to_compress_image_under_200kb } from "./how-to-compress-image-under-200kb";
import { post as post_compress_image_for_government_form } from "./compress-image-for-government-form";
import { post as post_what_is_heic_file_how_to_open } from "./what-is-heic-file-how-to-open";
import { post as post_how_to_convert_iphone_photos_to_jpg } from "./how-to-convert-iphone-photos-to-jpg";
import { post as post_passport_photo_size_requirements_india } from "./passport-photo-size-requirements-india";
import { post as post_aadhaar_photo_size_requirements } from "./aadhaar-photo-size-requirements";
import { post as post_image_to_pdf_without_losing_quality } from "./image-to-pdf-without-losing-quality";
import { post as post_convert_multiple_images_to_pdf } from "./convert-multiple-images-to-pdf";
import { post as post_reduce_image_size_without_losing_quality } from "./reduce-image-size-without-losing-quality";
import { post as post_compress_image_for_whatsapp } from "./compress-image-for-whatsapp";
import { post as post_heic_vs_jpg_difference } from "./heic-vs-jpg-difference";
import { post as post_resize_photo_for_online_application } from "./resize-photo-for-online-application";
import { post as post_jpg_vs_png_which_is_better } from "./jpg-vs-png-which-is-better";
import { post as post_best_image_format_for_website } from "./best-image-format-for-website";
import { post as post_jpg_vs_pdf_which_is_better } from "./jpg-vs-pdf-which-is-better";
import { post as post_avif_vs_webp_vs_jpg_comparison } from "./avif-vs-webp-vs-jpg-comparison";

export type { BlogFaq, BlogLink, BlogPhase, BlogPost, BlogProfile, BlogSection } from "./types";

export const BLOG_PHASE_LABELS: Record<BlogPhase, string> = {
  1: "Phase 1 - Highest intent and fastest wins",
  2: "Phase 2 - Supporting commercial and evergreen intent",
  3: "Phase 3 - Authority and comparison coverage",
};

export const BLOG_PHASES: readonly BlogPhase[] = [1, 2, 3] as const;

// Duplicate-intent variants like HEIF/HEIC and JPEG/JPG are intentionally collapsed
// into one canonical post per intent to avoid keyword cannibalization.
export const BLOG_POSTS: readonly BlogPost[] = [
  post_how_to_convert_image_to_pdf,
  post_how_to_compress_image_under_200kb,
  post_compress_image_for_government_form,
  post_what_is_heic_file_how_to_open,
  post_how_to_convert_iphone_photos_to_jpg,
  post_passport_photo_size_requirements_india,
  post_aadhaar_photo_size_requirements,
  post_image_to_pdf_without_losing_quality,
  post_convert_multiple_images_to_pdf,
  post_reduce_image_size_without_losing_quality,
  post_compress_image_for_whatsapp,
  post_heic_vs_jpg_difference,
  post_resize_photo_for_online_application,
  post_jpg_vs_png_which_is_better,
  post_best_image_format_for_website,
  post_jpg_vs_pdf_which_is_better,
  post_avif_vs_webp_vs_jpg_comparison,
] as const;

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostsByPhase(phase: BlogPhase): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.phase === phase);
}
