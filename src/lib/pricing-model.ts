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

export type PricingLang = 'bm' | 'en';

export type PlanKey = 'starter' | 'pro' | 'agency';

export type PricingPlanModel = {
  key: PlanKey;
  name: string;
  description: string;
  accountOffer: string;
  bonusAccounts: number;
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

function uniqOrdered(items: string[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (item && !out.includes(item)) out.push(item);
  }
  return out;
}

function getAccountOffer(raw: string[]): string {
  const found = raw.find((item) => /^\d+\s*ad\s*accounts?$/i.test(item.trim()) || /^\d+\s*akaun$/i.test(item.trim()));
  return found ?? '';
}

export function buildPricingModel(settings: PricingSettings, lang: PricingLang): {
  plans: PricingPlanModel[];
  allFeatures: string[];
} {
  const starterRaw = lang === 'bm' ? settings.pricing_starter_benefits_bm : settings.pricing_starter_benefits_en;
  const proRaw = lang === 'bm' ? settings.pricing_pro_benefits_bm : settings.pricing_pro_benefits_en;
  const agencyRaw = lang === 'bm' ? settings.pricing_agency_benefits_bm : settings.pricing_agency_benefits_en;

  const sortedBase = [
    {
      key: 'starter' as const,
      name: lang === 'bm' ? settings.starter_name_bm : settings.starter_name_en,
      description: lang === 'bm' ? settings.starter_desc_bm : settings.starter_desc_en,
      bonusAccounts: settings.starter_bonus_accounts,
      price: settings.pricing_starter_price,
      raw: starterRaw,
    },
    {
      key: 'pro' as const,
      name: lang === 'bm' ? settings.pro_name_bm : settings.pro_name_en,
      description: lang === 'bm' ? settings.pro_desc_bm : settings.pro_desc_en,
      bonusAccounts: settings.pro_bonus_accounts,
      price: settings.pricing_pro_price,
      raw: proRaw,
      popular: true,
    },
    {
      key: 'agency' as const,
      name: lang === 'bm' ? settings.agency_name_bm : settings.agency_name_en,
      description: lang === 'bm' ? settings.agency_desc_bm : settings.agency_desc_en,
      bonusAccounts: settings.agency_bonus_accounts,
      price: settings.pricing_agency_price,
      raw: agencyRaw,
    },
  ].sort((a, b) => a.price - b.price);

  const plans: PricingPlanModel[] = sortedBase.map((plan) => {
    return {
      key: plan.key,
      name: plan.name,
      description: plan.description,
      accountOffer: getAccountOffer(plan.raw),
      bonusAccounts: plan.bonusAccounts,
      price: plan.price,
      benefits: uniqOrdered(plan.raw),
      popular: plan.popular,
    };
  });

  const allFeatures = uniqOrdered(plans.flatMap((plan) => plan.benefits));

  return { plans, allFeatures };
}

