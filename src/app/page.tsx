'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  LineChart,
  Radar,
  Sparkles,
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
  const tickerItems = lang === 'bm'
    ? ['AI Optimization Engine', 'Telegram Signal Alerts', 'ROAS Drift Detection', 'Creative Fatigue Monitor', 'Multi-Account Control']
    : ['AI Optimization Engine', 'Telegram Signal Alerts', 'ROAS Drift Detection', 'Creative Fatigue Monitor', 'Multi-Account Control'];

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

  const testimonials = lang === 'bm'
    ? [
        { quote: 'Sebelum ni saya check 7 dashboard. Sekarang semua signal penting masuk Telegram dalam satu aliran.', name: 'Aina, Growth Lead' },
        { quote: 'Kos iklan yang bocor lebih cepat dikesan. Team boleh cut rugi dalam hari yang sama, bukan hujung minggu.', name: 'Hakim, Performance Marketer' },
        { quote: 'Creative studio dia bagi idea baru yang relevan ikut data, bukan template random.', name: 'Nadia, Founder eCommerce' },
      ]
    : [
        { quote: 'We used to check seven dashboards. Now critical performance signals reach Telegram in one stream.', name: 'Aina, Growth Lead' },
        { quote: 'Ad spend leaks are detected much faster. We can cut losses the same day, not at week end.', name: 'Hakim, Performance Marketer' },
        { quote: 'The creative studio suggests angles based on live data, not generic templates.', name: 'Nadia, eCommerce Founder' },
      ];

  const pricingPreview = plans.slice(0, 3);
  const defaultFaqs: FaqItem[] = [
    { id: 'q1', question_bm: t.faq1q, answer_bm: t.faq1a, question_en: t.faq1q, answer_en: t.faq1a, sort_order: 1 },
    { id: 'q2', question_bm: t.faq2q, answer_bm: t.faq2a, question_en: t.faq2q, answer_en: t.faq2a, sort_order: 2 },
  ];
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

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
              Telegram Preview
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
                <p className="font-semibold text-white">📊 LAPORAN HARIAN EZMeta</p>
                <p>🗓 14/03/2026 08:00</p>
                <br />
                <p className="font-semibold text-white">📈 Ringkasan</p>
                <p>• Spend: <span className="font-semibold text-emerald-300">RM 329.20</span></p>
                <p>• ROAS: <span className="font-semibold text-emerald-300">3.72×</span></p>
                <p>• Conv: <span className="font-semibold text-white">136</span></p>
                <br />
                <p className="font-semibold text-white">🏆 Winning Ads</p>
                <p>⭐⭐ Skincare Bundle — Score <span className="font-semibold text-emerald-300">100/100</span></p>
                <p>💡 Scale budget +20% segera</p>
                <br />
                <p className="font-semibold text-white">😴 Creative Fatigue</p>
                <p className="font-medium text-rose-300">🔴 Hijab Premium [KRITIKAL]</p>
                <p>CTR turun 40% dalam 7 hari</p>
                <br />
                <p className="font-semibold text-white">💰 Budget Alert</p>
                <p className="font-medium text-amber-300">🟡 Retargeting Cart: 97.2% used</p>
                <p>Hanya RM 25 berbaki</p>
                <p className="mt-2 text-right text-[10px] text-slate-500">08:00 ✓✓</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden border-y border-emerald-400/15 bg-slate-950/55 py-3">
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

      <section id="features" className="relative px-4 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display mb-8 text-center text-3xl text-slate-100 md:text-4xl">{t.featuresTitle}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { Icon: BarChart3, badge: 'Realtime Ops', title: t.featureCards[0].title, desc: t.featureCards[0].desc },
              { Icon: Sparkles, badge: 'Creative Intelligence', title: t.featureCards[1].title, desc: t.featureCards[1].desc },
              { Icon: LineChart, badge: 'Predictive Action', title: t.featureCards[2].title, desc: t.featureCards[2].desc },
            ].map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6 }} className="cyber-panel p-6 transition hover:border-emerald-300/50">
                <div className="mb-4 inline-flex rounded-xl bg-emerald-500/15 p-3">
                  <item.Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <p className="mb-2 text-[11px] tracking-[0.15em] text-emerald-200 uppercase">{item.badge}</p>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="cyber-panel p-5">
              <Activity className="h-4 w-4 text-emerald-300" />
              <p className="mt-3 text-sm leading-relaxed text-slate-200">“{item.quote}”</p>
              <p className="mt-4 text-xs tracking-[0.12em] text-slate-400 uppercase">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-4 py-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl text-white md:text-4xl">{t.pricingTitle}</h2>
            <Link href="/pricing" className="text-sm text-emerald-200 hover:text-emerald-100">
              View full comparison →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPreview.map((plan) => (
              <motion.div key={plan.key} whileHover={{ y: -8 }} className={`cyber-panel p-6 ${plan.popular ? 'cyber-glow border-emerald-300/50' : ''}`}>
                {plan.popular ? (
                  <span className="inline-block rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950">{t.mostPopular}</span>
                ) : null}
                <h3 className="mt-4 text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{plan.key === 'starter' ? t.starterSubtitle : plan.key === 'pro' ? t.proSubtitle : t.agencySubtitle}</p>
                <p className="mt-4 text-3xl font-bold text-emerald-200">
                  RM{plan.price}
                  <span className="ml-1 text-sm font-normal text-slate-400">/mo</span>
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  {allFeatures.slice(0, 6).map((feature) => {
                    const included = plan.benefits.includes(feature);
                    return (
                      <li key={`${plan.key}-${feature}`} className={`flex items-center gap-2 ${included ? 'text-slate-200' : 'text-slate-500'}`}>
                        {included ? <Check className="h-4 w-4 text-emerald-300" /> : <X className="h-4 w-4 text-slate-600" />}
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

      <section className="px-4 pb-24 pt-14 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <h3 className="font-display mb-5 text-3xl text-white">{t.faqTitle}</h3>
          <Accordion type="single" collapsible className="space-y-3">
            {displayFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="cyber-panel px-4">
                <AccordionTrigger className="text-left text-slate-100 hover:no-underline">
                  {lang === 'bm' ? faq.question_bm : faq.question_en}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">{lang === 'bm' ? faq.answer_bm : faq.answer_en}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}

