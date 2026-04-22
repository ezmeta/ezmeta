'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { supabaseConfig } from '@/config/env';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export type SiteSettingsMap = {
  primary_theme_color: string;
  highlight_color: string;
  button_bg_color: string;
  button_text_color: string;
  font_family: string;
  pricing_button_override_enabled: boolean;
  pricing_button_bg_color: string;
  pricing_button_text_color: string;
  hero_headline_bm: string;
  hero_headline_en: string;
  hero_subheadline_bm: string;
  hero_subheadline_en: string;
  feature_heading_bm: string;
  feature_heading_en: string;
  feature_subheading_bm: string;
  feature_subheading_en: string;
  testimonials_badge_bm: string;
  testimonials_badge_en: string;
  testimonials_title_bm: string;
  testimonials_title_en: string;
  pricing_section_title_bm: string;
  pricing_section_title_en: string;
  pricing_section_link_bm: string;
  pricing_section_link_en: string;
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
  ticker_enabled: boolean;
  ticker_speed_seconds: number;
  popup_enabled: boolean;
  popup_headline_bm: string;
  popup_headline_en: string;
  popup_description_bm: string;
  popup_description_en: string;
  popup_button_text_bm: string;
  popup_button_text_en: string;
  popup_redirect_url: string;
  popup_start_date: string;
  popup_end_date: string;
  usp_features_payload: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    title_bm?: string;
    title_en?: string;
    description_bm?: string;
    description_en?: string;
  }>;
  testimonials_payload: Array<{
    id: string;
    name: string;
    role: string;
    quote: string;
    avatar_url: string;
  }>;
};

export type PlanTier = 'free' | 'basic' | 'pro' | 'agency';

export type PlanFeatureEntitlement = {
  id: string;
  plan_tier: PlanTier;
  feature_key: string;
  enabled: boolean;
  updated_at: string;
};

export type FaqItem = {
  id: string;
  question_bm: string;
  answer_bm: string;
  question_en: string;
  answer_en: string;
  sort_order: number;
};

export type SiteSettingsHistoryItem = {
  id: string;
  snapshot: {
    items?: Array<{ key: string; value: any }>;
    source?: string;
  };
  created_by: string;
  created_at: string;
};

export type PricingVersionItem = {
  id: string;
  starter_price: number;
  pro_price: number;
  agency_price: number;
  effective_date: string;
  notes: string | null;
  created_by: string;
  created_at: string;
};

export type IntegrationHealthItem = {
  id: string;
  provider: string;
  status: 'green' | 'red' | 'amber';
  reason_code: string | null;
  latency_ms: number | null;
  last_sync_at: string | null;
  webhook_status: string | null;
  updated_at: string;
};

export type SystemApiSettings = {
  openrouter_api_key: string;
  openrouter_model: string;
  meta_app_id: string;
  meta_app_secret: string;
  meta_access_token: string;
  stripe_secret_key: string;
  stripe_webhook_secret: string;
  stripe_publishable_key: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  tools_webhook_url: string;
};

export type AdminUserRow = {
  user_id: string;
  email: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'agency';
  subscription_status: string;
  ai_credits: number;
  bonus_ad_account_limit: number;
  manual_plan_override: string | null;
  created_at: string;
  ad_accounts_connected: number;
};

const DEFAULT_SETTINGS: SiteSettingsMap = {
  primary_theme_color: '#00FF94',
  highlight_color: '#00FF94',
  button_bg_color: '#22c55e',
  button_text_color: '#020617',
  font_family: 'Inter, sans-serif',
  pricing_button_override_enabled: false,
  pricing_button_bg_color: '#22c55e',
  pricing_button_text_color: '#020617',
  hero_headline_bm: 'Hentikan Pembaziran Bajet Iklan. Biar AI Optimumkan Meta Ads Anda.',
  hero_headline_en: 'Stop Wasting Ad Spend. Let AI Optimize Your Meta Ads.',
  hero_subheadline_bm: 'EZ Meta menganalisis prestasi iklan dan menjana creative untuk tingkatkan ROI anda.',
  hero_subheadline_en: 'EZ Meta analyzes ad performance and generates creatives that improve ROI.',
  feature_heading_bm: 'AI yang faham Meta Ads lebih baik dari manusia.',
  feature_heading_en: 'AI that understands Meta Ads better than manual workflows.',
  feature_subheading_bm: 'Features AI yang direka khas untuk advertiser Malaysia.',
  feature_subheading_en: 'AI features built specifically for performance marketers.',
  testimonials_badge_bm: 'TESTIMONI',
  testimonials_badge_en: 'TESTIMONIALS',
  testimonials_title_bm: 'Apa kata pengguna beta.',
  testimonials_title_en: 'What beta users are saying.',
  pricing_section_title_bm: 'Pilih Pakej Anda Sekarang',
  pricing_section_title_en: 'Choose Your Plan Now',
  pricing_section_link_bm: 'Lihat perbandingan penuh →',
  pricing_section_link_en: 'View full comparison →',
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
  ticker_enabled: true,
  ticker_speed_seconds: 26,
  popup_enabled: false,
  popup_headline_bm: 'Tawaran Terhad EZ Meta',
  popup_headline_en: 'Limited EZ Meta Offer',
  popup_description_bm: 'Aktifkan automasi iklan anda hari ini dan dapatkan akses bonus.',
  popup_description_en: 'Activate your ad automation today and unlock bonus access.',
  popup_button_text_bm: 'Aktifkan Sekarang',
  popup_button_text_en: 'Activate Now',
  popup_redirect_url: '/pricing',
  popup_start_date: '',
  popup_end_date: '',
  usp_features_payload: [
    {
      id: 'usp-1',
      icon: 'Trophy',
      title: 'Winning Ad Detector',
      description: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.',
      title_bm: 'Winning Ad Detector',
      title_en: 'Winning Ad Detector',
      description_bm: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.',
      description_en: 'AI scans all campaigns and detects top-performing ads.',
    },
    {
      id: 'usp-2',
      icon: 'Globe2',
      title: 'Creative Fatigue Detector',
      description: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.',
      title_bm: 'Creative Fatigue Detector',
      title_en: 'Creative Fatigue Detector',
      description_bm: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.',
      description_en: 'Detect CTR drop, high frequency, and rising CPM before performance dips.',
    },
    {
      id: 'usp-3',
      icon: 'HandCoins',
      title: 'Budget Tracker',
      description: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.',
      title_bm: 'Budget Tracker',
      title_en: 'Budget Tracker',
      description_bm: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.',
      description_en: 'Monitor monthly budgets and receive alerts when spend approaches limits.',
    },
    {
      id: 'usp-4',
      icon: 'Heart',
      title: 'Campaign Health Score',
      description: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.',
      title_bm: 'Campaign Health Score',
      title_en: 'Campaign Health Score',
      description_bm: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.',
      description_en: 'Each campaign receives an A–D grade based on ROAS, CTR, CPC, frequency, and conversions.',
    },
    {
      id: 'usp-5',
      icon: 'BarChart3',
      title: 'Laporan AI dalam BM',
      description: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.',
      title_bm: 'Laporan AI dalam BM',
      title_en: 'AI Reports',
      description_bm: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.',
      description_en: 'Daily reports in English that are easy to understand and immediately actionable via Telegram.',
    },
    {
      id: 'usp-6',
      icon: 'Bot',
      title: 'AI Recommendations',
      description: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.',
      title_bm: 'AI Recommendations',
      title_en: 'AI Recommendations',
      description_bm: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.',
      description_en: 'Clear AI automation recommendations for every campaign.',
    },
  ],
  testimonials_payload: [
    {
      id: 'testimonial-1',
      name: 'Ahmad Razif',
      role: 'Dropshipper, Selangor',
      quote: 'Sebelum ni saya kena check ads manager setiap jam. Sekarang EZMeta yang buat semua. Laporan masuk Telegram, saya baca sambil sarapan.',
      avatar_url: '',
    },
    {
      id: 'testimonial-2',
      name: 'Siti Norzahira',
      role: 'E-commerce, KL',
      quote: 'Creative Fatigue detector tu memang game changer. Dulu tak tahu kenapa CTR jatuh. Sekarang EZMeta alert awal, saya sempat tukar creative.',
      avatar_url: '',
    },
    {
      id: 'testimonial-3',
      name: 'Faizul Hakim',
      role: 'Digital Agency, Johor',
      quote: 'Manage 8 client ads sekarang. Dulu kena manual check satu-satu. EZMeta bagi summary semua clients dalam satu laporan. Jimat masa 3 jam sehari.',
      avatar_url: '',
    },
  ],
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

function parseFaqRepeater(formData: FormData): FaqItem[] {
  const out: FaqItem[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const question_bm = String(formData.get(`faq_question_bm_${i}`) || '').trim();
    const answer_bm = String(formData.get(`faq_answer_bm_${i}`) || '').trim();
    const question_en = String(formData.get(`faq_question_en_${i}`) || '').trim();
    const answer_en = String(formData.get(`faq_answer_en_${i}`) || '').trim();
    if (!question_bm || !answer_bm || !question_en || !answer_en) continue;
    out.push({
      id: `repeater-${i}`,
      question_bm,
      answer_bm,
      question_en,
      answer_en,
      sort_order: i,
    });
  }
  return out;
}

function timeoutController(ms: number = SUPABASE_QUERY_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}

function normalizeJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return String(value);
  }
}

