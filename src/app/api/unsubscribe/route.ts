import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email || !email.includes('@')) {
    return NextResponse.redirect(new URL('/unsubscribe?status=invalid', request.url));
  }

  try {
    const sb = getServiceClient();
    await sb.from('email_suppressions').upsert(
      { email: email.toLowerCase() },
      { onConflict: 'email' }
    );
  } catch {
    return NextResponse.redirect(new URL('/unsubscribe?status=error', request.url));
  }

  return NextResponse.redirect(new URL('/unsubscribe?status=success', request.url));
}
