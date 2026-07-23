import { NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://latinherald.com';
  const articles = getAllArticles();

  const urls = articles.map(art => `
  <url>
    <loc>${baseUrl}/${art.categorySlug}/${art.slug}</loc>
    <lastmod>${new Date(art.publishedDate || Date.now()).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
