import { NextResponse } from 'next/server';
import { assertAdminApiAccess, getMergedRuntimeConfig } from '@/lib/system-runtime';

export async function POST(request: Request) {
  const isAllowed = await assertAdminApiAccess();
  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { raw } = await getMergedRuntimeConfig();
  if (!raw.openrouter_api_key) {
    return NextResponse.json({ error: 'OpenRouter API key is not configured.' }, { status: 400 });
  }

  let prompt = 'Reply with: EZ Meta OpenRouter test successful.';
  try {
    const body = await request.json();
    if (typeof body?.prompt === 'string' && body.prompt.trim().length > 0) {
      prompt = body.prompt.trim();
    }
  } catch {
    // fallback prompt
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${raw.openrouter_api_key}`,
      },
      body: JSON.stringify({
        model: raw.openrouter_model || 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 180,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: 'OpenRouter request failed', details: data }, { status: 502 });
    }

    const output = data?.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ status: 'ok', model: raw.openrouter_model, output });
  } catch (error) {
    return NextResponse.json(
      { error: 'OpenRouter test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

