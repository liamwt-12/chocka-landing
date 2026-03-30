import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, town, trade } = body;

    if (!email || !town) {
      return NextResponse.json(
        { error: 'Email and town are required' },
        { status: 400 }
      );
    }

    // Insert to newsletter_subscribers
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email, town, trade: trade || null },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error('DB error:', dbError);
    }

    // Subscribe via Buttondown API
    const buttondownKey = process.env.BUTTONDOWN_API_KEY;
    if (buttondownKey) {
      try {
        await fetch('https://api.buttondown.email/v1/subscribers', {
          method: 'POST',
          headers: {
            Authorization: `Token ${buttondownKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            metadata: { town, trade },
            tags: [town, trade].filter(Boolean),
          }),
        });
      } catch (err) {
        console.error('Buttondown error:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
