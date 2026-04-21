'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { supabaseConfig } from '@/config/env';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export type SiteSettingsMap = {
  hero_headline_bm: string;
  hero_headline_en: string;
  hero_subheadline_bm: string;
  hero_subheadline_en: string;
  pricing_starter_price: number;
  pricing_pro_price: number;
  pricing_agency_price: number;
  pricing_starter_benefits_bm: string[];
  pricing_starter_benefits_en: string[];
  pricing_pro_benefits_bm: string[];
  pricing_pro_benefits_en: string[];
  pricing_agency_benefits_bm: string[];
  pricing_agency_benefits_en: string[];
  contact_whatsapp: string;
  alert_banner_text_bm: string;
  alert_banner_text_en: string;
};

const DEFAULT_SETTINGS: SiteSettingsMap = {
  hero_headline_bm: 'Hentikan Pembaziran Bajet Iklan. Biar AI Optimumkan Meta Ads Anda.',
  hero_headline_en: 'Stop Wasting Ad Spend. Let AI Optimize Your Meta Ads.',
  hero_subheadline_bm: 'EZ Meta menganalisis prestasi iklan dan menjana creative untuk tingkatkan ROI anda.',
  hero_subheadline_en: 'EZ Meta analyzes ad performance and generates creatives that improve ROI.',
  pricing_starter_price: 49,
  pricing_pro_price: 99,
  pricing_agency_price: 199,
  pricing_starter_benefits_bm: [
    '1 Ad Account',
    'Dashboard Live (Real-time metrics)',
    'Telegram Alerts (Notifikasi harian)',
    'Laporan BM Harian',
    'AI Recommendations (Asas)',
  ],
  pricing_starter_benefits_en: [
    '1 Ad Account',
    'Live Dashboard (Real-time metrics)',
    'Telegram Alerts (Daily notifications)',
    'Daily BM Report',
    'AI Recommendations (Basic)',
  ],
  pricing_pro_benefits_bm: [
    '3 Ad Accounts',
    'Dashboard Live (Real-time metrics)',
    'Telegram Alerts (Notifikasi harian)',
    'Laporan BM Harian',
    'AI Recommendations (Asas)',
    'Winning Ad Detector',
    'Creative Fatigue Detector',
    'Budget Tracker & Optimization',
    'Campaign Health Score (Gred A–D)',
    'Weekly Report (Automatik setiap Ahad)',
  ],
  pricing_pro_benefits_en: [
    '3 Ad Accounts',
    'Live Dashboard (Real-time metrics)',
    'Telegram Alerts (Daily notifications)',
    'Daily BM Report',
    'AI Recommendations (Basic)',
    'Winning Ad Detector',
    'Creative Fatigue Detector',
    'Budget Tracker & Optimization',
    'Campaign Health Score (A–D)',
    'Weekly Report (Automated every Sunday)',
  ],
  pricing_agency_benefits_bm: [
    'Unlimited Ad Accounts',
    'Dashboard Live (Real-time metrics)',
    'Telegram Alerts (Notifikasi harian)',
    'Laporan BM Harian',
    'AI Recommendations (Asas)',
    'Winning Ad Detector',
    'Creative Fatigue Detector',
    'Budget Tracker & Optimization',
    'Campaign Health Score (Gred A–D)',
    'Weekly Report (Automatik setiap Ahad)',
    'Multi-client Dashboard',
    'AI Copywriter BM',
    '1-Click Optimization',
    'Priority Support',
    'Custom Branding',
  ],
  pricing_agency_benefits_en: [
    'Unlimited Ad Accounts',
    'Live Dashboard (Real-time metrics)',
    'Telegram Alerts (Daily notifications)',
    'Daily BM Report',
    'AI Recommendations (Basic)',
    'Winning Ad Detector',
    'Creative Fatigue Detector',
    'Budget Tracker & Optimization',
    'Campaign Health Score (A–D)',
    'Weekly Report (Automated every Sunday)',
    'Multi-client Dashboard',
    'AI Copywriter BM',
    '1-Click Optimization',
    'Priority Support',
    'Custom Branding',
  ],
  contact_whatsapp: '+60123456789',
  alert_banner_text_bm: '🚀 Baharu: AI Creative Studio kini menyokong penjanaan skrip video.',
  alert_banner_text_en: '🚀 New: AI Creative Studio now supports video script generation.',
};

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'hero_headline_bm',
        'hero_headline_en',
        'hero_subheadline_bm',
        'hero_subheadline_en',
        'pricing_starter_price',
        'pricing_pro_price',
        'pricing_agency_price',
        'pricing_starter_benefits_bm',
        'pricing_starter_benefits_en',
        'pricing_pro_benefits_bm',
        'pricing_pro_benefits_en',
        'pricing_agency_benefits_bm',
        'pricing_agency_benefits_en',
        'contact_whatsapp',
        'alert_banner_text_bm',
        'alert_banner_text_en',
      ]);

    if (error || !data) {
      if (error) {
        console.error('Error fetching site settings:', error);
      }
      return DEFAULT_SETTINGS;
    }

    const mapped = { ...DEFAULT_SETTINGS };
    for (const row of data as Array<{ key: string; value: any }>) {
      if (row.key === 'pricing_starter_price') {
        mapped.pricing_starter_price = Number(row.value?.amount ?? DEFAULT_SETTINGS.pricing_starter_price);
      } else if (row.key === 'pricing_pro_price') {
        mapped.pricing_pro_price = Number(row.value?.amount ?? DEFAULT_SETTINGS.pricing_pro_price);
      } else if (row.key === 'pricing_agency_price') {
        mapped.pricing_agency_price = Number(row.value?.amount ?? DEFAULT_SETTINGS.pricing_agency_price);
      } else if (row.key === 'pricing_starter_benefits_bm') {
        mapped.pricing_starter_benefits_bm = Array.isArray(row.value?.items)
          ? (row.value.items as string[])
          : DEFAULT_SETTINGS.pricing_starter_benefits_bm;
      } else if (row.key === 'pricing_starter_benefits_en') {
        mapped.pricing_starter_benefits_en = Array.isArray(row.value?.items)
          ? (row.value.items as string[])
          : DEFAULT_SETTINGS.pricing_starter_benefits_en;
      } else if (row.key === 'pricing_pro_benefits_bm') {
        mapped.pricing_pro_benefits_bm = Array.isArray(row.value?.items)
          ? (row.value.items as string[])
          : DEFAULT_SETTINGS.pricing_pro_benefits_bm;
      } else if (row.key === 'pricing_pro_benefits_en') {
        mapped.pricing_pro_benefits_en = Array.isArray(row.value?.items)
          ? (row.value.items as string[])
          : DEFAULT_SETTINGS.pricing_pro_benefits_en;
      } else if (row.key === 'pricing_agency_benefits_bm') {
        mapped.pricing_agency_benefits_bm = Array.isArray(row.value?.items)
          ? (row.value.items as string[])
          : DEFAULT_SETTINGS.pricing_agency_benefits_bm;
      } else if (row.key === 'pricing_agency_benefits_en') {
        mapped.pricing_agency_benefits_en = Array.isArray(row.value?.items)
          ? (row.value.items as string[])
          : DEFAULT_SETTINGS.pricing_agency_benefits_en;
      } else if (row.key === 'contact_whatsapp') {
        mapped.contact_whatsapp = String(row.value?.number ?? DEFAULT_SETTINGS.contact_whatsapp);
      } else if (row.key in mapped) {
        const v = row.value?.text;
        if (typeof v === 'string' && v.trim().length > 0) {
          (mapped as any)[row.key] = v;
        }
      }
    }

    return mapped;
  } catch (error) {
    console.error('Unexpected error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function verifyAdminAccess(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function unlockAdmin(formData: FormData): Promise<void> {
  const password = String(formData.get('admin_password') || '');
  if (!(await verifyAdminAccess(password))) {
    console.error('Invalid admin password');
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  redirect('/admin/settings');
}

export async function saveSiteSettings(formData: FormData): Promise<void> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      console.error('Unauthorized attempt to save settings');
      return;
    }

    const hero_headline_bm = String(formData.get('hero_headline_bm') || DEFAULT_SETTINGS.hero_headline_bm);
    const hero_headline_en = String(formData.get('hero_headline_en') || DEFAULT_SETTINGS.hero_headline_en);
    const hero_subheadline_bm = String(formData.get('hero_subheadline_bm') || DEFAULT_SETTINGS.hero_subheadline_bm);
    const hero_subheadline_en = String(formData.get('hero_subheadline_en') || DEFAULT_SETTINGS.hero_subheadline_en);
    const pricing_starter_price = Number(formData.get('pricing_starter_price') || DEFAULT_SETTINGS.pricing_starter_price);
    const pricing_pro_price = Number(formData.get('pricing_pro_price') || DEFAULT_SETTINGS.pricing_pro_price);
    const pricing_agency_price = Number(formData.get('pricing_agency_price') || DEFAULT_SETTINGS.pricing_agency_price);
    const pricing_starter_benefits_bm = String(formData.get('pricing_starter_benefits_bm') || DEFAULT_SETTINGS.pricing_starter_benefits_bm.join('\n'));
    const pricing_starter_benefits_en = String(formData.get('pricing_starter_benefits_en') || DEFAULT_SETTINGS.pricing_starter_benefits_en.join('\n'));
    const pricing_pro_benefits_bm = String(formData.get('pricing_pro_benefits_bm') || DEFAULT_SETTINGS.pricing_pro_benefits_bm.join('\n'));
    const pricing_pro_benefits_en = String(formData.get('pricing_pro_benefits_en') || DEFAULT_SETTINGS.pricing_pro_benefits_en.join('\n'));
    const pricing_agency_benefits_bm = String(formData.get('pricing_agency_benefits_bm') || DEFAULT_SETTINGS.pricing_agency_benefits_bm.join('\n'));
    const pricing_agency_benefits_en = String(formData.get('pricing_agency_benefits_en') || DEFAULT_SETTINGS.pricing_agency_benefits_en.join('\n'));
    const contact_whatsapp = String(formData.get('contact_whatsapp') || DEFAULT_SETTINGS.contact_whatsapp);
    const alert_banner_text_bm = String(formData.get('alert_banner_text_bm') || DEFAULT_SETTINGS.alert_banner_text_bm);
    const alert_banner_text_en = String(formData.get('alert_banner_text_en') || DEFAULT_SETTINGS.alert_banner_text_en);

    const toBenefitsArray = (value: string): string[] =>
      value
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const payload = [
      { key: 'hero_headline_bm', value: { text: hero_headline_bm } },
      { key: 'hero_headline_en', value: { text: hero_headline_en } },
      { key: 'hero_subheadline_bm', value: { text: hero_subheadline_bm } },
      { key: 'hero_subheadline_en', value: { text: hero_subheadline_en } },
      { key: 'pricing_starter_price', value: { amount: pricing_starter_price, currency: 'RM', interval: 'month' } },
      { key: 'pricing_pro_price', value: { amount: pricing_pro_price, currency: 'RM', interval: 'month' } },
      { key: 'pricing_agency_price', value: { amount: pricing_agency_price, currency: 'RM', interval: 'month' } },
      { key: 'pricing_starter_benefits_bm', value: { items: toBenefitsArray(pricing_starter_benefits_bm) } },
      { key: 'pricing_starter_benefits_en', value: { items: toBenefitsArray(pricing_starter_benefits_en) } },
      { key: 'pricing_pro_benefits_bm', value: { items: toBenefitsArray(pricing_pro_benefits_bm) } },
      { key: 'pricing_pro_benefits_en', value: { items: toBenefitsArray(pricing_pro_benefits_en) } },
      { key: 'pricing_agency_benefits_bm', value: { items: toBenefitsArray(pricing_agency_benefits_bm) } },
      { key: 'pricing_agency_benefits_en', value: { items: toBenefitsArray(pricing_agency_benefits_en) } },
      { key: 'contact_whatsapp', value: { number: contact_whatsapp, label: 'WhatsApp Support' } },
      { key: 'alert_banner_text_bm', value: { text: alert_banner_text_bm } },
      { key: 'alert_banner_text_en', value: { text: alert_banner_text_en } },
    ];

    const { error } = await (supabase as any).from('site_settings').upsert(payload, { onConflict: 'key' });

    if (error) {
      console.error('Error saving site settings:', error);
      return;
    }

    revalidatePath('/');
    revalidatePath('/admin/settings');
  } catch (error) {
    console.error('Unexpected error saving settings:', error);
  }
}
