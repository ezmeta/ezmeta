'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Crown, Radar, ShieldCheck, Sparkles } from 'lucide-react';
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
        const [settingsRes, faqsRes] = await Promise.all([
          fetch('/api/site-settings', { cache: 'no-store' }),
          fetch('/api/faqs', { cache: 'no-store' }),
        ]);

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
  const uniqueFeatures = useMemo(() => Array.from(new Set(allFeatures)), [allFeatures]);

  const pageSubtitle =
    lang === 'bm'
      ? 'Pelan dipacu data sebenar, dengan warisan ciri automatik dari Starter → Pro → Agency.'
      : 'Plans are driven by live settings, with automatic feature inheritance from Starter → Pro → Agency.';

  const faqsToRender =
    faqs.length > 0
      ? faqs
      : [
          {
            id: 'fallback-1',
            question_bm: t.faq1q,
            answer_bm: t.faq1a,
            question_en: t.faq1q,
            answer_en: t.faq1a,
            sort_order: 1,
          },
          {
            id: 'fallback-2',
            question_bm: t.faq2q,
            answer_bm: t.faq2a,
            question_en: t.faq2q,
            answer_en: t.faq2a,
            sort_order: 2,
          },
        ];

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
    <main className="cyber-grid relative min-h-[calc(100vh-128px)] overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute -left-16 top-20 h-80 w-80 rounded-full bg-emerald-400/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 top-36 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <section className="relative px-4 pb-16 pt-24 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-xs tracking-[0.18em] text-emerald-200 uppercase">
            <Radar className="h-3.5 w-3.5" />
            Mission Pricing Matrix
          </p>
          <h1 className="font-display mt-4 text-4xl tracking-tight text-white md:text-6xl">{t.pricingTitle}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">{pageSubtitle}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-slate-900/65 px-4 py-2 text-xs text-emerald-100">
            <ShieldCheck className="h-4 w-4" />
            {lang === 'bm' ? 'Subscription selamat dengan Stripe + Supabase' : 'Secure subscription flow with Stripe + Supabase'}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 md:pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            {
              title: lang === 'bm' ? 'Sinkron Automatik' : 'Automatic Sync',
              desc: lang === 'bm' ? 'Harga dan benefit terus tarik dari CMS.' : 'Pricing and benefits are pulled directly from CMS.',
              icon: Sparkles,
            },
            {
              title: lang === 'bm' ? 'Warisan Ciri' : 'Feature Inheritance',
              desc: lang === 'bm' ? 'Pelan lebih tinggi mewarisi ciri pelan bawah.' : 'Higher tiers inherit lower-tier features by default.',
              icon: Crown,
            },
            {
              title: lang === 'bm' ? 'Aktif Segera' : 'Instant Activation',
              desc: lang === 'bm' ? 'Starter aktif terus, Pro ke checkout Stripe.' : 'Starter activates immediately, Pro goes to Stripe checkout.',
              icon: Check,
            },
          ].map((item) => (
            <div key={item.title} className="cyber-panel p-4 text-left">
              <item.icon className="mb-2 h-4 w-4 text-emerald-300" />
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`cyber-panel p-6 transition ${plan.popular ? 'cyber-glow border-emerald-300/55' : 'hover:border-emerald-300/40'}`}
            >
              {plan.popular ? <div className="mb-3 inline-block rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950">{t.mostPopular}</div> : null}
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.key === 'starter' ? t.starterSubtitle : plan.key === 'pro' ? t.proSubtitle : t.agencySubtitle}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-emerald-100">RM{plan.price}</span>
                <span className="ml-1 text-sm text-slate-400">/month</span>
              </div>

              <ul className="mt-6 min-h-[260px] space-y-2">
                {uniqueFeatures.map((feature) => {
                  const included = plan.benefits.includes(feature);
                  return (
                    <li key={`${plan.key}-${feature}`} className={`flex items-start gap-2 text-sm ${included ? 'text-slate-100' : 'text-slate-500/40'}`}>
                      {included ? <Check className="mt-0.5 h-4 w-4 text-emerald-300" /> : <span className="mt-0.5 h-4 w-4 text-center text-rose-300/55">✕</span>}
                      <span>{feature}</span>
                    </li>
                  );
                })}
              </ul>

              <Button
                className="mt-6 w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
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

      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display mb-4 text-center text-3xl text-white">{t.faqTitle}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqsToRender.map((faq) => (
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

