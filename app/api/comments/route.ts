import { NextRequest, NextResponse } from 'next/server';
import { getComments, addComment } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleSlug = searchParams.get('slug');

  if (!articleSlug) {
    return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
  }

  const comments = getComments(articleSlug);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Only logged in users can post comments. Please log in or sign up first.' }, { status: 401 });
    }

    const body = await request.json();
    const { articleSlug, content } = body;

    if (!articleSlug || !content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    const comment = addComment(articleSlug, user.username, user.email, content.trim());
    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Comments API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