function normalizeUspItems(
  items: SiteSettingsMap['usp_features_payload'] | unknown,
): SiteSettingsMap['usp_features_payload'] {
  const fallback = DEFAULT_SETTINGS.usp_features_payload;
  const source = Array.isArray(items) ? (items as SiteSettingsMap['usp_features_payload']) : [];

  return Array.from({ length: 6 }).map((_, index) => {
    const fromSource = source[index];
    const fromFallback = fallback[index] ?? fallback[0];

    const titleBm = String((fromSource as any)?.title_bm ?? '').trim() || String(fromSource?.title ?? '').trim() || fromFallback.title_bm || fromFallback.title;
    const titleEn = String((fromSource as any)?.title_en ?? '').trim() || fromFallback.title_en || fromFallback.title;
    const descriptionBm =
      String((fromSource as any)?.description_bm ?? '').trim() || String(fromSource?.description ?? '').trim() || fromFallback.description_bm || fromFallback.description;
    const descriptionEn = String((fromSource as any)?.description_en ?? '').trim() || fromFallback.description_en || fromFallback.description;
    const icon = String(fromSource?.icon ?? '').trim() || fromFallback.icon;

    return {
      id: `usp-${index + 1}`,
      title: titleBm,
      description: descriptionBm,
      title_bm: titleBm,
      title_en: titleEn,
      description_bm: descriptionBm,
      description_en: descriptionEn,
      icon,
    };
  });
}

function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
}

export async function getPlanFeatureEntitlements(): Promise<PlanFeatureEntitlement[]> {
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
    const { data } = await (supabase as any)
      .from('plan_feature_entitlements')
      .select('id, plan_tier, feature_key, enabled, updated_at')
      .order('plan_tier', { ascending: true })
      .order('feature_key', { ascending: true })
      .abortSignal(timeout.signal);
    timeout.clear();

    return Array.isArray(data) ? (data as PlanFeatureEntitlement[]) : [];
  } catch {
    return [];
  }
}

export async function savePlanFeatureEntitlements(formData: FormData): Promise<void> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      redirect('/admin/settings?status=error');
    }

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const current = await getPlanFeatureEntitlements();
    const payload = current.map((row) => {
      const inputKey = `entitlement_${row.plan_tier}_${row.feature_key}`;
      const enabled = String(formData.get(inputKey) || '') === 'on';
      return {
        id: row.id,
        plan_tier: row.plan_tier,
        feature_key: row.feature_key,
        enabled,
      };
    });

    const timeout = timeoutController(4000);
    const { error } = await (supabase as any)
      .from('plan_feature_entitlements')
      .upsert(payload, { onConflict: 'id' })
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error) {
      console.error('Failed saving entitlement matrix:', error);
      redirect('/admin/settings?status=error');
    }

    const adminId = cookieStore.get('admin_actor')?.value || 'admin-session';
    const auditRows = payload.map((row) => ({
      admin_id: adminId,
      action: 'entitlement_update',
      target_key: `${row.plan_tier}.${row.feature_key}`,
      old_value: current.find((item) => item.id === row.id)?.enabled ?? null,
      new_value: { enabled: row.enabled },
    }));

    const auditTimeout = timeoutController(4000);
    await (supabase as any).from('config_audit_log').insert(auditRows).abortSignal(auditTimeout.signal);
    auditTimeout.clear();

    revalidatePath('/admin/settings');
    redirect('/admin/settings?status=saved');
  } catch (error) {
    console.error('Failed in savePlanFeatureEntitlements:', error);
    redirect('/admin/settings?status=error');
  }
}

