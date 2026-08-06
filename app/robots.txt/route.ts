import { NextResponse } from 'next/server';

export async function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://www.financial-journal.xyz/sitemap.xml`;

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
