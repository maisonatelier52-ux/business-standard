import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, addSubscription, removeSubscription, isSubscribed } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        message: 'Only logged in users can subscribe. Please log in or sign up first.'
      }, { status: 401 });
    }

    let action = 'subscribe';
    try {
      const body = await req.json();
      if (body?.action) action = body.action;
    } catch {
      // Body might be empty or form-data
    }

    if (action === 'cancel' || action === 'unsubscribe') {
      removeSubscription(user.email);
      return NextResponse.json({
        success: true,
        message: 'Subscription cancelled successfully.',
        isSubscribed: false
      });
    }

    if (isSubscribed(user.email)) {
      return NextResponse.json({
        message: 'You are already subscribed to Business Standard newsletter.',
        isSubscribed: true
      }, { status: 409 });
    }

    addSubscription(user.email, user.id);

    return NextResponse.json({
      success: true,
      message: 'Subscription successful! Welcome to Business Standard newsletter.',
      isSubscribed: true
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json({ message: 'Server error processing subscription' }, { status: 500 });
  }
}