export async function getSiteSettingsHistory(limit: number = 15): Promise<SiteSettingsHistoryItem[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { data } = await (supabase as any)
      .from('site_settings_history')
      .select('id, snapshot, created_by, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
      .abortSignal(timeout.signal);
    timeout.clear();

    return Array.isArray(data) ? (data as SiteSettingsHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export async function rollbackSiteSettings(formData: FormData): Promise<void> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      redirect('/admin/settings?status=error');
    }

    const historyId = String(formData.get('history_id') || '').trim();
    if (!historyId) {
      redirect('/admin/settings?status=error');
    }

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { data, error } = await (supabase as any)
      .from('site_settings_history')
      .select('snapshot')
      .eq('id', historyId)
      .maybeSingle()
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error || !data) {
      redirect('/admin/settings?status=error');
    }

    const items = Array.isArray((data as any)?.snapshot?.items)
      ? ((data as any).snapshot.items as Array<{ key: string; value: any }>)
      : [];

    if (items.length === 0) {
      redirect('/admin/settings?status=error');
    }

    const restoreTimeout = timeoutController(4000);
    const { error: restoreError } = await (supabase as any)
      .from('site_settings')
      .upsert(items, { onConflict: 'key' })
      .abortSignal(restoreTimeout.signal);
    restoreTimeout.clear();

    if (restoreError) {
      console.error('Rollback failed:', restoreError);
      redirect('/admin/settings?status=error');
    }

    const adminId = cookieStore.get('admin_actor')?.value || 'admin-session';
    const auditTimeout = timeoutController(4000);
    await (supabase as any)
      .from('config_audit_log')
      .insert({
        admin_id: adminId,
        action: 'site_settings_rollback',
        target_key: historyId,
        old_value: null,
        new_value: { history_id: historyId, restored_keys: items.length },
      })
      .abortSignal(auditTimeout.signal);
    auditTimeout.clear();

    revalidatePath('/');
    revalidatePath('/pricing');
    revalidatePath('/admin/settings');
    redirect('/admin/settings?status=saved');
  } catch (error) {
    console.error('Rollback error:', error);
    redirect('/admin/settings?status=error');
  }
}

export async function getPricingVersions(limit: number = 20): Promise<PricingVersionItem[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { data } = await (supabase as any)
      .from('pricing_versions')
      .select('id, starter_price, pro_price, agency_price, effective_date, notes, created_by, created_at')
      .order('effective_date', { ascending: false })
      .limit(limit)
      .abortSignal(timeout.signal);
    timeout.clear();

    return Array.isArray(data) ? (data as PricingVersionItem[]) : [];
  } catch {
    return [];
  }
}

export async function getIntegrationHealth(): Promise<IntegrationHealthItem[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { data } = await (supabase as any)
      .from('integration_health')
      .select('id, provider, status, reason_code, latency_ms, last_sync_at, webhook_status, updated_at')
      .order('provider', { ascending: true })
      .abortSignal(timeout.signal);
    timeout.clear();

    return Array.isArray(data) ? (data as IntegrationHealthItem[]) : [];
  } catch {
    return [];
  }
}

export async function getAiKillSwitchMode(): Promise<'off' | 'soft' | 'hard'> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { data } = await (supabase as any)
      .from('system_flags')
      .select('value')
      .eq('key', 'ai_kill_switch')
      .maybeSingle()
      .abortSignal(timeout.signal);
    timeout.clear();

    const mode = String((data as any)?.value?.mode || 'off');
    if (mode === 'soft' || mode === 'hard') return mode;
    return 'off';
  } catch {
    return 'off';
  }
}

export async function getSystemApiSettings(): Promise<SystemApiSettings> {
  const fallback: SystemApiSettings = {
    openrouter_api_key: '',
    openrouter_model: 'openai/gpt-4o-mini',
    meta_app_id: '',
    meta_app_secret: '',
    meta_access_token: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    stripe_publishable_key: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    tools_webhook_url: '',
  };

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const keys = Object.keys(fallback);
    const timeout = timeoutController();
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('key, value')
      .in('key', keys)
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error || !Array.isArray(data)) {
      return fallback;
    }

    const mapped: SystemApiSettings = { ...fallback };
    for (const row of data as Array<{ key: string; value: any }>) {
      if (!(row.key in mapped)) continue;
      const value = row.value?.text;
      if (typeof value === 'string') {
        (mapped as any)[row.key] = value;
      }
    }

    return mapped;
  } catch {
    return fallback;
  }
}

export async function saveSystemApiSettings(formData: FormData): Promise<void> {
  const fallback: SystemApiSettings = {
    openrouter_api_key: '',
    openrouter_model: 'openai/gpt-4o-mini',
    meta_app_id: '',
    meta_app_secret: '',
    meta_access_token: '',
    stripe_secret_key: '',
    stripe_webhook_secret: '',
    stripe_publishable_key: '',
    telegram_bot_token: '',
    telegram_chat_id: '',
    tools_webhook_url: '',
  };

  const current = await getSystemApiSettings();
  const rows = Object.keys(fallback).map((key) => {
    const raw = String(formData.get(key) ?? '').trim();
    const nextValue = raw.length > 0 ? raw : (current as any)[key] ?? (fallback as any)[key];
    return { key, value: { text: nextValue } };
  });

  await saveSettingsRows({
    formData,
    rows,
    source: 'saveSystemApiSettings',
    redirectTo: '/admin/system',
    revalidatePaths: ['/admin/system'],
  });
}

export async function setAiKillSwitch(formData: FormData): Promise<void> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      redirect('/admin/settings?status=error');
    }

    const mode = String(formData.get('kill_switch_mode') || 'off');
    const normalized: 'off' | 'soft' | 'hard' = mode === 'soft' || mode === 'hard' ? mode : 'off';

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { error } = await (supabase as any)
      .from('system_flags')
      .upsert({ key: 'ai_kill_switch', value: { mode: normalized } }, { onConflict: 'key' })
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error) {
      console.error('Failed to set AI kill switch:', error);
      redirect('/admin/settings?status=error');
    }

    const adminId = cookieStore.get('admin_actor')?.value || 'admin-session';
    const auditTimeout = timeoutController(4000);
    await (supabase as any)
      .from('config_audit_log')
      .insert({
        admin_id: adminId,
        action: 'kill_switch_update',
        target_key: 'ai_kill_switch',
        old_value: null,
        new_value: { mode: normalized },
      })
      .abortSignal(auditTimeout.signal);
    auditTimeout.clear();

    revalidatePath('/admin');
    revalidatePath('/admin/settings');
    redirect('/admin/settings?status=saved');
  } catch (error) {
    console.error('Failed setAiKillSwitch:', error);
    redirect('/admin/settings?status=error');
  }
}

