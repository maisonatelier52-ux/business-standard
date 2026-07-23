import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://latinherald.com';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-news.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-articles.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-authors.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
