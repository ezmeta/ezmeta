import { NextResponse } from 'next/server';
import { assertAdminApiAccess, getMergedRuntimeConfig } from '@/lib/system-runtime';

export async function POST(request: Request) {
  const isAllowed = await assertAdminApiAccess();
  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { raw } = await getMergedRuntimeConfig();
  if (!raw.tools_webhook_url) {
    return NextResponse.json({ error: 'Tools webhook URL is not configured.' }, { status: 400 });
  }

  let payload: Record<string, unknown> = {
    event: 'ezmeta.system.test',
    source: 'admin-system-panel',
    timestamp: new Date().toISOString(),
  };

  try {
    const body = await request.json();
    if (body && typeof body === 'object') {
      payload = { ...payload, ...(body as Record<string, unknown>) };
    }
  } catch {
    // keep default payload
  }

  try {
    const res = await fetch(raw.tools_webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    return NextResponse.json(
      {
        status: res.ok ? 'ok' : 'error',
        upstream_status: res.status,
        response_preview: text.slice(0, 600),
      },
      { status: res.ok ? 200 : 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Tools webhook test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