export async function getAdminUsers(search: string = '', plan: string = 'all'): Promise<AdminUserRow[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    let query = (supabase as any)
      .from('profiles')
      .select('user_id, email, subscription_tier, subscription_status, ai_credits, bonus_ad_account_limit, manual_plan_override, created_at')
      .order('created_at', { ascending: false });

    if (plan !== 'all') {
      query = query.eq('subscription_tier', plan);
    }
    if (search.trim()) {
      query = query.ilike('email', `%${search.trim()}%`);
    }

    const timeout = timeoutController(4000);
    const { data } = await query.abortSignal(timeout.signal);
    timeout.clear();

    const profiles = Array.isArray(data) ? (data as Array<any>) : [];
    if (profiles.length === 0) return [];

    const userIds = profiles.map((item) => item.user_id);
    const accountsTimeout = timeoutController(4000);
    const { data: accounts } = await (supabase as any)
      .from('ad_accounts')
      .select('user_id, status')
      .in('user_id', userIds)
      .eq('status', 'active')
      .abortSignal(accountsTimeout.signal);
    accountsTimeout.clear();

    const map = new Map<string, number>();
    for (const row of Array.isArray(accounts) ? (accounts as Array<any>) : []) {
      map.set(String(row.user_id), (map.get(String(row.user_id)) ?? 0) + 1);
    }

    return profiles.map((profile) => ({
      user_id: profile.user_id,
      email: profile.email,
      subscription_tier: profile.subscription_tier,
      subscription_status: profile.subscription_status,
      ai_credits: Number(profile.ai_credits ?? 0),
      bonus_ad_account_limit: Number(profile.bonus_ad_account_limit ?? 0),
      manual_plan_override: profile.manual_plan_override,
      created_at: profile.created_at,
      ad_accounts_connected: map.get(String(profile.user_id)) ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function updateUserGovernance(formData: FormData): Promise<void> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      redirect('/admin/users?status=error');
    }

    const userId = String(formData.get('user_id') || '').trim();
    const subscriptionTier = String(formData.get('subscription_tier') || 'free').trim();
    const bonusLimit = Number(formData.get('bonus_ad_account_limit') || 0);
    const manualOverride = String(formData.get('manual_plan_override') || '').trim();
    if (!userId) redirect('/admin/users?status=error');

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        subscription_tier: subscriptionTier,
        bonus_ad_account_limit: Number.isFinite(bonusLimit) ? Math.max(0, bonusLimit) : 0,
        manual_plan_override: manualOverride || null,
      })
      .eq('user_id', userId)
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error) {
      console.error('Failed updateUserGovernance:', error);
      redirect('/admin/users?status=error');
    }

    revalidatePath('/admin/users');
    redirect('/admin/users?status=saved');
  } catch (error) {
    console.error('updateUserGovernance error:', error);
    redirect('/admin/users?status=error');
  }
}

export async function updateFeedbackStatus(formData: FormData): Promise<void> {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      redirect('/admin/feedback?status=error');
    }

    const feedbackId = String(formData.get('feedback_id') || '').trim();
    const status = String(formData.get('status') || 'new').trim();
    const internalNotes = String(formData.get('internal_notes') || '').trim();
    if (!feedbackId) redirect('/admin/feedback?status=error');

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const timeout = timeoutController(4000);
    const { error } = await (supabase as any)
      .from('user_feedback')
      .update({
        status: status === 'resolved' ? 'resolved' : 'new',
        internal_notes: internalNotes || null,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null,
      })
      .eq('id', feedbackId)
      .abortSignal(timeout.signal);
    timeout.clear();

    if (error) {
      console.error('Failed updateFeedbackStatus:', error);
      redirect('/admin/feedback?status=error');
    }

    revalidatePath('/admin/feedback');
    redirect('/admin/feedback?status=saved');
  } catch (error) {
    console.error('updateFeedbackStatus error:', error);
    redirect('/admin/feedback?status=error');
  }
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
        'primary_theme_color',
        'highlight_color',
        'button_bg_color',
        'button_text_color',
        'font_family',
        'pricing_button_override_enabled',
        'pricing_button_bg_color',
        'pricing_button_text_color',
        'hero_headline_bm',
        'hero_headline_en',
        'hero_subheadline_bm',
        'hero_subheadline_en',
        'feature_heading_bm',
        'feature_heading_en',
        'feature_subheading_bm',
        'feature_subheading_en',
        'testimonials_badge_bm',
        'testimonials_badge_en',
        'testimonials_title_bm',
        'testimonials_title_en',
        'pricing_section_title_bm',
        'pricing_section_title_en',
        'pricing_section_link_bm',
        'pricing_section_link_en',
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
        'ticker_enabled',
        'ticker_speed_seconds',
        'popup_enabled',
        'popup_headline_bm',
        'popup_headline_en',
        'popup_description_bm',
        'popup_description_en',
        'popup_button_text_bm',
        'popup_button_text_en',
        'popup_redirect_url',
        'popup_start_date',
        'popup_end_date',
        'usp_features_payload',
        'testimonials_payload',
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
      } else if (row.key === 'ticker_enabled') {
        mapped.ticker_enabled = Boolean(row.value?.enabled ?? DEFAULT_SETTINGS.ticker_enabled);
      } else if (row.key === 'ticker_speed_seconds') {
        mapped.ticker_speed_seconds = Number(row.value?.seconds ?? DEFAULT_SETTINGS.ticker_speed_seconds);
      } else if (row.key === 'popup_enabled') {
        mapped.popup_enabled = Boolean(row.value?.enabled ?? DEFAULT_SETTINGS.popup_enabled);
      } else if (row.key === 'pricing_button_override_enabled') {
        mapped.pricing_button_override_enabled = Boolean(
          row.value?.enabled ?? DEFAULT_SETTINGS.pricing_button_override_enabled
        );
      } else if (row.key === 'usp_features_payload') {
        mapped.usp_features_payload = normalizeUspItems(row.value?.items);
      } else if (row.key === 'testimonials_payload') {
        mapped.testimonials_payload = Array.isArray(row.value?.items)
          ? (row.value.items as SiteSettingsMap['testimonials_payload'])
          : DEFAULT_SETTINGS.testimonials_payload;
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
    const ticker_enabled = String(formData.get('ticker_enabled') || '') === 'on';
    const ticker_speed_seconds = Number(formData.get('ticker_speed_seconds') || DEFAULT_SETTINGS.ticker_speed_seconds);
    const popup_enabled = String(formData.get('popup_enabled') || '') === 'on';
    const popup_headline_bm = String(formData.get('popup_headline_bm') || DEFAULT_SETTINGS.popup_headline_bm);
    const popup_headline_en = String(formData.get('popup_headline_en') || DEFAULT_SETTINGS.popup_headline_en);
    const popup_description_bm = String(formData.get('popup_description_bm') || DEFAULT_SETTINGS.popup_description_bm);
    const popup_description_en = String(formData.get('popup_description_en') || DEFAULT_SETTINGS.popup_description_en);
    const popup_button_text_bm = String(formData.get('popup_button_text_bm') || DEFAULT_SETTINGS.popup_button_text_bm);
    const popup_button_text_en = String(formData.get('popup_button_text_en') || DEFAULT_SETTINGS.popup_button_text_en);
    const popup_redirect_url = String(formData.get('popup_redirect_url') || DEFAULT_SETTINGS.popup_redirect_url);
    const popup_start_date = String(formData.get('popup_start_date') || DEFAULT_SETTINGS.popup_start_date).trim();
    const popup_end_date = String(formData.get('popup_end_date') || DEFAULT_SETTINGS.popup_end_date).trim();
    const pricing_effective_date = String(formData.get('pricing_effective_date') || '').trim();
    const faqs_payload = String(formData.get('faqs_payload') || '');

    const normalizeIsoInput = (value: string): string => {
      if (!value) return '';
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? '' : date.toISOString();
    };

    const normalizedPopupStartDate = normalizeIsoInput(popup_start_date);
    const normalizedPopupEndDate = normalizeIsoInput(popup_end_date);

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

    const parsedFaqs = parseFaqRepeater(formData);
    const parsedFaqsFinal = parsedFaqs.length > 0 ? parsedFaqs : parseFaqPayload(faqs_payload);

    const adminId = cookieStore.get('admin_actor')?.value || 'admin-session';

    // snapshot current settings for history and diff/audit
    const snapshotTimeout = timeoutController(4000);
    const { data: currentRows } = await (supabase as any)
      .from('site_settings')
      .select('key, value')
      .abortSignal(snapshotTimeout.signal);
    snapshotTimeout.clear();

    if (Array.isArray(currentRows)) {
      const historyTimeout = timeoutController(4000);
      await (supabase as any)
        .from('site_settings_history')
        .insert({
          snapshot: {
            items: currentRows,
            source: 'saveSiteSettings',
          },
          created_by: adminId,
        })
        .abortSignal(historyTimeout.signal);
      historyTimeout.clear();
    }

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
      { key: 'ticker_enabled', value: { enabled: ticker_enabled } },
      { key: 'ticker_speed_seconds', value: { seconds: ticker_speed_seconds } },
      { key: 'popup_enabled', value: { enabled: popup_enabled } },
      { key: 'popup_headline_bm', value: { text: popup_headline_bm } },
      { key: 'popup_headline_en', value: { text: popup_headline_en } },
      { key: 'popup_description_bm', value: { text: popup_description_bm } },
      { key: 'popup_description_en', value: { text: popup_description_en } },
      { key: 'popup_button_text_bm', value: { text: popup_button_text_bm } },
      { key: 'popup_button_text_en', value: { text: popup_button_text_en } },
      { key: 'popup_redirect_url', value: { text: popup_redirect_url } },
      { key: 'popup_start_date', value: { text: normalizedPopupStartDate } },
      { key: 'popup_end_date', value: { text: normalizedPopupEndDate } },
      { key: 'faqs_payload', value: { items: parsedFaqsFinal } },
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

    // config audit entries
    if (Array.isArray(currentRows)) {
      const prevMap = new Map<string, any>();
      for (const row of currentRows as Array<{ key: string; value: any }>) prevMap.set(row.key, row.value);
      const auditRows = payload
        .filter((row) => normalizeJson(prevMap.get(row.key)) !== normalizeJson(row.value))
        .map((row) => ({
          admin_id: adminId,
          action: 'site_settings_update',
          target_key: row.key,
          old_value: prevMap.get(row.key) ?? null,
          new_value: row.value,
        }));

      if (auditRows.length > 0) {
        const auditTimeout = timeoutController(4000);
        await (supabase as any).from('config_audit_log').insert(auditRows).abortSignal(auditTimeout.signal);
        auditTimeout.clear();
      }
    }

    // pricing versioning with effective date
    if (pricing_effective_date.length > 0) {
      const normalizedEffectiveDate = normalizeIsoInput(pricing_effective_date);
      if (!normalizedEffectiveDate) {
        console.warn('Invalid pricing_effective_date provided. Skipping pricing_versions insert.');
      }
      const pricingVersionTimeout = timeoutController(4000);
      if (normalizedEffectiveDate) {
        await (supabase as any)
          .from('pricing_versions')
          .insert({
            starter_price: pricing_starter_price,
            pro_price: pricing_pro_price,
            agency_price: pricing_agency_price,
            effective_date: normalizedEffectiveDate,
            notes: 'Admin update from settings panel',
            created_by: adminId,
          })
          .abortSignal(pricingVersionTimeout.signal);
      }
      pricingVersionTimeout.clear();
    }

    const deleteTimeout = timeoutController(4000);
    const { error: deleteFaqError } = await (supabase as any)
      .from('faqs')
      .delete()
      .gte('sort_order', 0)
      .abortSignal(deleteTimeout.signal);
    deleteTimeout.clear();
    if (deleteFaqError) {
      // FAQ table can be absent/restricted in some environments; payload in site_settings remains the source of truth.
      console.warn('FAQ table delete skipped, using site_settings.faqs_payload fallback only:', deleteFaqError);
    }

    if (!deleteFaqError && parsedFaqsFinal.length > 0) {
      const faqRows = parsedFaqsFinal.map((item) => ({
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
        console.warn('FAQ table insert skipped, using site_settings.faqs_payload fallback only:', insertFaqError);
      }
    }

    revalidatePath('/');
    revalidatePath('/pricing');
    revalidatePath('/admin/settings');
    redirect('/admin/settings?status=saved');
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }
    console.error('Unexpected error saving settings:', error);
    redirect('/admin/settings?status=error');
  }
}

