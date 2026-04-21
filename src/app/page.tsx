'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Check, LineChart, Sparkles, X } from 'lucide-react';
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

  const { plans, allFeatures } = useMemo(() => buildPricingModel(settings, lang), [settings, lang]);

  return (
    <main className="min-h-[calc(100vh-128px)] bg-transparent text-slate-100">

      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-center text-sm text-slate-200">{alertBanner}</div>

      <section className="relative overflow-hidden px-4 pb-24 pt-20 md:pt-28">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[110px]" />
        <motion.div key={lang} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto max-w-5xl text-center">
          <h1 className="bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl">{heroHeadline}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 md:text-xl">{heroSubheadline}</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup"><Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">{t.heroCta} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/pricing"><Button variant="outline" className="border-emerald-500 text-emerald-300 hover:bg-emerald-500/10">{t.heroSubCta}</Button></Link>
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold">{t.featuresTitle}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[BarChart3, Sparkles, LineChart].map((Icon, idx) => (
              <motion.div key={idx} whileHover={{ y: -6 }} className="rounded-2xl border border-slate-800 bg-white/5 p-6 backdrop-blur-xl transition hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]">
                <div className="mb-4 w-fit rounded-xl bg-emerald-500/15 p-3"><Icon className="h-5 w-5 text-emerald-400" /></div>
                <h3 className="mb-2 text-lg font-semibold">{t.featureCards[idx].title}</h3>
                <p className="text-sm text-slate-300">{t.featureCards[idx].desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="pointer-events-none absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-3xl font-bold">{t.pricingTitle}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <motion.div key={plan.key} whileHover={{ y: -8 }} className={`rounded-2xl border bg-white/5 p-6 backdrop-blur-xl transition ${plan.popular ? 'border-emerald-400 shadow-[0_0_45px_rgba(16,185,129,0.25)]' : 'border-slate-800 hover:border-emerald-500/50'}`}>
                {plan.popular ? <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">{t.mostPopular}</span> : null}
                <h3 className="mt-4 text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-slate-300">{plan.key === 'starter' ? t.starterSubtitle : plan.key === 'pro' ? t.proSubtitle : t.agencySubtitle}</p>
                <p className="mt-4 text-3xl font-extrabold text-emerald-300">RM{plan.price}<span className="text-base font-normal text-slate-400">/mo</span></p>

                <ul className="mt-5 space-y-2 text-sm">
                  {allFeatures.map((feature) => {
                    const included = plan.benefits.includes(feature);
                    return (
                        <li key={`${plan.key}-${feature}`} className={`flex items-start gap-2 ${included ? 'text-slate-200' : 'text-slate-500'}`}>
                        <span className={`mt-0.5 rounded-full p-1 ${included ? 'bg-emerald-500/20' : 'bg-slate-700/40'}`}>
                          {included ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-slate-500" />}
                        </span>
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6">
                  {plan.key === 'agency' ? (
                    <a href={whatsappHref} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full border-emerald-500 text-emerald-300 hover:bg-emerald-500/10">{t.agencyCta}</Button></a>
                  ) : plan.key === 'pro' ? (
                    <Link href="/pricing"><Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">{t.proCta}</Button></Link>
                  ) : (
                    <Link href="/signup"><Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">{t.starterCta}</Button></Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-4 text-2xl font-bold">{t.faqTitle}</h3>
          <Accordion type="single" collapsible className="space-y-3">
            {(faqs.length > 0 ? faqs : [
              { id: 'q1', question_bm: t.faq1q, answer_bm: t.faq1a, question_en: t.faq1q, answer_en: t.faq1a, sort_order: 1 },
              { id: 'q2', question_bm: t.faq2q, answer_bm: t.faq2a, question_en: t.faq2q, answer_en: t.faq2a, sort_order: 2 },
            ]).map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-4">
                <AccordionTrigger>{lang === 'bm' ? faq.question_bm : faq.question_en}</AccordionTrigger>
                <AccordionContent>{lang === 'bm' ? faq.answer_bm : faq.answer_en}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}

