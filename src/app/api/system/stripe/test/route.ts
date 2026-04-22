import { NextResponse } from 'next/server';
import { assertAdminApiAccess, getMergedRuntimeConfig } from '@/lib/system-runtime';

export async function POST() {
  const isAllowed = await assertAdminApiAccess();
  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { raw } = await getMergedRuntimeConfig();
  if (!raw.stripe_secret_key) {
    return NextResponse.json({ error: 'Stripe secret key is not configured.' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.stripe.com/v1/account', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${raw.stripe_secret_key}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: 'Stripe API request failed', details: data }, { status: 502 });
    }

    return NextResponse.json({
      status: 'ok',
      account: {
        id: data?.id ?? '',
        email: data?.email ?? '',
        charges_enabled: Boolean(data?.charges_enabled),
        payouts_enabled: Boolean(data?.payouts_enabled),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Stripe API test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