function parseCheckboxValue(formData: FormData, key: string): boolean {
  const values = formData.getAll(key).map((item) => String(item));
  return values.includes('on') || values.includes('true') || values.includes('1');
}

type SiteSettingsRowMap = Map<string, any>;

async function getCurrentSiteSettingsRowMap(): Promise<SiteSettingsRowMap> {
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  const timeout = timeoutController(4000);
  const { data } = await (supabase as any).from('site_settings').select('key, value').abortSignal(timeout.signal);
  timeout.clear();

  const map = new Map<string, any>();
  for (const row of (data ?? []) as Array<{ key: string; value: any }>) {
    map.set(row.key, row.value);
  }
  return map;
}

function getExistingText(existing: SiteSettingsRowMap, key: string, fallback: string): string {
  const raw = existing.get(key)?.text;
  return typeof raw === 'string' && raw.trim().length > 0 ? raw : fallback;
}

function getExistingItems(existing: SiteSettingsRowMap, key: string, fallback: string[]): string[] {
  const raw = existing.get(key)?.items;
  return Array.isArray(raw) && raw.length > 0 ? (raw as string[]) : fallback;
}

function getExistingNumber(existing: SiteSettingsRowMap, key: string, field: string, fallback: number): number {
  const raw = Number(existing.get(key)?.[field]);
  return Number.isFinite(raw) ? raw : fallback;
}

function resolveTextInput(formData: FormData, key: string, existing: SiteSettingsRowMap, fallback: string): string {
  if (!formData.has(key)) return getExistingText(existing, key, fallback);
  const value = String(formData.get(key) || '').trim();
  return value.length > 0 ? value : getExistingText(existing, key, fallback);
}

