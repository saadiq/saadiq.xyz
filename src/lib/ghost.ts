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

const GHOST_URL = import.meta.env.GHOST_URL || "https://saadiq.xyz";
const GHOST_KEY = import.meta.env.GHOST_CONTENT_API_KEY;

export async function getRecentPosts(limit = 3): Promise<GhostPost[]> {
  const url = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&fields=id,title,slug,excerpt,published_at,reading_time`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ghost API error: ${res.status}`);
  const data: GhostResponse = await res.json();
  return data.posts;
}

export type { GhostPost };
