import { NextResponse } from 'next/server';
import { getAllAuthors } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://latinherald.com';
  const authors = getAllAuthors();

  const urls = authors.map(auth => `
  <url>
    <loc>${baseUrl}/author/${auth.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