function resolveListInput(formData: FormData, key: string, existing: SiteSettingsRowMap, fallback: string[]): string[] {
  if (!formData.has(key)) return getExistingItems(existing, key, fallback);
  const list = String(formData.get(key) || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : getExistingItems(existing, key, fallback);
}

function resolveNumberInput(
  formData: FormData,
  key: string,
  existing: SiteSettingsRowMap,
  field: string,
  fallback: number
): number {
  if (!formData.has(key)) return getExistingNumber(existing, key, field, fallback);
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : getExistingNumber(existing, key, field, fallback);
}

async function saveSettingsRows(options: {
  formData: FormData;
  rows: Array<{ key: string; value: any }>;
  source: string;
  redirectTo: string;
  revalidatePaths: string[];
}): Promise<void> {
  const { formData, rows, source, redirectTo, revalidatePaths } = options;
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin_auth')?.value !== 'true') {
      redirect(`${redirectTo}?status=error`);
    }

    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    const adminId = cookieStore.get('admin_actor')?.value || 'admin-session';

    const snapshotTimeout = timeoutController(4000);
    const { data: currentRows } = await (supabase as any).from('site_settings').select('key, value').abortSignal(snapshotTimeout.signal);
    snapshotTimeout.clear();

    const upsertTimeout = timeoutController(4000);
    const { error } = await (supabase as any).from('site_settings').upsert(rows, { onConflict: 'key' }).abortSignal(upsertTimeout.signal);
    upsertTimeout.clear();
    if (error) {
      console.error(`Error saving ${source}:`, error);
      redirect(`${redirectTo}?status=error`);
    }

    if (Array.isArray(currentRows)) {
      const historyTimeout = timeoutController(4000);
      await (supabase as any)
        .from('site_settings_history')
        .insert({
          snapshot: {
            items: currentRows,
            source,
          },
          created_by: adminId,
        })
        .abortSignal(historyTimeout.signal);
      historyTimeout.clear();

      const prevMap = new Map<string, any>();
      for (const row of currentRows as Array<{ key: string; value: any }>) prevMap.set(row.key, row.value);
      const auditRows = rows
        .filter((row) => normalizeJson(prevMap.get(row.key)) !== normalizeJson(row.value))
        .map((row) => ({
          admin_id: adminId,
          action: 'site_settings_update',
          target_key: row.key,
          old_value: prevMap.get(row.key) ?? null,
          new_value: row.value,
        }));

      if (auditRows.length > 0) {
        const auditTimeout = timeoutController(4000);
        await (supabase as any).from('config_audit_log').insert(auditRows).abortSignal(auditTimeout.signal);
        auditTimeout.clear();
      }
    }

    for (const path of revalidatePaths) {
      revalidatePath(path);
    }
    redirect(`${redirectTo}?status=saved`);
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    console.error(`Unexpected error saving ${options.source}:`, error);
    redirect(`${options.redirectTo}?status=error`);
  }
}

export async function savePricingModuleSettings(formData: FormData): Promise<void> {
  const existing = await getCurrentSiteSettingsRowMap();

  const pricing_starter_price = resolveNumberInput(
    formData,
    'pricing_starter_price',
    existing,
    'amount',
    DEFAULT_SETTINGS.pricing_starter_price
  );
  const pricing_pro_price = resolveNumberInput(formData, 'pricing_pro_price', existing, 'amount', DEFAULT_SETTINGS.pricing_pro_price);
  const pricing_agency_price = resolveNumberInput(
    formData,
    'pricing_agency_price',
    existing,
    'amount',
    DEFAULT_SETTINGS.pricing_agency_price
  );
  const pricing_effective_date = String(formData.get('pricing_effective_date') || '').trim();
  const pricingButtonOverridePresent = formData.has('pricing_button_override_enabled_present');
  const pricingButtonOverrideEnabled = pricingButtonOverridePresent
    ? parseCheckboxValue(formData, 'pricing_button_override_enabled')
    : DEFAULT_SETTINGS.pricing_button_override_enabled;

  const rows = [
    { key: 'pricing_starter_price', value: { amount: pricing_starter_price, currency: 'RM', interval: 'month' } },
    { key: 'pricing_pro_price', value: { amount: pricing_pro_price, currency: 'RM', interval: 'month' } },
    { key: 'pricing_agency_price', value: { amount: pricing_agency_price, currency: 'RM', interval: 'month' } },
    { key: 'starter_name_bm', value: { text: resolveTextInput(formData, 'starter_name_bm', existing, DEFAULT_SETTINGS.starter_name_bm) } },
    { key: 'starter_name_en', value: { text: resolveTextInput(formData, 'starter_name_en', existing, DEFAULT_SETTINGS.starter_name_en) } },
    { key: 'pro_name_bm', value: { text: resolveTextInput(formData, 'pro_name_bm', existing, DEFAULT_SETTINGS.pro_name_bm) } },
    { key: 'pro_name_en', value: { text: resolveTextInput(formData, 'pro_name_en', existing, DEFAULT_SETTINGS.pro_name_en) } },
    { key: 'agency_name_bm', value: { text: resolveTextInput(formData, 'agency_name_bm', existing, DEFAULT_SETTINGS.agency_name_bm) } },
    { key: 'agency_name_en', value: { text: resolveTextInput(formData, 'agency_name_en', existing, DEFAULT_SETTINGS.agency_name_en) } },
    { key: 'starter_desc_bm', value: { text: resolveTextInput(formData, 'starter_desc_bm', existing, DEFAULT_SETTINGS.starter_desc_bm) } },
    { key: 'starter_desc_en', value: { text: resolveTextInput(formData, 'starter_desc_en', existing, DEFAULT_SETTINGS.starter_desc_en) } },
    { key: 'pro_desc_bm', value: { text: resolveTextInput(formData, 'pro_desc_bm', existing, DEFAULT_SETTINGS.pro_desc_bm) } },
    { key: 'pro_desc_en', value: { text: resolveTextInput(formData, 'pro_desc_en', existing, DEFAULT_SETTINGS.pro_desc_en) } },
    { key: 'agency_desc_bm', value: { text: resolveTextInput(formData, 'agency_desc_bm', existing, DEFAULT_SETTINGS.agency_desc_bm) } },
    { key: 'agency_desc_en', value: { text: resolveTextInput(formData, 'agency_desc_en', existing, DEFAULT_SETTINGS.agency_desc_en) } },
    {
      key: 'starter_bonus_accounts',
      value: { count: resolveNumberInput(formData, 'starter_bonus_accounts', existing, 'count', DEFAULT_SETTINGS.starter_bonus_accounts) },
    },
    {
      key: 'pro_bonus_accounts',
      value: { count: resolveNumberInput(formData, 'pro_bonus_accounts', existing, 'count', DEFAULT_SETTINGS.pro_bonus_accounts) },
    },
    {
      key: 'agency_bonus_accounts',
      value: { count: resolveNumberInput(formData, 'agency_bonus_accounts', existing, 'count', DEFAULT_SETTINGS.agency_bonus_accounts) },
    },
    {
      key: 'contact_whatsapp',
      value: {
        number: resolveTextInput(formData, 'contact_whatsapp', existing, DEFAULT_SETTINGS.contact_whatsapp),
        label: 'WhatsApp Support',
      },
    },
    { key: 'pricing_button_override_enabled', value: { enabled: pricingButtonOverrideEnabled } },
    {
      key: 'pricing_button_bg_color',
      value: { text: resolveTextInput(formData, 'pricing_button_bg_color', existing, DEFAULT_SETTINGS.pricing_button_bg_color) },
    },
    {
      key: 'pricing_button_text_color',
      value: { text: resolveTextInput(formData, 'pricing_button_text_color', existing, DEFAULT_SETTINGS.pricing_button_text_color) },
    },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'savePricingModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/pricing', '/admin/settings'],
  });

  if (pricing_effective_date) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
        cookies: { get(name: string) { return cookieStore.get(name)?.value; } },
      });
      const normalized = new Date(pricing_effective_date);
      if (!Number.isNaN(normalized.getTime())) {
        await (supabase as any).from('pricing_versions').insert({
          starter_price: pricing_starter_price,
          pro_price: pricing_pro_price,
          agency_price: pricing_agency_price,
          effective_date: normalized.toISOString(),
          notes: 'Admin pricing module update',
          created_by: cookieStore.get('admin_actor')?.value || 'admin-session',
        });
      }
    } catch (error) {
      console.warn('Pricing version insert skipped:', error);
    }
  }
}

