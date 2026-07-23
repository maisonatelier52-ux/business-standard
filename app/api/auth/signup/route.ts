import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const result = registerUser(username, email, password);

    if (result.error || !result.user) {
      return NextResponse.json({ message: result.error || 'Failed to register' }, { status: 400 });
    }

    // Create session and set cookie
    await createSession(result.user);

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error during signup' }, { status: 500 });
  }
}
