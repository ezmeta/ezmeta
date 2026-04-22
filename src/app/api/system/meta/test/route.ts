import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { assertAdminApiAccess, getMergedRuntimeConfig } from '@/lib/system-runtime';

export async function POST() {
  const isAllowed = await assertAdminApiAccess();
  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { raw } = await getMergedRuntimeConfig();
  if (!raw.meta_access_token) {
    return NextResponse.json({ error: 'Meta access token is not configured.' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      fields: 'id,name',
      access_token: raw.meta_access_token,
    });

    if (raw.meta_app_secret) {
      const proof = createHmac('sha256', raw.meta_app_secret)
        .update(raw.meta_access_token)
        .digest('hex');
      params.set('appsecret_proof', proof);
    }

    const res = await fetch(`https://graph.facebook.com/v21.0/me?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: 'Meta API request failed', details: data }, { status: 502 });
    }

    return NextResponse.json({ status: 'ok', account: { id: data?.id ?? '', name: data?.name ?? '' } });
  } catch (error) {
    return NextResponse.json(
      { error: 'Meta API test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