export async function saveContentModuleSettings(formData: FormData): Promise<void> {
  const existing = await getCurrentSiteSettingsRowMap();

  const tickerEnabledPresent = formData.has('ticker_enabled_present');
  const tickerEnabled = tickerEnabledPresent ? parseCheckboxValue(formData, 'ticker_enabled') : DEFAULT_SETTINGS.ticker_enabled;

  const rows = [
    { key: 'hero_headline_bm', value: { text: resolveTextInput(formData, 'hero_headline_bm', existing, DEFAULT_SETTINGS.hero_headline_bm) } },
    { key: 'hero_headline_en', value: { text: resolveTextInput(formData, 'hero_headline_en', existing, DEFAULT_SETTINGS.hero_headline_en) } },
    { key: 'hero_subheadline_bm', value: { text: resolveTextInput(formData, 'hero_subheadline_bm', existing, DEFAULT_SETTINGS.hero_subheadline_bm) } },
    { key: 'hero_subheadline_en', value: { text: resolveTextInput(formData, 'hero_subheadline_en', existing, DEFAULT_SETTINGS.hero_subheadline_en) } },
    { key: 'feature_heading_bm', value: { text: resolveTextInput(formData, 'feature_heading_bm', existing, DEFAULT_SETTINGS.feature_heading_bm) } },
    { key: 'feature_heading_en', value: { text: resolveTextInput(formData, 'feature_heading_en', existing, DEFAULT_SETTINGS.feature_heading_en) } },
    { key: 'feature_subheading_bm', value: { text: resolveTextInput(formData, 'feature_subheading_bm', existing, DEFAULT_SETTINGS.feature_subheading_bm) } },
    { key: 'feature_subheading_en', value: { text: resolveTextInput(formData, 'feature_subheading_en', existing, DEFAULT_SETTINGS.feature_subheading_en) } },
    { key: 'testimonials_badge_bm', value: { text: resolveTextInput(formData, 'testimonials_badge_bm', existing, DEFAULT_SETTINGS.testimonials_badge_bm) } },
    { key: 'testimonials_badge_en', value: { text: resolveTextInput(formData, 'testimonials_badge_en', existing, DEFAULT_SETTINGS.testimonials_badge_en) } },
    { key: 'testimonials_title_bm', value: { text: resolveTextInput(formData, 'testimonials_title_bm', existing, DEFAULT_SETTINGS.testimonials_title_bm) } },
    { key: 'testimonials_title_en', value: { text: resolveTextInput(formData, 'testimonials_title_en', existing, DEFAULT_SETTINGS.testimonials_title_en) } },
    { key: 'pricing_section_title_bm', value: { text: resolveTextInput(formData, 'pricing_section_title_bm', existing, DEFAULT_SETTINGS.pricing_section_title_bm) } },
    { key: 'pricing_section_title_en', value: { text: resolveTextInput(formData, 'pricing_section_title_en', existing, DEFAULT_SETTINGS.pricing_section_title_en) } },
    { key: 'pricing_section_link_bm', value: { text: resolveTextInput(formData, 'pricing_section_link_bm', existing, DEFAULT_SETTINGS.pricing_section_link_bm) } },
    { key: 'pricing_section_link_en', value: { text: resolveTextInput(formData, 'pricing_section_link_en', existing, DEFAULT_SETTINGS.pricing_section_link_en) } },
    { key: 'alert_banner_text_bm', value: { text: resolveTextInput(formData, 'alert_banner_text_bm', existing, DEFAULT_SETTINGS.alert_banner_text_bm) } },
    { key: 'alert_banner_text_en', value: { text: resolveTextInput(formData, 'alert_banner_text_en', existing, DEFAULT_SETTINGS.alert_banner_text_en) } },
    { key: 'ticker_enabled', value: { enabled: tickerEnabled } },
    {
      key: 'ticker_speed_seconds',
      value: { seconds: resolveNumberInput(formData, 'ticker_speed_seconds', existing, 'seconds', DEFAULT_SETTINGS.ticker_speed_seconds) },
    },
    { key: 'ticker_items_bm', value: { items: resolveListInput(formData, 'ticker_items_bm', existing, DEFAULT_SETTINGS.ticker_items_bm) } },
    { key: 'ticker_items_en', value: { items: resolveListInput(formData, 'ticker_items_en', existing, DEFAULT_SETTINGS.ticker_items_en) } },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'saveContentModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/admin/settings'],
  });
}

export async function saveGlobalStylesModuleSettings(formData: FormData): Promise<void> {
  const existing = await getCurrentSiteSettingsRowMap();

  const rows = [
    { key: 'primary_theme_color', value: { text: resolveTextInput(formData, 'primary_theme_color', existing, DEFAULT_SETTINGS.primary_theme_color) } },
    { key: 'highlight_color', value: { text: resolveTextInput(formData, 'highlight_color', existing, DEFAULT_SETTINGS.highlight_color) } },
    { key: 'button_bg_color', value: { text: resolveTextInput(formData, 'button_bg_color', existing, DEFAULT_SETTINGS.button_bg_color) } },
    { key: 'button_text_color', value: { text: resolveTextInput(formData, 'button_text_color', existing, DEFAULT_SETTINGS.button_text_color) } },
    { key: 'font_family', value: { text: resolveTextInput(formData, 'font_family', existing, DEFAULT_SETTINGS.font_family) } },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'saveGlobalStylesModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/admin/settings'],
  });
}

