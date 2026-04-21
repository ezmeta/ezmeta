'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/stripe';
import { SUBSCRIPTION_PRICES, CREDITS_PER_PLAN } from '@/lib/stripe';
import { supabase } from '@/db/client';
import { useLanguage } from '@/components/providers/language-provider';
import { landingDictionary } from '@/lib/i18n/landing';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { buildPricingModel, EMPTY_PRICING_SETTINGS, type PricingSettings } from '@/lib/pricing-model';

type FaqItem = {
  id: string;
  question_bm: string;
  answer_bm: string;
  question_en: string;
  answer_en: string;
  sort_order: number;
};

export default function PricingPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = landingDictionary[lang];

  const [settings, setSettings] = useState<PricingSettings>(EMPTY_PRICING_SETTINGS);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loadingPlan, setLoadingPlan] = useState<'starter' | 'pro' | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, faqsRes] = await Promise.all([fetch('/api/site-settings', { cache: 'no-store' }), fetch('/api/faqs', { cache: 'no-store' })]);

        if (settingsRes.ok) {
          const data = (await settingsRes.json()) as PricingSettings;
          setSettings(data);
        }

        if (faqsRes.ok) {
          const faqData = (await faqsRes.json()) as FaqItem[];
          setFaqs(faqData);
        }
      } catch (error) {
        console.error('Failed to load pricing data:', error);
      }
    }

    void loadData();
  }, []);

  const { plans, allFeatures } = useMemo(() => buildPricingModel(settings, lang), [settings, lang]);

  async function handleSubscribe(plan: 'starter' | 'pro' | 'agency') {
    if (plan === 'agency') {
      window.open(`https://wa.me/${settings.contact_whatsapp.replace(/[^\d]/g, '')}`, '_blank');
      return;
    }

    try {
      setLoadingPlan(plan);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/pricing');
        return;
      }

      const { data: profile } = await (supabase as any).from('profiles').select('email').eq('user_id', user.id).single();
      const profileEmail = (profile as { email?: string } | null)?.email;
      if (!profileEmail) throw new Error('User profile not found');

      if (plan === 'starter') {
        await (supabase as any)
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'active',
            ai_credits: CREDITS_PER_PLAN.free,
            ai_credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          } as any)
          .eq('user_id', user.id);
        router.push('/dashboard');
        return;
      }

      const successUrl = `${window.location.origin}/dashboard?subscription=success`;
      const cancelUrl = `${window.location.origin}/pricing?subscription=canceled`;
      const checkoutUrl = await createCheckoutSession(user.id, profileEmail, SUBSCRIPTION_PRICES.PRO.id, successUrl, cancelUrl);
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <main className="min-h-[calc(100vh-128px)] bg-transparent text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-15" />

      <section className="relative px-4 pb-12 pt-20 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">{t.pricingTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            {lang === 'bm'
              ? 'Semua pakej diselaras secara automatik terus dari CMS Admin anda.'
              : 'All plans are synced automatically from your Admin CMS settings.'}
          </p>
        </div>
      </section>

      <section className="relative px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-2xl border bg-white/5 p-6 backdrop-blur-xl transition ${plan.popular ? 'border-emerald-400 shadow-[0_0_45px_rgba(16,185,129,0.25)]' : 'border-slate-800 hover:border-emerald-500/50'}`}
            >
              {plan.popular ? <div className="mb-3 inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">{t.mostPopular}</div> : null}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.key === 'starter' ? t.starterSubtitle : plan.key === 'pro' ? t.proSubtitle : t.agencySubtitle}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">RM{plan.price}</span>
                <span className="ml-1 text-sm text-slate-400">/month</span>
              </div>

              <ul className="mt-6 space-y-2">
                {allFeatures.map((feature) => {
                  const included = plan.benefits.includes(feature);
                  return (
                    <li key={`${plan.key}-${feature}`} className={`flex items-start gap-2 text-sm ${included ? 'text-slate-200' : 'text-slate-500'}`}>
                      {included ? <Check className="mt-0.5 h-4 w-4 text-emerald-400" /> : <X className="mt-0.5 h-4 w-4 text-slate-600" />}
                      <span>{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <Button
                className="mt-6 w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                onClick={() => void handleSubscribe(plan.key)}
                disabled={loadingPlan !== null}
              >
                {loadingPlan === plan.key
                  ? lang === 'bm'
                    ? 'Memproses...'
                    : 'Processing...'
                  : plan.key === 'starter'
                    ? t.starterCta
                    : plan.key === 'pro'
                      ? t.proCta
                      : t.agencyCta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-white">{t.faqTitle}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-4">
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
