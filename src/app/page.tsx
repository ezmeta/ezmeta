'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Check, LineChart, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { landingDictionary } from '@/lib/i18n/landing';
import { useLanguage } from '@/components/providers/language-provider';

type LandingSettings = {
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

const FALLBACK_SETTINGS: LandingSettings = {
  hero_headline_bm: 'Hentikan Pembaziran Bajet Iklan. Biar AI Optimumkan Meta Ads Anda.',
  hero_headline_en: 'Stop Wasting Ad Spend. Let AI Optimize Your Meta Ads.',
  hero_subheadline_bm: 'EZ Meta menganalisis prestasi iklan dan menjana creative untuk tingkatkan ROI anda.',
  hero_subheadline_en: 'EZ Meta analyzes ad performance and generates creatives that improve ROI.',
  pricing_starter_price: 49,
  pricing_pro_price: 99,
  pricing_agency_price: 199,
  pricing_starter_benefits_bm: ['1 Ad Account', 'Dashboard Live (Real-time metrics)', 'Telegram Alerts (Notifikasi harian)', 'Laporan BM Harian', 'AI Recommendations (Asas)'],
  pricing_starter_benefits_en: ['1 Ad Account', 'Live Dashboard (Real-time metrics)', 'Telegram Alerts (Daily notifications)', 'Daily BM Report', 'AI Recommendations (Basic)'],
  pricing_pro_benefits_bm: ['3 Ad Accounts', 'Dashboard Live (Real-time metrics)', 'Telegram Alerts (Notifikasi harian)', 'Laporan BM Harian', 'AI Recommendations (Asas)', 'Winning Ad Detector', 'Creative Fatigue Detector', 'Budget Tracker & Optimization', 'Campaign Health Score (Gred A–D)', 'Weekly Report (Automatik setiap Ahad)'],
  pricing_pro_benefits_en: ['3 Ad Accounts', 'Live Dashboard (Real-time metrics)', 'Telegram Alerts (Daily notifications)', 'Daily BM Report', 'AI Recommendations (Basic)', 'Winning Ad Detector', 'Creative Fatigue Detector', 'Budget Tracker & Optimization', 'Campaign Health Score (A–D)', 'Weekly Report (Automated every Sunday)'],
  pricing_agency_benefits_bm: ['Unlimited Ad Accounts', 'Dashboard Live (Real-time metrics)', 'Telegram Alerts (Notifikasi harian)', 'Laporan BM Harian', 'AI Recommendations (Asas)', 'Winning Ad Detector', 'Creative Fatigue Detector', 'Budget Tracker & Optimization', 'Campaign Health Score (Gred A–D)', 'Weekly Report (Automatik setiap Ahad)', 'Multi-client Dashboard', 'AI Copywriter BM', '1-Click Optimization', 'Priority Support', 'Custom Branding'],
  pricing_agency_benefits_en: ['Unlimited Ad Accounts', 'Live Dashboard (Real-time metrics)', 'Telegram Alerts (Daily notifications)', 'Daily BM Report', 'AI Recommendations (Basic)', 'Winning Ad Detector', 'Creative Fatigue Detector', 'Budget Tracker & Optimization', 'Campaign Health Score (A–D)', 'Weekly Report (Automated every Sunday)', 'Multi-client Dashboard', 'AI Copywriter BM', '1-Click Optimization', 'Priority Support', 'Custom Branding'],
  contact_whatsapp: '+60123456789',
  alert_banner_text_bm: '🚀 Baharu: AI Creative Studio kini menyokong penjanaan skrip video.',
  alert_banner_text_en: '🚀 New: AI Creative Studio now supports video script generation.',
};

export default function Home() {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<LandingSettings>(FALLBACK_SETTINGS);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<LandingSettings>;
        if (active) setSettings({ ...FALLBACK_SETTINGS, ...data });
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
  const starterBenefits = lang === 'bm' ? settings.pricing_starter_benefits_bm : settings.pricing_starter_benefits_en;
  const proBenefits = lang === 'bm' ? settings.pricing_pro_benefits_bm : settings.pricing_pro_benefits_en;
  const agencyBenefits = lang === 'bm' ? settings.pricing_agency_benefits_bm : settings.pricing_agency_benefits_en;
  const allFeatures = agencyBenefits;
  const whatsappHref = `https://wa.me/${settings.contact_whatsapp.replace(/[^\d]/g, '')}`;

  const plans = useMemo(
    () => [
      { name: 'Starter', price: settings.pricing_starter_price, subtitle: t.starterSubtitle, benefits: starterBenefits },
      { name: 'Pro', price: settings.pricing_pro_price, subtitle: t.proSubtitle, benefits: proBenefits, popular: true },
      { name: 'Agency', price: settings.pricing_agency_price, subtitle: t.agencySubtitle, benefits: agencyBenefits },
    ],
    [settings.pricing_starter_price, settings.pricing_pro_price, settings.pricing_agency_price, t, starterBenefits, proBenefits, agencyBenefits]
  );

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
              <motion.div key={plan.name} whileHover={{ y: -8 }} className={`rounded-2xl border bg-white/5 p-6 backdrop-blur-xl transition ${plan.popular ? 'border-emerald-400 shadow-[0_0_45px_rgba(16,185,129,0.25)]' : 'border-slate-800 hover:border-emerald-500/50'}`}>
                {plan.popular ? <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">{t.mostPopular}</span> : null}
                <h3 className="mt-4 text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-slate-300">{plan.subtitle}</p>
                <p className="mt-4 text-3xl font-extrabold text-emerald-300">RM{plan.price}<span className="text-base font-normal text-slate-400">/mo</span></p>

                <ul className="mt-5 space-y-2 text-sm">
                  {allFeatures.map((feature) => {
                    const included = plan.benefits.includes(feature);
                    return (
                      <li key={`${plan.name}-${feature}`} className={`flex items-start gap-2 ${included ? 'text-slate-200' : 'text-slate-500'}`}>
                        <span className={`mt-0.5 rounded-full p-1 ${included ? 'bg-emerald-500/20' : 'bg-slate-700/40'}`}>
                          {included ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-slate-500" />}
                        </span>
                        <span>{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6">
                  {plan.name === 'Agency' ? (
                    <a href={whatsappHref} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full border-emerald-500 text-emerald-300 hover:bg-emerald-500/10">{t.agencyCta}</Button></a>
                  ) : plan.name === 'Pro' ? (
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
            <AccordionItem value="q1" className="rounded-lg border border-slate-800 bg-slate-900/60 px-4">
              <AccordionTrigger>{t.faq1q}</AccordionTrigger>
              <AccordionContent>{t.faq1a}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="rounded-lg border border-slate-800 bg-slate-900/60 px-4">
              <AccordionTrigger>{t.faq2q}</AccordionTrigger>
              <AccordionContent>{t.faq2a}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}