export async function saveUspModuleSettings(formData: FormData): Promise<void> {
  const rawItems: SiteSettingsMap['usp_features_payload'] = [];
  for (let i = 1; i <= 6; i += 1) {
    const title_bm = String(formData.get(`usp_title_bm_${i}`) || '').trim();
    const title_en = String(formData.get(`usp_title_en_${i}`) || '').trim();
    const description_bm = String(formData.get(`usp_description_bm_${i}`) || '').trim();
    const description_en = String(formData.get(`usp_description_en_${i}`) || '').trim();

    rawItems.push({
      id: `usp-${i}`,
      icon: String(formData.get(`usp_icon_${i}`) || '').trim(),
      title: title_bm,
      description: description_bm,
      title_bm,
      title_en,
      description_bm,
      description_en,
    });
  }

  const items = normalizeUspItems(rawItems);

  const rows = [
    {
      key: 'usp_features_payload', value: { items },
    },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'saveUspModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/admin/settings'],
  });
}

export async function saveTestimonialsModuleSettings(formData: FormData): Promise<void> {
  const items: SiteSettingsMap['testimonials_payload'] = [];
  for (let i = 1; i <= 8; i += 1) {
    const name = String(formData.get(`testimonial_name_${i}`) || '').trim();
    const role = String(formData.get(`testimonial_role_${i}`) || '').trim();
    const quote = String(formData.get(`testimonial_quote_${i}`) || '').trim();
    const avatar_url = String(formData.get(`testimonial_avatar_${i}`) || '').trim();
    if (!name || !quote) continue;
    items.push({
      id: `testimonial-${i}`,
      name,
      role,
      quote,
      avatar_url,
    });
  }

  const rows = [
    {
      key: 'testimonials_payload',
      value: { items: items.length > 0 ? items : DEFAULT_SETTINGS.testimonials_payload },
    },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'saveTestimonialsModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/admin/settings'],
  });
}

export async function saveFaqModuleSettings(formData: FormData): Promise<void> {
  const existing = await getCurrentSiteSettingsRowMap();

  const parsedFaqs = parseFaqRepeater(formData);
  const faqs_payload = String(formData.get('faqs_payload') || '');
  const parsedFaqsFinal = parsedFaqs.length > 0 ? parsedFaqs : parseFaqPayload(faqs_payload);

  const rows = [
    {
      key: 'pricing_starter_benefits_bm',
      value: { items: resolveListInput(formData, 'pricing_starter_benefits_bm', existing, DEFAULT_SETTINGS.pricing_starter_benefits_bm) },
    },
    {
      key: 'pricing_starter_benefits_en',
      value: { items: resolveListInput(formData, 'pricing_starter_benefits_en', existing, DEFAULT_SETTINGS.pricing_starter_benefits_en) },
    },
    {
      key: 'pricing_pro_benefits_bm',
      value: { items: resolveListInput(formData, 'pricing_pro_benefits_bm', existing, DEFAULT_SETTINGS.pricing_pro_benefits_bm) },
    },
    {
      key: 'pricing_pro_benefits_en',
      value: { items: resolveListInput(formData, 'pricing_pro_benefits_en', existing, DEFAULT_SETTINGS.pricing_pro_benefits_en) },
    },
    {
      key: 'pricing_agency_benefits_bm',
      value: { items: resolveListInput(formData, 'pricing_agency_benefits_bm', existing, DEFAULT_SETTINGS.pricing_agency_benefits_bm) },
    },
    {
      key: 'pricing_agency_benefits_en',
      value: { items: resolveListInput(formData, 'pricing_agency_benefits_en', existing, DEFAULT_SETTINGS.pricing_agency_benefits_en) },
    },
    { key: 'faqs_payload', value: { items: parsedFaqsFinal } },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'saveFaqModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/pricing', '/admin/settings'],
  });

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
      cookies: { get(name: string) { return cookieStore.get(name)?.value; } },
    });
    const { error: deleteFaqError } = await (supabase as any).from('faqs').delete().gte('sort_order', 0);
    if (!deleteFaqError && parsedFaqsFinal.length > 0) {
      const faqRows = parsedFaqsFinal.map((item) => ({
        question_bm: item.question_bm,
        answer_bm: item.answer_bm,
        question_en: item.question_en,
        answer_en: item.answer_en,
        sort_order: item.sort_order,
      }));
      await (supabase as any).from('faqs').insert(faqRows);
    }
  } catch (error) {
    console.warn('FAQ table sync skipped for module save:', error);
  }
}

export async function savePopupModuleSettings(formData: FormData): Promise<void> {
  const existing = await getCurrentSiteSettingsRowMap();

  const popupEnabledPresent = formData.has('popup_enabled_present');
  const popupEnabled = popupEnabledPresent ? parseCheckboxValue(formData, 'popup_enabled') : DEFAULT_SETTINGS.popup_enabled;

  const normalizeIsoInput = (value: string): string => {
    if (!value.trim()) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  };

  const rows = [
    { key: 'popup_enabled', value: { enabled: popupEnabled } },
    { key: 'popup_headline_bm', value: { text: resolveTextInput(formData, 'popup_headline_bm', existing, DEFAULT_SETTINGS.popup_headline_bm) } },
    { key: 'popup_headline_en', value: { text: resolveTextInput(formData, 'popup_headline_en', existing, DEFAULT_SETTINGS.popup_headline_en) } },
    { key: 'popup_description_bm', value: { text: resolveTextInput(formData, 'popup_description_bm', existing, DEFAULT_SETTINGS.popup_description_bm) } },
    { key: 'popup_description_en', value: { text: resolveTextInput(formData, 'popup_description_en', existing, DEFAULT_SETTINGS.popup_description_en) } },
    { key: 'popup_button_text_bm', value: { text: resolveTextInput(formData, 'popup_button_text_bm', existing, DEFAULT_SETTINGS.popup_button_text_bm) } },
    { key: 'popup_button_text_en', value: { text: resolveTextInput(formData, 'popup_button_text_en', existing, DEFAULT_SETTINGS.popup_button_text_en) } },
    { key: 'popup_redirect_url', value: { text: resolveTextInput(formData, 'popup_redirect_url', existing, DEFAULT_SETTINGS.popup_redirect_url) } },
    {
      key: 'popup_start_date',
      value: {
        text: formData.has('popup_start_date')
          ? normalizeIsoInput(String(formData.get('popup_start_date') || ''))
          : getExistingText(existing, 'popup_start_date', DEFAULT_SETTINGS.popup_start_date),
      },
    },
    {
      key: 'popup_end_date',
      value: {
        text: formData.has('popup_end_date')
          ? normalizeIsoInput(String(formData.get('popup_end_date') || ''))
          : getExistingText(existing, 'popup_end_date', DEFAULT_SETTINGS.popup_end_date),
      },
    },
  ];

  await saveSettingsRows({
    formData,
    rows,
    source: 'savePopupModuleSettings',
    redirectTo: '/admin/settings',
    revalidatePaths: ['/', '/admin/settings'],
  });
}
