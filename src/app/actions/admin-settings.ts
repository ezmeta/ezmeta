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

export type FaqItem = {
  id: string;
  question_bm: string;
  answer_bm: string;
  question_en: string;
  answer_en: string;
  sort_order: number;
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

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'default-1',
    question_bm: 'Adakah token API Meta saya selamat?',
    answer_bm: 'Ya. Token anda disimpan secara selamat dan hanya digunakan untuk sinkronisasi data iklan yang dibenarkan.',
    question_en: 'Is my Meta API token secure?',
    answer_en: 'Yes. Your token is stored securely and used only for authorized ad-data synchronization.',
    sort_order: 1,
  },
  {
    id: 'default-2',
    question_bm: 'Bagaimana polisi bayaran langganan?',
    answer_bm: 'Langganan dikenakan secara bulanan. Anda boleh naik taraf, turun taraf, atau batalkan mengikut kitaran semasa.',
    question_en: 'How does subscription billing work?',
    answer_en: 'Subscriptions are billed monthly. You can upgrade, downgrade, or cancel based on your current billing cycle.',
    sort_order: 2,
  },
  {
    id: 'default-3',
    question_bm: 'Adakah AI benar-benar membantu ROI?',
    answer_bm: 'AI membantu mengenal pasti iklan berprestasi rendah, mengesan creative fatigue, dan mencadangkan tindakan untuk meningkatkan ROI.',
    question_en: 'Can AI really improve ROI?',
    answer_en: 'AI helps identify underperforming ads, detect creative fatigue, and recommend actions to improve ROI.',
    sort_order: 3,
  },
];

const SUPABASE_QUERY_TIMEOUT_MS = 2500;

function timeoutController(ms: number = SUPABASE_QUERY_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController();
    const { data, error } = await (supabase as any)
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true })
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('FAQ fetch failed; using fallback FAQs.');
      }
      return DEFAULT_FAQS;
    }

    return data as FaqItem[];
  } catch (error) {
    console.warn('FAQ fetch timeout/error; using fallback FAQs.');
    return DEFAULT_FAQS;
  }
}

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

    const timeout = timeoutController();
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
      ])
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error || !data) {
      if (error) {
        console.warn('Site settings fetch failed; using fallback settings.');
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
    console.warn('Site settings fetch timeout/error; using fallback settings.');
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
    const faqs_payload = String(formData.get('faqs_payload') || '');

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

    const parsedFaqs = faqs_payload
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [question_bm, answer_bm, question_en, answer_en] = line.split('||').map((part) => part?.trim() || '');
        return {
          question_bm,
          answer_bm,
          question_en,
          answer_en,
          sort_order: index + 1,
        };
      })
      .filter((item) => item.question_bm && item.answer_bm && item.question_en && item.answer_en);

    const upsertTimeout = timeoutController(4000);
    const { error } = await (supabase as any)
      .from('site_settings')
      .upsert(payload, { onConflict: 'key' })
      .abortSignal(upsertTimeout.signal);
    upsertTimeout.clear();

    if (error) {
      console.error('Error saving site settings:', error);
      redirect('/admin/settings?status=error');
    }

    const deleteTimeout = timeoutController(4000);
    const { error: deleteFaqError } = await (supabase as any)
      .from('faqs')
      .delete()
      .gte('sort_order', 0)
      .abortSignal(deleteTimeout.signal);
    deleteTimeout.clear();
    if (deleteFaqError) {
      console.error('Error clearing FAQs:', deleteFaqError);
      redirect('/admin/settings?status=error');
    }

    if (parsedFaqs.length > 0) {
      const insertTimeout = timeoutController(4000);
      const { error: insertFaqError } = await (supabase as any)
        .from('faqs')
        .insert(parsedFaqs)
        .abortSignal(insertTimeout.signal);
      insertTimeout.clear();
      if (insertFaqError) {
        console.error('Error saving FAQs:', insertFaqError);
        redirect('/admin/settings?status=error');
      }
    }

    revalidatePath('/');
    revalidatePath('/pricing');
    revalidatePath('/admin/settings');
    redirect('/admin/settings?status=saved');
  } catch (error) {
    console.error('Unexpected error saving settings:', error);
    redirect('/admin/settings?status=error');
  }
}
