export type BlogPhase = 1 | 2 | 3;

export type BlogLink = {
  label: string;
  href: `/${string}`;
};

export type BlogSection = {
  heading: string;
  paragraphs?: string[];
  steps?: string[];
  bullets?: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  phase: BlogPhase;
  cluster: string;
  targetKeywords: string[];
  hubToolPaths: Array<`/${string}`>;
  readMinutes: number;
  updatedAt: string;
  intro: string[];
  sections: BlogSection[];
  toolAnchors: BlogLink[];
  relatedPosts: string[];
  faq?: BlogFaq[];
};
