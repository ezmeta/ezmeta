import { NextResponse } from 'next/server';
import { assertAdminApiAccess, getMergedRuntimeConfig } from '@/lib/system-runtime';

export async function POST(request: Request) {
  const isAllowed = await assertAdminApiAccess();
  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { raw } = await getMergedRuntimeConfig();
  if (!raw.telegram_bot_token || !raw.telegram_chat_id) {
    return NextResponse.json({ error: 'Telegram bot token/chat id is not configured.' }, { status: 400 });
  }

  let message = '✅ EZ Meta Telegram integration test successful.';
  try {
    const body = await request.json();
    if (typeof body?.message === 'string' && body.message.trim().length > 0) {
      message = body.message.trim();
    }
  } catch {
    // fallback message
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${raw.telegram_bot_token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: raw.telegram_chat_id,
        text: message,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) {
      return NextResponse.json({ error: 'Telegram API request failed', details: data }, { status: 502 });
    }

    return NextResponse.json({
      status: 'ok',
      message_id: data?.result?.message_id ?? null,
      chat_id: data?.result?.chat?.id ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Telegram API test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

