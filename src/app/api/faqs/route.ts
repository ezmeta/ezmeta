import { NextResponse } from 'next/server';
import { getFaqs } from '@/app/actions/admin-settings';

export async function GET() {
  const faqs = await getFaqs();
  return NextResponse.json(faqs);
}

