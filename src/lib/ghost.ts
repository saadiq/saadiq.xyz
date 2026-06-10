interface GhostPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_time: number;
}

interface GhostResponse {
  posts: GhostPost[];
}

const GHOST_URL = import.meta.env.GHOST_URL || "https://saadiq.xyz/newsletter";
const GHOST_KEY = import.meta.env.GHOST_CONTENT_API_KEY;

// Fail the build rather than silently shipping a page with no newsletter
// section and a broken client-side key (bit us 2026-06-10 when CI built
// without the secret).
if (!GHOST_KEY) {
  throw new Error(
    "GHOST_CONTENT_API_KEY is not set. Add it to .env locally or as a GitHub Actions secret in CI.",
  );
}

// Content API keys are read-only and public by design — safe to ship to the client.
// `html` must be requested even though we never render it: Ghost computes
// reading_time from it and omits reading_time when html is filtered out.
export function contentApiUrl(limit = 3): string {
  return `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&fields=id,title,slug,excerpt,published_at,reading_time,html`;
}

export async function getRecentPosts(limit = 3): Promise<GhostPost[]> {
  const res = await fetch(contentApiUrl(limit));
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data: GhostResponse = await res.json();
  return data.posts;
}

export type { GhostPost };
