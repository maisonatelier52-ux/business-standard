import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://latinherald.com';
  const pages = ['', '/about', '/our-team', '/privacy-policy', '/terms-and-conditions'];

  const urls = pages.map(p => `
  <url>
    <loc>${baseUrl}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
