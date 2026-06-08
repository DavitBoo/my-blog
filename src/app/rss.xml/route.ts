import { fetchPosts } from '@/app/utils/api';
import { IPost } from '@/interfaces/Posts';
import { ILabel } from '@/interfaces/Label';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-blog-omega-pearl.vercel.app';
const SITE_TITLE = 'Diogenes Brain';
const SITE_DESCRIPTION = 'Blog personal de David';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts: IPost[] | null = await fetchPosts();

  const items = (posts ?? [])
    .map((post) => {
      const url = `${SITE_URL}/post/${post.slug}`;
      const description = post.content
        .replace(/<[^>]*>/g, '')
        .substring(0, 280)
        .trim();
      const categories = post.labels
        .map((l: ILabel) => `<category>${escapeXml(l.name)}</category>`)
        .join('');

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${description}...]]></description>
      ${categories}
      ${post.coverUrl ? `<enclosure url="${escapeXml(post.coverUrl)}" type="image/jpeg" length="0"/>` : ''}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
