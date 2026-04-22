'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Brain,
  Bot,
  BarChart3,
  Check,
  Globe2,
  HandCoins,
  Heart,
  Radar,
  Trophy,
  Waves,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FeedbackWidget from '@/components/shared/FeedbackWidget';
import { landingDictionary } from '@/lib/i18n/landing';
import { buildPricingModel, EMPTY_PRICING_SETTINGS, type PricingSettings } from '@/lib/pricing-model';

type LandingSettings = PricingSettings & {
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
  alert_banner_text_bm: string;
  alert_banner_text_en: string;
  usp_features_payload: Array<{ id: string; icon: string; title: string; description: string }>;
  testimonials_payload: Array<{ id: string; name: string; role: string; quote: string; avatar_url: string }>;
};

type FaqItem = {
  id: string;
  question_bm: string;
  answer_bm: string;
  question_en: string;
  answer_en: string;
  sort_order: number;
};

const FALLBACK_SETTINGS: LandingSettings = {
  ...EMPTY_PRICING_SETTINGS,
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
  alert_banner_text_bm: '🚀 Baharu: AI Creative Studio kini menyokong penjanaan skrip video.',
  alert_banner_text_en: '🚀 New: AI Creative Studio now supports video script generation.',
  usp_features_payload: [
    { id: 'usp-1', icon: 'Trophy', title: 'Winning Ad Detector', description: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.' },
    { id: 'usp-2', icon: 'Globe2', title: 'Creative Fatigue Detector', description: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.' },
    { id: 'usp-3', icon: 'HandCoins', title: 'Budget Tracker', description: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.' },
    { id: 'usp-4', icon: 'Heart', title: 'Campaign Health Score', description: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.' },
    { id: 'usp-5', icon: 'BarChart3', title: 'Laporan AI dalam BM', description: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.' },
    { id: 'usp-6', icon: 'Bot', title: 'AI Recommendations', description: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.' },
  ],
  testimonials_payload: [
    {
      id: 't-1',
      name: 'Ahmad Razif',
      role: 'Dropshipper, Selangor',
      quote: 'Sebelum ni saya kena check ads manager setiap jam. Sekarang EZMeta yang buat semua. Laporan masuk Telegram, saya baca sambil sarapan.',
      avatar_url: '',
    },
    {
      id: 't-2',
      name: 'Siti Norzahira',
      role: 'E-commerce, KL',
      quote: 'Creative Fatigue detector tu memang game changer. Dulu tak tahu kenapa CTR jatuh. Sekarang EZMeta alert awal, saya sempat tukar creative.',
      avatar_url: '',
    },
    {
      id: 't-3',
      name: 'Faizul Hakim',
      role: 'Digital Agency, Johor',
      quote: 'Manage 8 client ads sekarang. Dulu kena manual check satu-satu. EZMeta bagi summary semua clients dalam satu laporan. Jimat masa 3 jam sehari.',
      avatar_url: '',
    },
  ],
};

const USP_CANONICAL_BM = [
  {
    title: 'Winning Ad Detector',
    description: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.',
  },
  {
    title: 'Creative Fatigue Detector',
    description: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.',
  },
  {
    title: 'Budget Tracker',
    description: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.',
  },
  {
    title: 'Campaign Health Score',
    description: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.',
  },
  {
    title: 'Laporan AI dalam BM',
    description: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.',
  },
  {
    title: 'AI Recommendations',
    description: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.',
  },
] as const;

const USP_CANONICAL_EN = [
  {
    title: 'Winning Ad Detector',
    description: 'AI scans all campaigns and detects top-performing ads.',
  },
  {
    title: 'Creative Fatigue Detector',
    description: 'Detect CTR drop, high frequency, and rising CPM before performance dips.',
  },
  {
    title: 'Budget Tracker',
    description: 'Monitor monthly budgets and alert when spend is near limits.',
  },
  {
    title: 'Campaign Health Score',
    description: 'Each campaign receives an A-D grade based on ROAS, CTR, CPC, frequency, and conversions.',
  },
  {
    title: 'AI Reports in EN',
    description: 'Daily reports in English that are easy to understand and immediately actionable via Telegram.',
  },
  {
    title: 'AI Recommendations',
    description: 'Clear AI automation recommendations for every campaign.',
  },
] as const;

function parseHighlightText(text: string, highlightColor: string): ReactNode[] {
  const resolvedColor = 'var(--primary-color)';
  const renderInline = (input: string, keyPrefix: string): ReactNode[] => {
    return input
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\])/g)
      .filter(Boolean)
      .map((part, idx) => {
        const key = `${keyPrefix}-${idx}`;
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const value = part.slice(2, -2);
          return <strong key={key}>{renderInline(value, `${key}-b`)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 3) {
          const value = part.slice(1, -1);
          return <em key={key}>{renderInline(value, `${key}-i`)}</em>;
        }
        if (part.startsWith('[') && part.endsWith(']') && part.length >= 3) {
          const value = part.slice(1, -1);
          return (
            <span key={key} style={{ color: resolvedColor, fontWeight: 700 }}>
              {renderInline(value, `${key}-h`)}
            </span>
          );
        }
        return <span key={key}>{part}</span>;
      });
  };

  return text
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .map((part, idx) => {
      const key = `seg-${idx}`;
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 3) {
        return (
          <code key={key} className="rounded bg-slate-800/90 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-100">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={key}>{renderInline(part, key)}</span>;
    });
}

export default function Home() {
  const lang: 'en' = 'en';
  const [settings, setSettings] = useState<LandingSettings>(FALLBACK_SETTINGS);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        const faqRes = await fetch('/api/faqs', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<LandingSettings>;
        if (active) setSettings({ ...FALLBACK_SETTINGS, ...data });
        if (faqRes.ok && active) {
          const faqData = (await faqRes.json()) as FaqItem[];
          setFaqs(faqData);
        }
      } catch {
        // fallback already applied
      }
    }
    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const t = landingDictionary.en;
  const heroHeadline = settings.hero_headline_en || FALLBACK_SETTINGS.hero_headline_en;
  const heroSubheadline = settings.hero_subheadline_en || FALLBACK_SETTINGS.hero_subheadline_en;
  const alertBanner = settings.alert_banner_text_en || FALLBACK_SETTINGS.alert_banner_text_en;
  const whatsappHref = `https://wa.me/${settings.contact_whatsapp.replace(/[^\d]/g, '')}`;
  const highlightColor = settings.highlight_color || FALLBACK_SETTINGS.highlight_color;

  const { plans, allFeatures } = useMemo(() => buildPricingModel(settings, 'en'), [settings]);
  const tickerItems = useMemo(() => {
    const source = settings.ticker_items_en;
    const cleaned = source.map((item) => item.trim()).filter(Boolean);
    return cleaned.length > 0
      ? cleaned
      : ['AI TELEGRAM ALERTS', 'WINNING AD DETECTOR', 'CREATIVE FATIGUE MONITOR', 'BUDGET TRACKER'];
  }, [settings.ticker_items_en]);
  const orderedComparisonFeatures = useMemo(
    () =>
      allFeatures.filter((feature) => {
        const value = feature.trim();
        if (/^\d+\s*ad\s*accounts?$/i.test(value)) return false;
        if (/^\d+\s*akaun$/i.test(value)) return false;
        return true;
      }),
    [allFeatures]
  );

  const heroMetrics = [
    { label: 'Average ROAS uplift', value: '+31%' },
    { label: 'Audit time saved', value: '-11 hrs/week' },
    { label: 'Critical alert delivery', value: '< 60s' },
  ];

  const telegramCopy = {
    badge: 'Telegram Preview',
    reportTitle: '📊 EZMeta DAILY REPORT',
    summary: '📈 Summary',
    winnerHint: '💡 Scale budget +20% now',
    fatigueTitle: '😴 Creative Fatigue',
    fatigueFlag: '🔴 Premium Hijab [CRITICAL]',
    fatigueDesc: 'CTR dropped 40% in 7 days',
    budgetTitle: '💰 Budget Alert',
    budgetFlag: '🟡 Retargeting Cart: 97.2% used',
    budgetDesc: 'Only RM 25 remaining',
  };

  const uspSource = settings.usp_features_payload?.length >= 6
    ? settings.usp_features_payload.slice(0, 6)
    : [
        ...(settings.usp_features_payload ?? []),
        ...FALLBACK_SETTINGS.usp_features_payload.slice(settings.usp_features_payload?.length ?? 0),
      ].slice(0, 6);

  const uspDisplay = uspSource.map((item, index) => {
    const bmCanonical = USP_CANONICAL_BM[index];
    const enCanonical = USP_CANONICAL_EN[index];

    if (lang === 'en') {
      const isCanonicalBm =
        item.title.trim() === bmCanonical.title && item.description.trim() === bmCanonical.description;
      if (isCanonicalBm) {
        return {
          ...item,
          title: enCanonical.title,
          description: enCanonical.description,
        };
      }
    }

    return item;
  });

  const featureSectionCopy = {
    heading: settings.feature_heading_en || FALLBACK_SETTINGS.feature_heading_en,
    subheading: settings.feature_subheading_en || FALLBACK_SETTINGS.feature_subheading_en,
    cards: [
      {
        Icon: Trophy,
        iconWrap: 'border-amber-300/30 bg-amber-400/10 shadow-[0_0_24px_rgba(251,191,36,0.18)]',
        iconColor: 'text-amber-300',
      },
      {
        Icon: Brain,
        iconWrap: 'border-violet-300/30 bg-violet-400/10 shadow-[0_0_24px_rgba(167,139,250,0.2)]',
        iconColor: 'text-violet-300',
      },
      {
        Icon: Waves,
        iconWrap: 'border-emerald-300/30 bg-emerald-400/10 shadow-[0_0_24px_rgba(52,211,153,0.18)]',
        iconColor: 'text-emerald-300',
      },
      {
        Icon: Heart,
        iconWrap: 'border-pink-300/30 bg-pink-400/10 shadow-[0_0_24px_rgba(244,114,182,0.2)]',
        iconColor: 'text-pink-300',
      },
      {
        Icon: BarChart3,
        iconWrap: 'border-sky-300/30 bg-sky-400/10 shadow-[0_0_24px_rgba(56,189,248,0.18)]',
        iconColor: 'text-sky-300',
      },
      {
        Icon: Bot,
        iconWrap: 'border-fuchsia-300/30 bg-fuchsia-400/10 shadow-[0_0_24px_rgba(232,121,249,0.18)]',
        iconColor: 'text-fuchsia-300',
      },
    ].map((design, index) => {
      const item = uspDisplay[index] ?? FALLBACK_SETTINGS.usp_features_payload[index];
      return {
        ...design,
        title: item.title,
        desc: item.description,
      };
    }),
  };

  const resolvedFontFamily =
    settings.font_family === 'default'
      ? 'Geist, Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
      : settings.font_family || FALLBACK_SETTINGS.font_family;

  const socialProofCopy = {
    badge: settings.testimonials_badge_en || FALLBACK_SETTINGS.testimonials_badge_en,
    title: settings.testimonials_title_en || FALLBACK_SETTINGS.testimonials_title_en,
  };

  const pricingSectionCopy = {
    title: settings.pricing_section_title_en || FALLBACK_SETTINGS.pricing_section_title_en,
    link: settings.pricing_section_link_en || FALLBACK_SETTINGS.pricing_section_link_en,
  };

  const testimonials = (settings.testimonials_payload?.length > 0
    ? settings.testimonials_payload
    : FALLBACK_SETTINGS.testimonials_payload).map((item, index) => {
      const initials = item.name
        .split(' ')
        .map((part) => part.trim()[0] || '')
        .join('')
        .slice(0, 2)
        .toUpperCase();
      const tones = ['bg-emerald-500/25 text-emerald-300', 'bg-sky-500/25 text-sky-300', 'bg-rose-500/25 text-rose-300'];
      return {
        quote: item.quote,
        name: item.name,
        role: item.role || 'EZ Meta User',
        initials,
        avatarTone: tones[index % tones.length],
      };
    });

  const pricingPreview = plans.slice(0, 3);
  const defaultFaqs: FaqItem[] = [
    { id: 'q1', question_bm: t.faq1q, answer_bm: t.faq1a, question_en: t.faq1q, answer_en: t.faq1a, sort_order: 1 },
    { id: 'q2', question_bm: t.faq2q, answer_bm: t.faq2a, question_en: t.faq2q, answer_en: t.faq2a, sort_order: 2 },
  ];
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  useEffect(() => {
    if (!settings.popup_enabled) return;
    if (typeof window === 'undefined') return;

    const now = Date.now();
    const startAt = settings.popup_start_date ? Date.parse(settings.popup_start_date) : Number.NaN;
    const endAt = settings.popup_end_date ? Date.parse(settings.popup_end_date) : Number.NaN;
    if (!Number.isNaN(startAt) && now < startAt) return;
    if (!Number.isNaN(endAt) && now > endAt) return;

    const storageKey = 'ezmeta_marketing_popup_seen';
    if (window.sessionStorage.getItem(storageKey) === '1') return;

    const timer = window.setTimeout(() => setShowPopup(true), 900);
    return () => window.clearTimeout(timer);
  }, [settings.popup_enabled, settings.popup_start_date, settings.popup_end_date]);

  const closePopup = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('ezmeta_marketing_popup_seen', '1');
    }
    setShowPopup(false);
  };

  return (
    <main className="cyber-grid relative min-h-[calc(100vh-128px)] overflow-hidden text-slate-100">
      <style jsx global>{`
        :root {
          --ez-primary-theme: ${settings.primary_theme_color || FALLBACK_SETTINGS.primary_theme_color};
          --ez-highlight-color: ${settings.highlight_color || FALLBACK_SETTINGS.highlight_color};
          --primary-color: ${settings.highlight_color || FALLBACK_SETTINGS.highlight_color};
          --ez-button-bg: ${settings.button_bg_color || FALLBACK_SETTINGS.button_bg_color};
          --ez-button-text: ${settings.button_text_color || FALLBACK_SETTINGS.button_text_color};
          --ez-font-family: ${resolvedFontFamily};
          --ez-pricing-button-bg: ${settings.pricing_button_bg_color || settings.button_bg_color || FALLBACK_SETTINGS.button_bg_color};
          --ez-pricing-button-text: ${settings.pricing_button_text_color || settings.button_text_color || FALLBACK_SETTINGS.button_text_color};
        }
        body {
          font-family: var(--ez-font-family);
        }
      `}</style>
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <div className="border-b border-emerald-400/20 bg-slate-950/75 px-4 py-2 text-center text-xs tracking-[0.22em] text-emerald-200/90 uppercase">
        {alertBanner}
      </div>

      <section className="relative px-4 pb-20 pt-20 md:pb-24 md:pt-28">
        <motion.div
          key="en"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="cyber-panel p-8 md:p-10">
            <h1 className="font-display text-4xl leading-tight text-slate-100 md:text-6xl">{parseHighlightText(heroHeadline, highlightColor)}</h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">{parseHighlightText(heroSubheadline, highlightColor)}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button className="cyber-glow" style={{ backgroundColor: 'var(--ez-button-bg)', color: 'var(--ez-button-text)' }}>
                  {t.heroCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-emerald-300/60 text-emerald-200 hover:bg-emerald-500/10" style={{ borderColor: 'var(--ez-primary-theme)', color: 'var(--ez-primary-theme)' }}>
                  {t.heroSubCta}
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-emerald-400/15 bg-slate-950/70 p-3">
                  <p className="text-lg font-semibold" style={{ color: 'var(--ez-primary-theme)' }}>{metric.value}</p>
                  <p className="text-xs text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-2xl shadow-[0_12px_50px_rgba(0,0,0,0.45)]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-500/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-emerald-200 uppercase">
              {telegramCopy.badge}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#17212b]/85 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 text-xs font-bold text-slate-950">EZ</div>
                <div>
                  <p className="text-sm font-semibold text-white">EZMeta Alert Bot</p>
                  <p className="text-[11px] text-slate-400">bot</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#1e2c3a]/95 p-4 text-[13px] leading-7 text-slate-300">
                <p className="font-semibold text-white">{telegramCopy.reportTitle}</p>
                <p>🗓 14/03/2026 08:00</p>
                <br />
                <p className="font-semibold text-white">{telegramCopy.summary}</p>
                <p>• Spend: <span className="font-semibold text-emerald-300">RM 329.20</span></p>
                <p>• ROAS: <span className="font-semibold text-emerald-300">3.72×</span></p>
                <p>• Conv: <span className="font-semibold text-white">136</span></p>
                <br />
                <p className="font-semibold text-white">🏆 Winning Ads</p>
                <p>⭐⭐ Skincare Bundle — Score <span className="font-semibold text-emerald-300">100/100</span></p>
                <p>{telegramCopy.winnerHint}</p>
                <br />
                <p className="font-semibold text-white">{telegramCopy.fatigueTitle}</p>
                <p className="font-medium text-rose-300">{telegramCopy.fatigueFlag}</p>
                <p>{telegramCopy.fatigueDesc}</p>
                <br />
                <p className="font-semibold text-white">{telegramCopy.budgetTitle}</p>
                <p className="font-medium text-amber-300">{telegramCopy.budgetFlag}</p>
                <p>{telegramCopy.budgetDesc}</p>
                <p className="mt-2 text-right text-[10px] text-slate-500">08:00 ✓✓</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {settings.ticker_enabled ? (
        <section className="relative overflow-hidden border-y border-[#121212] bg-slate-950/65 py-3">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: Math.max(8, settings.ticker_speed_seconds || 26), ease: 'linear', repeat: Infinity }}
            className="flex w-max gap-6 whitespace-nowrap"
          >
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2 text-xs tracking-[0.16em] text-slate-300 uppercase">
                <Radar className="h-3.5 w-3.5" style={{ color: 'var(--ez-primary-theme)' }} />
                {item}
              </span>
            ))}
          </motion.div>
        </section>
      ) : null}

      <section id="features" className="relative overflow-hidden border-t border-[#121212] bg-[#050B1A] px-4 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-3 text-center text-4xl font-extrabold text-white md:text-5xl">
            {parseHighlightText(featureSectionCopy.heading, highlightColor)}
          </h2>
          <p className="mb-12 text-center text-base text-slate-400 md:text-lg">
            {parseHighlightText(featureSectionCopy.subheading, highlightColor)}
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featureSectionCopy.cards.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-slate-800 bg-[#0a0c14] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_30px_rgba(15,23,42,0.35)] backdrop-blur-xl transition hover:border-slate-700"
              >
                <div className={`mb-6 inline-flex rounded-xl border p-3 ${item.iconWrap}`}>
                  <item.Icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{parseHighlightText(item.title, highlightColor)}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{parseHighlightText(item.desc, highlightColor)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#121212] bg-[#0A0A0A] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--ez-primary-theme)' }}>
            {parseHighlightText(socialProofCopy.badge, highlightColor)}
          </p>
          <h2 className="font-display mb-10 text-4xl text-white md:text-5xl">{parseHighlightText(socialProofCopy.title, highlightColor)}</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-2xl border border-[#121212] bg-slate-900/45 p-6 backdrop-blur-xl">
              <Activity className="h-4 w-4 text-emerald-300" />
              <div className="mt-3 text-yellow-300">★★★★★</div>
              <p className="mt-3 text-lg leading-8 text-slate-200">“{item.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${item.avatarTone}`}>
                  {item.initials}
                </div>
                <div>
                  <p className="text-base font-semibold tracking-[0.02em] text-slate-100">{item.name}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-b border-[#121212] bg-slate-950/30 px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="font-display text-4xl text-white md:text-6xl">{parseHighlightText(pricingSectionCopy.title, highlightColor)}</h2>
            <Link href="/pricing" className="text-sm text-emerald-200 hover:text-emerald-100">
              {parseHighlightText(pricingSectionCopy.link, highlightColor)}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPreview.map((plan) => (
              <motion.div key={plan.key} whileHover={{ y: -8 }} className={`cyber-panel p-6 ${plan.popular ? 'cyber-glow border-emerald-300/50' : ''}`}>
                {plan.popular ? (
                  <span className="inline-block rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950">{t.mostPopular}</span>
                ) : null}
                <h3 className="mt-4 text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
                {plan.accountOffer ? <p className="mt-3 text-sm font-medium text-slate-100">{plan.accountOffer}</p> : null}
                <p className="text-sm" style={{ color: 'var(--ez-primary-theme)' }}>
                  {`Bonus: +${plan.bonusAccounts} Accounts`}
                </p>
                <p className="mt-4 text-3xl font-bold text-emerald-200">
                  RM{plan.price}
                  <span className="ml-1 text-sm font-normal text-slate-400">/mo</span>
                </p>
                <ul className="mt-5 min-h-[320px] space-y-2 text-sm">
                  {orderedComparisonFeatures.map((feature) => {
                    const included = plan.benefits.includes(feature);
                    return (
                      <li key={`${plan.key}-${feature}`} className={`flex items-center gap-2 ${included ? 'text-slate-100' : 'text-slate-400 opacity-20'}`}>
                        {included ? <Check className="h-4 w-4 text-emerald-300" /> : <X className="h-4 w-4 text-rose-300/50" />}
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6">
                  {plan.key === 'agency' ? (
                    <a href={whatsappHref} target="_blank" rel="noreferrer">
                      <Button
                        variant="outline"
                        className="w-full hover:bg-emerald-500/10"
                        style={
                          settings.pricing_button_override_enabled
                            ? { borderColor: 'var(--ez-pricing-button-bg)', color: 'var(--ez-pricing-button-bg)' }
                            : { borderColor: 'var(--ez-primary-theme)', color: 'var(--ez-primary-theme)' }
                        }
                      >
                        {t.agencyCta}
                      </Button>
                    </a>
                  ) : (
                    <Link href={plan.key === 'starter' ? '/signup' : '/pricing'}>
                      <Button
                        className="w-full"
                        style={
                          settings.pricing_button_override_enabled
                            ? { backgroundColor: 'var(--ez-pricing-button-bg)', color: 'var(--ez-pricing-button-text)' }
                            : { backgroundColor: 'var(--ez-button-bg)', color: 'var(--ez-button-text)' }
                        }
                      >
                        {plan.key === 'starter' ? t.starterCta : t.proCta}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#121212] bg-slate-950/55 px-4 pb-24 pt-20 md:pb-32 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <h3 className="font-display mb-7 text-4xl text-white md:text-5xl">{parseHighlightText(t.faqTitle, highlightColor)}</h3>
          <Accordion type="single" collapsible>
            {displayFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-[#1a1a1a] px-0">
                <AccordionTrigger className="text-left text-xl text-slate-100 hover:no-underline">
                  {parseHighlightText(faq.question_en, highlightColor)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base text-slate-300">
                  {parseHighlightText(faq.answer_en, highlightColor)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {showPopup ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="cyber-panel w-full max-w-lg p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Limited Campaign</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">
                  {parseHighlightText(settings.popup_headline_en || FALLBACK_SETTINGS.popup_headline_en, highlightColor)}
                </h3>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="rounded-md border border-slate-700 p-1.5 text-slate-300 hover:text-white"
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {parseHighlightText(settings.popup_description_en || FALLBACK_SETTINGS.popup_description_en, highlightColor)}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={settings.popup_redirect_url || '/pricing'}
                onClick={closePopup}
                className="inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 font-semibold"
                style={{ backgroundColor: 'var(--ez-button-bg)', color: 'var(--ez-button-text)' }}
              >
                {parseHighlightText(settings.popup_button_text_en || FALLBACK_SETTINGS.popup_button_text_en, highlightColor)}
              </Link>
              <button
                type="button"
                onClick={closePopup}
                className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 px-4 py-2.5 text-slate-200 hover:bg-slate-900"
              >
                {'Maybe Later'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <FeedbackWidget />
    </main>
  );
}

