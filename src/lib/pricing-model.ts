export type PricingSettings = {
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
};

export type PricingLang = 'bm' | 'en';

export type PlanKey = 'starter' | 'pro' | 'agency';

export type PricingPlanModel = {
  key: PlanKey;
  name: 'Starter' | 'Pro' | 'Agency';
  price: number;
  benefits: string[];
  popular?: boolean;
};

export const EMPTY_PRICING_SETTINGS: PricingSettings = {
  pricing_starter_price: 49,
  pricing_pro_price: 99,
  pricing_agency_price: 199,
  pricing_starter_benefits_bm: [],
  pricing_starter_benefits_en: [],
  pricing_pro_benefits_bm: [],
  pricing_pro_benefits_en: [],
  pricing_agency_benefits_bm: [],
  pricing_agency_benefits_en: [],
  contact_whatsapp: '+60123456789',
};

function uniqOrdered(items: string[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (item && !out.includes(item)) out.push(item);
  }
  return out;
}

export function buildPricingModel(settings: PricingSettings, lang: PricingLang): {
  plans: PricingPlanModel[];
  allFeatures: string[];
} {
  const starterRaw = lang === 'bm' ? settings.pricing_starter_benefits_bm : settings.pricing_starter_benefits_en;
  const proRaw = lang === 'bm' ? settings.pricing_pro_benefits_bm : settings.pricing_pro_benefits_en;
  const agencyRaw = lang === 'bm' ? settings.pricing_agency_benefits_bm : settings.pricing_agency_benefits_en;

  const sortedBase = [
    { key: 'starter' as const, name: 'Starter' as const, price: settings.pricing_starter_price, raw: starterRaw },
    { key: 'pro' as const, name: 'Pro' as const, price: settings.pricing_pro_price, raw: proRaw, popular: true },
    { key: 'agency' as const, name: 'Agency' as const, price: settings.pricing_agency_price, raw: agencyRaw },
  ].sort((a, b) => a.price - b.price);

  let inherited: string[] = [];
  const plans: PricingPlanModel[] = sortedBase.map((plan) => {
    inherited = uniqOrdered([...inherited, ...plan.raw]);
    return {
      key: plan.key,
      name: plan.name,
      price: plan.price,
      benefits: inherited,
      popular: plan.popular,
    };
  });

  const allFeatures = uniqOrdered(plans.flatMap((plan) => plan.benefits));

  return { plans, allFeatures };
}

