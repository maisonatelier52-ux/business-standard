import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Username/Email and password are required' }, { status: 400 });
    }

    const user = verifyUser(identifier, password);

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials. Please check your username/email and password.' }, { status: 401 });
    }

    // Create session and set cookie
    await createSession(user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error during login' }, { status: 500 });
  }
}
