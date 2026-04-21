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
  starter_name_bm: string;
  starter_name_en: string;
  pro_name_bm: string;
  pro_name_en: string;
  agency_name_bm: string;
  agency_name_en: string;
  starter_desc_bm: string;
  starter_desc_en: string;
  pro_desc_bm: string;
  pro_desc_en: string;
  agency_desc_bm: string;
  agency_desc_en: string;
  starter_bonus_accounts: number;
  pro_bonus_accounts: number;
  agency_bonus_accounts: number;
  ticker_items_bm: string[];
  ticker_items_en: string[];
  popup_enabled: boolean;
  popup_headline_bm: string;
  popup_headline_en: string;
  popup_description_bm: string;
  popup_description_en: string;
  popup_button_text_bm: string;
  popup_button_text_en: string;
  popup_redirect_url: string;
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
    '2 Ad Accounts',
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
  pricing_starter_benefits_en: [
    '2 Ad Accounts',
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
  pricing_pro_benefits_bm: [
    '5 Ad Accounts',
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
  pricing_pro_benefits_en: [
    '5 Ad Accounts',
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
  pricing_agency_benefits_bm: [
    '10 Ad Accounts',
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
    '10 Ad Accounts',
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
  starter_name_bm: 'Starter',
  starter_name_en: 'Starter',
  pro_name_bm: 'Pro',
  pro_name_en: 'Pro',
  agency_name_bm: 'Agency',
  agency_name_en: 'Agency',
  starter_desc_bm: 'Untuk individu & pemula yang nak start monitor ads dengan betul.',
  starter_desc_en: 'For individuals and beginners who want to start monitoring ads properly.',
  pro_desc_bm: 'Untuk dropshipper & e-commerce yang nak automate semua.',
  pro_desc_en: 'For dropshippers and e-commerce teams who want to automate everything.',
  agency_desc_bm: 'Untuk agency & freelancer yang manage banyak client sekaligus.',
  agency_desc_en: 'For agencies and freelancers managing many clients at once.',
  starter_bonus_accounts: 1,
  pro_bonus_accounts: 2,
  agency_bonus_accounts: 3,
  ticker_items_bm: ['AI TELEGRAM ALERTS', 'WINNING AD DETECTOR', 'CREATIVE FATIGUE MONITOR', 'BUDGET TRACKER'],
  ticker_items_en: ['AI TELEGRAM ALERTS', 'WINNING AD DETECTOR', 'CREATIVE FATIGUE MONITOR', 'BUDGET TRACKER'],
  popup_enabled: false,
  popup_headline_bm: 'Tawaran Terhad EZ Meta',
  popup_headline_en: 'Limited EZ Meta Offer',
  popup_description_bm: 'Aktifkan automasi iklan anda hari ini dan dapatkan akses bonus.',
  popup_description_en: 'Activate your ad automation today and unlock bonus access.',
  popup_button_text_bm: 'Aktifkan Sekarang',
  popup_button_text_en: 'Activate Now',
  popup_redirect_url: '/pricing',
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

function parseFaqPayload(raw: string): FaqItem[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [question_bm, answer_bm, question_en, answer_en] = line.split('||').map((part) => part?.trim() || '');
      return {
        id: `payload-${index + 1}`,
        question_bm,
        answer_bm,
        question_en,
        answer_en,
        sort_order: index + 1,
      };
    })
    .filter((item) => item.question_bm && item.answer_bm && item.question_en && item.answer_en);
}

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

    if (!error && data && data.length > 0) {
      return data as FaqItem[];
    }

    // Fallback source: faqs_payload in site_settings (for environments where faqs table read may be restricted)
    const settingsTimeout = timeoutController();
    const { data: settingsData } = await (supabase as any)
      .from('site_settings')
      .select('value')
      .eq('key', 'faqs_payload')
      .maybeSingle()
      .abortSignal(settingsTimeout.signal);
    settingsTimeout.clear();

    const payloadItems = Array.isArray((settingsData as any)?.value?.items) ? ((settingsData as any).value.items as Array<any>) : [];
    const parsedFromSettings = payloadItems
      .map((item, index) => ({
        id: String(item?.id ?? `settings-${index + 1}`),
        question_bm: String(item?.question_bm ?? '').trim(),
        answer_bm: String(item?.answer_bm ?? '').trim(),
        question_en: String(item?.question_en ?? '').trim(),
        answer_en: String(item?.answer_en ?? '').trim(),
        sort_order: Number(item?.sort_order ?? index + 1),
      }))
      .filter((item) => item.question_bm && item.answer_bm && item.question_en && item.answer_en)
      .sort((a, b) => a.sort_order - b.sort_order);

    if (parsedFromSettings.length > 0) {
      return parsedFromSettings;
    }

    if (error) {
      console.warn('FAQ fetch failed; using fallback FAQs.');
    }
    return DEFAULT_FAQS;
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
        'starter_name_bm',
        'starter_name_en',
        'pro_name_bm',
        'pro_name_en',
        'agency_name_bm',
        'agency_name_en',
        'starter_desc_bm',
        'starter_desc_en',
        'pro_desc_bm',
        'pro_desc_en',
        'agency_desc_bm',
        'agency_desc_en',
        'starter_bonus_accounts',
        'pro_bonus_accounts',
        'agency_bonus_accounts',
        'ticker_items_bm',
        'ticker_items_en',
        'popup_enabled',
        'popup_headline_bm',
        'popup_headline_en',
        'popup_description_bm',
        'popup_description_en',
        'popup_button_text_bm',
        'popup_button_text_en',
        'popup_redirect_url',
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
      } else if (row.key === 'starter_bonus_accounts') {
        mapped.starter_bonus_accounts = Number(row.value?.count ?? DEFAULT_SETTINGS.starter_bonus_accounts);
      } else if (row.key === 'pro_bonus_accounts') {
        mapped.pro_bonus_accounts = Number(row.value?.count ?? DEFAULT_SETTINGS.pro_bonus_accounts);
      } else if (row.key === 'agency_bonus_accounts') {
        mapped.agency_bonus_accounts = Number(row.value?.count ?? DEFAULT_SETTINGS.agency_bonus_accounts);
      } else if (row.key === 'ticker_items_bm') {
        mapped.ticker_items_bm = Array.isArray(row.value?.items) ? (row.value.items as string[]) : DEFAULT_SETTINGS.ticker_items_bm;
      } else if (row.key === 'ticker_items_en') {
        mapped.ticker_items_en = Array.isArray(row.value?.items) ? (row.value.items as string[]) : DEFAULT_SETTINGS.ticker_items_en;
      } else if (row.key === 'popup_enabled') {
        mapped.popup_enabled = Boolean(row.value?.enabled ?? DEFAULT_SETTINGS.popup_enabled);
      } else if (row.key in mapped) {
        const currentDefault = (mapped as any)[row.key];
        if (typeof currentDefault === 'string') {
          const v = row.value?.text;
          if (typeof v === 'string' && v.trim().length > 0) {
            (mapped as any)[row.key] = v;
          }
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
    const starter_name_bm = String(formData.get('starter_name_bm') || DEFAULT_SETTINGS.starter_name_bm);
    const starter_name_en = String(formData.get('starter_name_en') || DEFAULT_SETTINGS.starter_name_en);
    const pro_name_bm = String(formData.get('pro_name_bm') || DEFAULT_SETTINGS.pro_name_bm);
    const pro_name_en = String(formData.get('pro_name_en') || DEFAULT_SETTINGS.pro_name_en);
    const agency_name_bm = String(formData.get('agency_name_bm') || DEFAULT_SETTINGS.agency_name_bm);
    const agency_name_en = String(formData.get('agency_name_en') || DEFAULT_SETTINGS.agency_name_en);
    const starter_desc_bm = String(formData.get('starter_desc_bm') || DEFAULT_SETTINGS.starter_desc_bm);
    const starter_desc_en = String(formData.get('starter_desc_en') || DEFAULT_SETTINGS.starter_desc_en);
    const pro_desc_bm = String(formData.get('pro_desc_bm') || DEFAULT_SETTINGS.pro_desc_bm);
    const pro_desc_en = String(formData.get('pro_desc_en') || DEFAULT_SETTINGS.pro_desc_en);
    const agency_desc_bm = String(formData.get('agency_desc_bm') || DEFAULT_SETTINGS.agency_desc_bm);
    const agency_desc_en = String(formData.get('agency_desc_en') || DEFAULT_SETTINGS.agency_desc_en);
    const starter_bonus_accounts = Number(formData.get('starter_bonus_accounts') || DEFAULT_SETTINGS.starter_bonus_accounts);
    const pro_bonus_accounts = Number(formData.get('pro_bonus_accounts') || DEFAULT_SETTINGS.pro_bonus_accounts);
    const agency_bonus_accounts = Number(formData.get('agency_bonus_accounts') || DEFAULT_SETTINGS.agency_bonus_accounts);
    const ticker_items_bm = String(formData.get('ticker_items_bm') || DEFAULT_SETTINGS.ticker_items_bm.join('\n'));
    const ticker_items_en = String(formData.get('ticker_items_en') || DEFAULT_SETTINGS.ticker_items_en.join('\n'));
    const popup_enabled = String(formData.get('popup_enabled') || '') === 'on';
    const popup_headline_bm = String(formData.get('popup_headline_bm') || DEFAULT_SETTINGS.popup_headline_bm);
    const popup_headline_en = String(formData.get('popup_headline_en') || DEFAULT_SETTINGS.popup_headline_en);
    const popup_description_bm = String(formData.get('popup_description_bm') || DEFAULT_SETTINGS.popup_description_bm);
    const popup_description_en = String(formData.get('popup_description_en') || DEFAULT_SETTINGS.popup_description_en);
    const popup_button_text_bm = String(formData.get('popup_button_text_bm') || DEFAULT_SETTINGS.popup_button_text_bm);
    const popup_button_text_en = String(formData.get('popup_button_text_en') || DEFAULT_SETTINGS.popup_button_text_en);
    const popup_redirect_url = String(formData.get('popup_redirect_url') || DEFAULT_SETTINGS.popup_redirect_url);
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

    const parsedFaqs = parseFaqPayload(faqs_payload);

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
      { key: 'starter_name_bm', value: { text: starter_name_bm } },
      { key: 'starter_name_en', value: { text: starter_name_en } },
      { key: 'pro_name_bm', value: { text: pro_name_bm } },
      { key: 'pro_name_en', value: { text: pro_name_en } },
      { key: 'agency_name_bm', value: { text: agency_name_bm } },
      { key: 'agency_name_en', value: { text: agency_name_en } },
      { key: 'starter_desc_bm', value: { text: starter_desc_bm } },
      { key: 'starter_desc_en', value: { text: starter_desc_en } },
      { key: 'pro_desc_bm', value: { text: pro_desc_bm } },
      { key: 'pro_desc_en', value: { text: pro_desc_en } },
      { key: 'agency_desc_bm', value: { text: agency_desc_bm } },
      { key: 'agency_desc_en', value: { text: agency_desc_en } },
      { key: 'starter_bonus_accounts', value: { count: starter_bonus_accounts } },
      { key: 'pro_bonus_accounts', value: { count: pro_bonus_accounts } },
      { key: 'agency_bonus_accounts', value: { count: agency_bonus_accounts } },
      { key: 'ticker_items_bm', value: { items: toBenefitsArray(ticker_items_bm) } },
      { key: 'ticker_items_en', value: { items: toBenefitsArray(ticker_items_en) } },
      { key: 'popup_enabled', value: { enabled: popup_enabled } },
      { key: 'popup_headline_bm', value: { text: popup_headline_bm } },
      { key: 'popup_headline_en', value: { text: popup_headline_en } },
      { key: 'popup_description_bm', value: { text: popup_description_bm } },
      { key: 'popup_description_en', value: { text: popup_description_en } },
      { key: 'popup_button_text_bm', value: { text: popup_button_text_bm } },
      { key: 'popup_button_text_en', value: { text: popup_button_text_en } },
      { key: 'popup_redirect_url', value: { text: popup_redirect_url } },
      { key: 'faqs_payload', value: { items: parsedFaqs } },
    ];

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
      const faqRows = parsedFaqs.map((item) => ({
        question_bm: item.question_bm,
        answer_bm: item.answer_bm,
        question_en: item.question_en,
        answer_en: item.answer_en,
        sort_order: item.sort_order,
      }));

      const insertTimeout = timeoutController(4000);
      const { error: insertFaqError } = await (supabase as any)
        .from('faqs')
        .insert(faqRows)
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
