import { NextRequest } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(request: NextRequest) {
  const emailId = request.nextUrl.searchParams.get('id');
  const recipient = request.nextUrl.searchParams.get('e');

  if (emailId) {
    try {
      const sb = getServiceClient();
      await sb.from('email_opens').insert({
        email_id: emailId,
        recipient_email: recipient || 'unknown',
      });
    } catch {
      // Don't block pixel response on DB errors
    }
  }

  return new Response(PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
