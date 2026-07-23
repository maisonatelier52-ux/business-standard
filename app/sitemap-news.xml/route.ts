import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://latinherald.com';
  const articles = getAllArticles().slice(0, 10);

  const urls = articles.map(art => `
  <url>
    <loc>${baseUrl}/${art.categorySlug}/${art.slug}</loc>
    <news:news xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      <news:publication>
        <news:name>Business Standard</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${new Date(art.publishedDate || Date.now()).toISOString()}</news:publication_date>
      <news:title><![CDATA[${art.title}]]></news:title>
    </news:news>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
