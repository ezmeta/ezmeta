'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Bot,
  BarChart3,
  Check,
  Globe2,
  HandCoins,
  Heart,
  Radar,
  Trophy,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { landingDictionary } from '@/lib/i18n/landing';
import { useLanguage } from '@/components/providers/language-provider';
import { buildPricingModel, EMPTY_PRICING_SETTINGS, type PricingSettings } from '@/lib/pricing-model';

type LandingSettings = PricingSettings & {
  hero_headline_bm: string;
  hero_headline_en: string;
  hero_subheadline_bm: string;
  hero_subheadline_en: string;
  alert_banner_text_bm: string;
  alert_banner_text_en: string;
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
  hero_headline_bm: 'Hentikan Pembaziran Bajet Iklan. Biar AI Optimumkan Meta Ads Anda.',
  hero_headline_en: 'Stop Wasting Ad Spend. Let AI Optimize Your Meta Ads.',
  hero_subheadline_bm: 'EZ Meta menganalisis prestasi iklan dan menjana creative untuk tingkatkan ROI anda.',
  hero_subheadline_en: 'EZ Meta analyzes ad performance and generates creatives that improve ROI.',
  alert_banner_text_bm: '🚀 Baharu: AI Creative Studio kini menyokong penjanaan skrip video.',
  alert_banner_text_en: '🚀 New: AI Creative Studio now supports video script generation.',
};

