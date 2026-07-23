import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') === 'en' ? 'en' : 'es';
  
  const redirectUrl = request.headers.get('referer') || '/';
  const response = NextResponse.redirect(redirectUrl);
  
  response.cookies.set('app_lang', lang, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'lax'
  });

  return response;
}
