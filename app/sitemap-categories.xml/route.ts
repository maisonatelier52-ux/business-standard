import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://latinherald.com';
  const categories = getAllCategories();

  const urls = categories.map(cat => `
  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