export default function Home() {
  const { lang } = useLanguage();
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

  const t = landingDictionary[lang];
  const heroHeadline = lang === 'bm' ? settings.hero_headline_bm : settings.hero_headline_en;
  const heroSubheadline = lang === 'bm' ? settings.hero_subheadline_bm : settings.hero_subheadline_en;
  const alertBanner = lang === 'bm' ? settings.alert_banner_text_bm : settings.alert_banner_text_en;
  const whatsappHref = `https://wa.me/${settings.contact_whatsapp.replace(/[^\d]/g, '')}`;
  const heroSubheadlineFinal =
    lang === 'bm'
      ? 'EZMeta pantau campaigns anda 24/7, detect masalah sebelum berlaku, dan hantar laporan AI terus ke Telegram anda.'
      : heroSubheadline;

  const { plans, allFeatures } = useMemo(() => buildPricingModel(settings, lang), [settings, lang]);
  const tickerItems = useMemo(() => {
    const source = lang === 'bm' ? settings.ticker_items_bm : settings.ticker_items_en;
    const cleaned = source.map((item) => item.trim()).filter(Boolean);
    return cleaned.length > 0
      ? cleaned
      : ['AI TELEGRAM ALERTS', 'WINNING AD DETECTOR', 'CREATIVE FATIGUE MONITOR', 'BUDGET TRACKER'];
  }, [lang, settings.ticker_items_bm, settings.ticker_items_en]);
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

  const heroMetrics = lang === 'bm'
    ? [
        { label: 'Purata kenaikan ROAS', value: '+31%' },
        { label: 'Masa audit dijimatkan', value: '-11 jam/minggu' },
        { label: 'Amaran penting dihantar', value: '< 60s' },
      ]
    : [
        { label: 'Average ROAS uplift', value: '+31%' },
        { label: 'Audit time saved', value: '-11 hrs/week' },
        { label: 'Critical alert delivery', value: '< 60s' },
      ];

  const telegramCopy =
    lang === 'bm'
      ? {
          badge: 'Telegram Preview',
          reportTitle: '📊 LAPORAN HARIAN EZMeta',
          summary: '📈 Ringkasan',
          winnerHint: '💡 Scale budget +20% segera',
          fatigueTitle: '😴 Creative Fatigue',
          fatigueFlag: '🔴 Hijab Premium [KRITIKAL]',
          fatigueDesc: 'CTR turun 40% dalam 7 hari',
          budgetTitle: '💰 Budget Alert',
          budgetFlag: '🟡 Retargeting Cart: 97.2% used',
          budgetDesc: 'Hanya RM 25 berbaki',
        }
      : {
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

  const featureSectionCopy =
    lang === 'bm'
      ? {
          heading: 'AI yang faham Meta Ads lebih baik dari manusia.',
          subheading: 'Features AI yang direka khas untuk advertiser Malaysia.',
          cards: [
            {
              Icon: Trophy,
              title: 'Winning Ad Detector',
              desc: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.',
              glow: 'from-amber-300/25 to-amber-500/5',
              iconColor: 'text-amber-300',
            },
            {
              Icon: Globe2,
              title: 'Creative Fatigue Detector',
              desc: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.',
              glow: 'from-violet-300/25 to-violet-500/5',
              iconColor: 'text-violet-300',
            },
            {
              Icon: HandCoins,
              title: 'Budget Tracker',
              desc: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.',
              glow: 'from-emerald-300/25 to-emerald-500/5',
              iconColor: 'text-emerald-300',
            },
            {
              Icon: Heart,
              title: 'Campaign Health Score',
              desc: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.',
              glow: 'from-rose-300/25 to-rose-500/5',
              iconColor: 'text-rose-300',
            },
            {
              Icon: BarChart3,
              title: 'Laporan AI dalam BM',
              desc: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.',
              glow: 'from-sky-300/25 to-sky-500/5',
              iconColor: 'text-sky-300',
            },
            {
              Icon: Bot,
              title: 'AI Recommendations',
              desc: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.',
              glow: 'from-fuchsia-300/25 to-fuchsia-500/5',
              iconColor: 'text-fuchsia-300',
            },
          ],
        }
      : {
          heading: 'AI that understands Meta Ads better than manual workflows.',
          subheading: 'AI features built specifically for performance marketers.',
          cards: [
            {
              Icon: Trophy,
              title: 'Winning Ad Detector',
              desc: 'AI scans all campaigns and detects top-performing ads. Scored 0–100 with immediate alerts.',
              glow: 'from-amber-300/25 to-amber-500/5',
              iconColor: 'text-amber-300',
            },
            {
              Icon: Globe2,
              title: 'Creative Fatigue Detector',
              desc: 'Detects CTR drops, high frequency, and rising CPM before your performance declines badly.',
              glow: 'from-violet-300/25 to-violet-500/5',
              iconColor: 'text-violet-300',
            },
            {
              Icon: HandCoins,
              title: 'Budget Tracker',
              desc: 'Monitors monthly campaign budgets, alerts at 80% spend, and suggests pacing for remaining days.',
              glow: 'from-emerald-300/25 to-emerald-500/5',
              iconColor: 'text-emerald-300',
            },
            {
              Icon: Heart,
              title: 'Campaign Health Score',
              desc: 'Each campaign receives an A–D score based on ROAS, CTR, CPC, frequency, and conversions.',
              glow: 'from-rose-300/25 to-rose-500/5',
              iconColor: 'text-rose-300',
            },
            {
              Icon: BarChart3,
              title: 'AI Daily Report',
              desc: 'Daily reports in clear language, easy to understand, and directly actionable in Telegram.',
              glow: 'from-sky-300/25 to-sky-500/5',
              iconColor: 'text-sky-300',
            },
            {
              Icon: Bot,
              title: 'AI Recommendations',
              desc: 'AI provides direct optimization recommendations for each campaign.',
              glow: 'from-fuchsia-300/25 to-fuchsia-500/5',
              iconColor: 'text-fuchsia-300',
            },
          ],
        };

  const socialProofCopy =
    lang === 'bm'
      ? { badge: 'TESTIMONI', title: 'Apa kata pengguna beta.' }
      : { badge: 'TESTIMONIALS', title: 'What beta users are saying.' };

  const pricingSectionCopy =
    lang === 'bm'
      ? { title: 'Pilih Pakej Anda Sekarang', link: 'Lihat perbandingan penuh →' }
      : { title: 'Choose Your Plan Now', link: 'View full comparison →' };

  const testimonials = lang === 'bm'
    ? [
        {
          quote:
            'Sebelum ni saya kena check ads manager setiap jam. Sekarang EZMeta yang buat semua. Laporan masuk Telegram, saya baca sambil sarapan.',
          name: 'Ahmad Razif',
          role: 'Dropshipper, Selangor',
          initials: 'AR',
          avatarTone: 'bg-emerald-500/25 text-emerald-300',
        },
        {
          quote:
            'Creative Fatigue detector tu memang game changer. Dulu tak tahu kenapa CTR jatuh. Sekarang EZMeta alert awal, saya sempat tukar creative.',
          name: 'Siti Norzahira',
          role: 'E-commerce, KL',
          initials: 'SN',
          avatarTone: 'bg-sky-500/25 text-sky-300',
        },
        {
          quote:
            'Manage 8 client ads sekarang. Dulu kena manual check satu-satu. EZMeta bagi summary semua clients dalam satu laporan. Jimat masa 3 jam sehari.',
          name: 'Faizul Hakim',
          role: 'Digital Agency, Johor',
          initials: 'FH',
          avatarTone: 'bg-rose-500/25 text-rose-300',
        },
      ]
    : [
        {
          quote:
            'I used to check Ads Manager every hour. Now EZMeta handles it and sends reports to Telegram while I have breakfast.',
          name: 'Ahmad Razif',
          role: 'Dropshipper, Selangor',
          initials: 'AR',
          avatarTone: 'bg-emerald-500/25 text-emerald-300',
        },
        {
          quote:
            'The Creative Fatigue detector is a game changer. I now catch CTR drops earlier and refresh creatives in time.',
          name: 'Siti Norzahira',
          role: 'E-commerce, KL',
          initials: 'SN',
          avatarTone: 'bg-sky-500/25 text-sky-300',
        },
        {
          quote:
            'Managing 8 client ad accounts is much easier now. EZMeta consolidates all summaries into one report and saves hours daily.',
          name: 'Faizul Hakim',
          role: 'Digital Agency, Johor',
          initials: 'FH',
          avatarTone: 'bg-rose-500/25 text-rose-300',
        },
      ];

  const pricingPreview = plans.slice(0, 3);
  const defaultFaqs: FaqItem[] = [
    { id: 'q1', question_bm: t.faq1q, answer_bm: t.faq1a, question_en: t.faq1q, answer_en: t.faq1a, sort_order: 1 },
    { id: 'q2', question_bm: t.faq2q, answer_bm: t.faq2a, question_en: t.faq2q, answer_en: t.faq2a, sort_order: 2 },
  ];
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  useEffect(() => {
    if (!settings.popup_enabled) return;
    if (typeof window === 'undefined') return;
    const storageKey = 'ezmeta_marketing_popup_seen';
    if (window.sessionStorage.getItem(storageKey) === '1') return;

    const timer = window.setTimeout(() => setShowPopup(true), 900);
    return () => window.clearTimeout(timer);
  }, [settings.popup_enabled]);

  const closePopup = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('ezmeta_marketing_popup_seen', '1');
    }
    setShowPopup(false);
  };

  return (
    <main className="cyber-grid relative min-h-[calc(100vh-128px)] overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <div className="border-b border-emerald-400/20 bg-slate-950/75 px-4 py-2 text-center text-xs tracking-[0.22em] text-emerald-200/90 uppercase">
        {alertBanner}
      </div>

      <section className="relative px-4 pb-20 pt-20 md:pb-24 md:pt-28">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="cyber-panel p-8 md:p-10">
            <h1 className="font-display text-4xl leading-tight text-slate-100 md:text-6xl">
              {lang === 'bm' ? (
                <>
                  Hentikan Pembaziran Bajet Iklan. Biar AI{' '}
                  <em className="font-display text-emerald-300 not-italic italic">Optimumkan</em>{' '}
                  Meta Ads Anda.
                </>
              ) : (
                heroHeadline
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">{heroSubheadlineFinal}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button className="cyber-glow bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                  {t.heroCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-emerald-300/60 text-emerald-200 hover:bg-emerald-500/10">
                  {t.heroSubCta}
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-emerald-400/15 bg-slate-950/70 p-3">
                  <p className="text-lg font-semibold text-emerald-200">{metric.value}</p>
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

      <section className="relative overflow-hidden border-y border-[#121212] bg-slate-950/65 py-3">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
          className="flex w-max gap-6 whitespace-nowrap"
        >
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2 text-xs tracking-[0.16em] text-slate-300 uppercase">
              <Radar className="h-3.5 w-3.5 text-emerald-300" />
              {item}
            </span>
          ))}
        </motion.div>
      </section>

      <section id="features" className="relative border-t border-[#121212] bg-slate-950/35 px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-3 text-center text-4xl text-slate-100 md:text-5xl">{featureSectionCopy.heading}</h2>
          <p className="mb-10 text-center text-base text-slate-300 md:text-lg">{featureSectionCopy.subheading}</p>
          <div className="grid gap-6 md:grid-cols-3">
            {featureSectionCopy.cards.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6 }} className="cyber-panel p-6 transition hover:border-emerald-300/50">
                <div className={`mb-4 inline-flex rounded-xl border border-white/10 bg-gradient-to-br ${item.glow} p-3`}>
                  <item.Icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#121212] bg-[#0A0A0A] px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs tracking-[0.22em] text-[#00FF94] uppercase">{socialProofCopy.badge}</p>
          <h2 className="font-display mb-10 text-4xl text-white md:text-5xl">{socialProofCopy.title}</h2>
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
            <h2 className="font-display text-4xl text-white md:text-6xl">{pricingSectionCopy.title}</h2>
            <Link href="/pricing" className="text-sm text-emerald-200 hover:text-emerald-100">
              {pricingSectionCopy.link}
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
                <p className="text-sm text-[#00FF94]">
                  {lang === 'bm' ? `Bonus: +${plan.bonusAccounts} Akaun` : `Bonus: +${plan.bonusAccounts} Accounts`}
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
                      <Button variant="outline" className="w-full border-emerald-300/60 text-emerald-200 hover:bg-emerald-500/10">
                        {t.agencyCta}
                      </Button>
                    </a>
                  ) : (
                    <Link href={plan.key === 'starter' ? '/signup' : '/pricing'}>
                      <Button className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300">
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
          <h3 className="font-display mb-7 text-4xl text-white md:text-5xl">{t.faqTitle}</h3>
          <Accordion type="single" collapsible>
            {displayFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-[#1a1a1a] px-0">
                <AccordionTrigger className="text-left text-xl text-slate-100 hover:no-underline">
                  {lang === 'bm' ? faq.question_bm : faq.question_en}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base text-slate-300">{lang === 'bm' ? faq.answer_bm : faq.answer_en}</AccordionContent>
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
                  {lang === 'bm' ? settings.popup_headline_bm : settings.popup_headline_en}
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
              {lang === 'bm' ? settings.popup_description_bm : settings.popup_description_en}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={settings.popup_redirect_url || '/pricing'}
                onClick={closePopup}
                className="inline-flex w-full items-center justify-center rounded-md bg-emerald-400 px-4 py-2.5 font-semibold text-slate-950 hover:bg-emerald-300"
              >
                {lang === 'bm' ? settings.popup_button_text_bm : settings.popup_button_text_en}
              </Link>
              <button
                type="button"
                onClick={closePopup}
                className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 px-4 py-2.5 text-slate-200 hover:bg-slate-900"
              >
                {lang === 'bm' ? 'Nanti Dulu' : 'Maybe Later'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

