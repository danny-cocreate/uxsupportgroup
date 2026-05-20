export const SITE_TITLE = "UX Support Group";

/** Default meta description when a route has no specific copy. */
export const DEFAULT_DESCRIPTION =
  "UX Support Group — a professional UX community. Hands-on learning, events, and the AIxUX Summit.";

const SUMMIT_2026_DESCRIPTION =
  "2 half days. Real builds. For future-forward designers navigating the AI shift.";

/** Same-origin path for `og:image` when a route has no dedicated art. */
const DEFAULT_OG_IMAGE_PATH = "/uxsg-logo.svg";

const SUMMIT_2026_OG_IMAGE_PATH = "/summit-2026-og.png";

type PageMeta = { title: string; description?: string; ogImagePath?: string };

export type ResolvedPageMeta = {
  title: string;
  description: string;
  ogImagePath: string;
};

export function formatPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_TITLE}`;
}

function withDefaults(meta: PageMeta): ResolvedPageMeta {
  return {
    title: meta.title,
    description: meta.description ?? DEFAULT_DESCRIPTION,
    ogImagePath: meta.ogImagePath ?? DEFAULT_OG_IMAGE_PATH,
  };
}

/** Full `document.title` values (may already include `| SITE_TITLE`). */
const EXACT: Record<string, PageMeta> = {
  "/": {
    title: "UX Support Group | Professional UX Community & AIxUX Summit",
    description: DEFAULT_DESCRIPTION,
  },
  "/index-v1": { title: formatPageTitle("Home (Index v1)") },
  "/index-v2": { title: formatPageTitle("Home (Index v2)") },
  "/index-v3": { title: formatPageTitle("Home (Index v3)") },
  "/index-v4": { title: formatPageTitle("Home (Index v4)") },
  "/index-v5": { title: formatPageTitle("Home (Index v5)") },
  "/index-v6": { title: formatPageTitle("Home (Index v6)") },
  "/index-v7": { title: formatPageTitle("Home (Index v7)") },
  "/summit": {
    title: formatPageTitle("AIxUX Summit 2026: Agentic Designer"),
    description: SUMMIT_2026_DESCRIPTION,
    ogImagePath: SUMMIT_2026_OG_IMAGE_PATH,
  },
  "/summit-2025": { title: formatPageTitle("AIxUX Summit 2025") },
  "/about": {
    title: formatPageTitle("About UX Support Group"),
    description:
      "UXSG is a playground for curious UX and product designers — active exploration, permission to play, and human-first learning. Rooted in NYC, 9000+ members nationwide.",
  },
  "/contact": { title: formatPageTitle("Contact") },
  "/membership": { title: formatPageTitle("Membership") },
  "/sponsor": { title: formatPageTitle("Sponsor") },
  "/replay": { title: formatPageTitle("Replay") },
  "/partner": { title: formatPageTitle("Partner") },
  "/media-kit": { title: formatPageTitle("Media Kit") },
  "/summit-profiles": { title: formatPageTitle("Summit profiles") },
  "/summit-profiles/verify": { title: formatPageTitle("Verify profile") },
  "/admin": { title: formatPageTitle("Admin") },
  "/privacy": { title: formatPageTitle("Privacy Policy") },
  "/terms": { title: formatPageTitle("Terms of Service") },
  "/code-of-conduct": { title: formatPageTitle("Code of Conduct") },
};

const PROFILE_SLUG = /^\/summit-profiles\/([^/]+)$/;

export function getPageMeta(pathname: string): ResolvedPageMeta {
  const exact = EXACT[pathname];
  if (exact) return withDefaults(exact);

  const profileMatch = pathname.match(PROFILE_SLUG);
  if (profileMatch && profileMatch[1] !== "verify") {
    return withDefaults({ title: formatPageTitle("Summit profile") });
  }

  return withDefaults({ title: formatPageTitle("Page not found") });
}
