import { NextResponse } from 'next/server';
import { assertAdminApiAccess, getMergedRuntimeConfig } from '@/lib/system-runtime';

export async function GET() {
  const isAllowed = await assertAdminApiAccess();
  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { summary } = await getMergedRuntimeConfig();
  return NextResponse.json({ status: 'ok', summary });
}

