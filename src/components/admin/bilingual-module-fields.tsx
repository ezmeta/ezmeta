'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type Lang = 'bm' | 'en';

type PopupFieldsProps = {
  popup_headline_bm: string;
  popup_headline_en: string;
  popup_description_bm: string;
  popup_description_en: string;
  popup_button_text_bm: string;
  popup_button_text_en: string;
};

type ContentFieldsProps = {
  hero_headline_bm: string;
  hero_headline_en: string;
  hero_subheadline_bm: string;
  hero_subheadline_en: string;
  alert_banner_text_bm: string;
  alert_banner_text_en: string;
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
  ticker_items_bm: string[];
  ticker_items_en: string[];
};

type PricingCopyFieldsProps = {
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
};

type UspFieldsProps = {
  items: Array<{
    icon: string;
    title_bm: string;
    title_en: string;
    description_bm: string;
    description_en: string;
  }>;
};

type PricingBenefitsFieldsProps = {
  pricing_starter_benefits_bm: string[];
  pricing_starter_benefits_en: string[];
  pricing_pro_benefits_bm: string[];
  pricing_pro_benefits_en: string[];
  pricing_agency_benefits_bm: string[];
  pricing_agency_benefits_en: string[];
};

export function PopupLanguageFields(initial: PopupFieldsProps) {
  const [lang, setLang] = useState<Lang>('bm');
  const [draft, setDraft] = useState({
    bm: {
      headline: initial.popup_headline_bm,
      description: initial.popup_description_bm,
      buttonText: initial.popup_button_text_bm,
    },
    en: {
      headline: initial.popup_headline_en,
      description: initial.popup_description_en,
      buttonText: initial.popup_button_text_en,
    },
  });

  const active = draft[lang];

  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm text-slate-300">
        <span>Language</span>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="bm">BM</option>
          <option value="en">EN</option>
        </select>
      </label>

      <input
        value={active.headline}
        onChange={(event) =>
          setDraft((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], headline: event.target.value },
          }))
        }
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        placeholder={lang === 'bm' ? 'Popup headline (BM)' : 'Popup headline (EN)'}
      />
      <textarea
        value={active.description}
        onChange={(event) =>
          setDraft((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], description: event.target.value },
          }))
        }
        rows={3}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        placeholder={lang === 'bm' ? 'Popup description (BM)' : 'Popup description (EN)'}
      />
      <input
        value={active.buttonText}
        onChange={(event) =>
          setDraft((prev) => ({
            ...prev,
            [lang]: { ...prev[lang], buttonText: event.target.value },
          }))
        }
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        placeholder={lang === 'bm' ? 'Popup button text (BM)' : 'Popup button text (EN)'}
      />

      <input type="hidden" name="popup_headline_bm" value={draft.bm.headline} />
      <input type="hidden" name="popup_headline_en" value={draft.en.headline} />
      <input type="hidden" name="popup_description_bm" value={draft.bm.description} />
      <input type="hidden" name="popup_description_en" value={draft.en.description} />
      <input type="hidden" name="popup_button_text_bm" value={draft.bm.buttonText} />
      <input type="hidden" name="popup_button_text_en" value={draft.en.buttonText} />
    </div>
  );
}

export function ContentLanguageFields(initial: ContentFieldsProps) {
  const [lang, setLang] = useState<Lang>('bm');
  const [draft, setDraft] = useState({
    bm: {
      heroHeadline: initial.hero_headline_bm,
      heroSubheadline: initial.hero_subheadline_bm,
      alertBanner: initial.alert_banner_text_bm,
      featureHeading: initial.feature_heading_bm,
      featureSubheading: initial.feature_subheading_bm,
      testimonialsBadge: initial.testimonials_badge_bm,
      testimonialsTitle: initial.testimonials_title_bm,
      pricingSectionTitle: initial.pricing_section_title_bm,
      pricingSectionLink: initial.pricing_section_link_bm,
      tickerItems: initial.ticker_items_bm.length > 0 ? initial.ticker_items_bm : [''],
    },
    en: {
      heroHeadline: initial.hero_headline_en,
      heroSubheadline: initial.hero_subheadline_en,
      alertBanner: initial.alert_banner_text_en,
      featureHeading: initial.feature_heading_en,
      featureSubheading: initial.feature_subheading_en,
      testimonialsBadge: initial.testimonials_badge_en,
      testimonialsTitle: initial.testimonials_title_en,
      pricingSectionTitle: initial.pricing_section_title_en,
      pricingSectionLink: initial.pricing_section_link_en,
      tickerItems: initial.ticker_items_en.length > 0 ? initial.ticker_items_en : [''],
    },
  });

  const active = draft[lang];
  const bmTicker = useMemo(() => draft.bm.tickerItems.map((item) => item.trim()).filter(Boolean).join('\n'), [draft.bm.tickerItems]);
  const enTicker = useMemo(() => draft.en.tickerItems.map((item) => item.trim()).filter(Boolean).join('\n'), [draft.en.tickerItems]);

  const updateField = (field: Exclude<keyof (typeof draft)['bm'], 'tickerItems'>, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-5">
      <label className="block space-y-1 text-sm text-slate-300">
        <span>Language</span>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="bm">BM</option>
          <option value="en">EN</option>
        </select>
      </label>

      <div className="space-y-3">
        <input
          value={active.heroHeadline}
          onChange={(event) => updateField('heroHeadline', event.target.value)}
          placeholder={lang === 'bm' ? 'Contoh: Hentikan [Pembaziran] Bajet' : 'Example: Stop [Wasting] Ad Spend'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <textarea
          value={active.heroSubheadline}
          onChange={(event) => updateField('heroSubheadline', event.target.value)}
          rows={3}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.alertBanner}
          onChange={(event) => updateField('alertBanner', event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.featureHeading}
          onChange={(event) => updateField('featureHeading', event.target.value)}
          placeholder={lang === 'bm' ? 'Feature section heading (BM)' : 'Feature section heading (EN)'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.featureSubheading}
          onChange={(event) => updateField('featureSubheading', event.target.value)}
          placeholder={lang === 'bm' ? 'Feature section subheading (BM)' : 'Feature section subheading (EN)'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.testimonialsBadge}
          onChange={(event) => updateField('testimonialsBadge', event.target.value)}
          placeholder={lang === 'bm' ? 'Testimonials badge (BM)' : 'Testimonials badge (EN)'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.testimonialsTitle}
          onChange={(event) => updateField('testimonialsTitle', event.target.value)}
          placeholder={lang === 'bm' ? 'Testimonials title (BM)' : 'Testimonials title (EN)'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.pricingSectionTitle}
          onChange={(event) => updateField('pricingSectionTitle', event.target.value)}
          placeholder={lang === 'bm' ? 'Pricing section title (BM)' : 'Pricing section title (EN)'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          value={active.pricingSectionLink}
          onChange={(event) => updateField('pricingSectionLink', event.target.value)}
          placeholder={lang === 'bm' ? 'Pricing section link text (BM)' : 'Pricing section link text (EN)'}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-200">
          {lang === 'bm' ? 'Ticker Items BM (Dynamic List)' : 'Ticker Items EN (Dynamic List)'}
        </label>
        <div className="space-y-2">
          {active.tickerItems.map((item, index) => (
            <div key={`${lang}-${index}`} className="flex gap-2">
              <input
                value={item}
                onChange={(event) => {
                  const next = [...active.tickerItems];
                  next[index] = event.target.value;
                  setDraft((prev) => ({
                    ...prev,
                    [lang]: {
                      ...prev[lang],
                      tickerItems: next,
                    },
                  }));
                }}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 text-slate-300"
                onClick={() => {
                  const next = active.tickerItems.length <= 1 ? active.tickerItems : active.tickerItems.filter((_, i) => i !== index);
                  setDraft((prev) => ({
                    ...prev,
                    [lang]: {
                      ...prev[lang],
                      tickerItems: next,
                    },
                  }));
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="border-emerald-400/40 text-emerald-200"
            onClick={() => {
              setDraft((prev) => ({
                ...prev,
                [lang]: {
                  ...prev[lang],
                  tickerItems: [...prev[lang].tickerItems, ''],
                },
              }));
            }}
          >
            {lang === 'bm' ? '+ Add BM Item' : '+ Add EN Item'}
          </Button>
        </div>
      </div>

      <input type="hidden" name="hero_headline_bm" value={draft.bm.heroHeadline} />
      <input type="hidden" name="hero_headline_en" value={draft.en.heroHeadline} />
      <input type="hidden" name="hero_subheadline_bm" value={draft.bm.heroSubheadline} />
      <input type="hidden" name="hero_subheadline_en" value={draft.en.heroSubheadline} />
      <input type="hidden" name="alert_banner_text_bm" value={draft.bm.alertBanner} />
      <input type="hidden" name="alert_banner_text_en" value={draft.en.alertBanner} />
      <input type="hidden" name="feature_heading_bm" value={draft.bm.featureHeading} />
      <input type="hidden" name="feature_heading_en" value={draft.en.featureHeading} />
      <input type="hidden" name="feature_subheading_bm" value={draft.bm.featureSubheading} />
      <input type="hidden" name="feature_subheading_en" value={draft.en.featureSubheading} />
      <input type="hidden" name="testimonials_badge_bm" value={draft.bm.testimonialsBadge} />
      <input type="hidden" name="testimonials_badge_en" value={draft.en.testimonialsBadge} />
      <input type="hidden" name="testimonials_title_bm" value={draft.bm.testimonialsTitle} />
      <input type="hidden" name="testimonials_title_en" value={draft.en.testimonialsTitle} />
      <input type="hidden" name="pricing_section_title_bm" value={draft.bm.pricingSectionTitle} />
      <input type="hidden" name="pricing_section_title_en" value={draft.en.pricingSectionTitle} />
      <input type="hidden" name="pricing_section_link_bm" value={draft.bm.pricingSectionLink} />
      <input type="hidden" name="pricing_section_link_en" value={draft.en.pricingSectionLink} />
      <textarea name="ticker_items_bm" value={bmTicker} readOnly className="sr-only" />
      <textarea name="ticker_items_en" value={enTicker} readOnly className="sr-only" />
    </div>
  );
}

export function PricingLanguageFields(initial: PricingCopyFieldsProps) {
  const [lang, setLang] = useState<Lang>('bm');
  const [draft, setDraft] = useState({
    bm: {
      starterName: initial.starter_name_bm,
      proName: initial.pro_name_bm,
      agencyName: initial.agency_name_bm,
      starterDesc: initial.starter_desc_bm,
      proDesc: initial.pro_desc_bm,
      agencyDesc: initial.agency_desc_bm,
    },
    en: {
      starterName: initial.starter_name_en,
      proName: initial.pro_name_en,
      agencyName: initial.agency_name_en,
      starterDesc: initial.starter_desc_en,
      proDesc: initial.pro_desc_en,
      agencyDesc: initial.agency_desc_en,
    },
  });

  const active = draft[lang];

  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm text-slate-300">
        <span>Language</span>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="bm">BM</option>
          <option value="en">EN</option>
        </select>
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={active.starterName}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], starterName: event.target.value } }))}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder={lang === 'bm' ? 'Starter name (BM)' : 'Starter name (EN)'}
        />
        <input
          value={active.proName}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], proName: event.target.value } }))}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder={lang === 'bm' ? 'Pro name (BM)' : 'Pro name (EN)'}
        />
        <input
          value={active.agencyName}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], agencyName: event.target.value } }))}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder={lang === 'bm' ? 'Agency name (BM)' : 'Agency name (EN)'}
        />
        <textarea
          value={active.starterDesc}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], starterDesc: event.target.value } }))}
          rows={2}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder={lang === 'bm' ? 'Starter desc (BM)' : 'Starter desc (EN)'}
        />
        <textarea
          value={active.proDesc}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], proDesc: event.target.value } }))}
          rows={2}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder={lang === 'bm' ? 'Pro desc (BM)' : 'Pro desc (EN)'}
        />
        <textarea
          value={active.agencyDesc}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], agencyDesc: event.target.value } }))}
          rows={2}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder={lang === 'bm' ? 'Agency desc (BM)' : 'Agency desc (EN)'}
        />
      </div>

      <input type="hidden" name="starter_name_bm" value={draft.bm.starterName} />
      <input type="hidden" name="starter_name_en" value={draft.en.starterName} />
      <input type="hidden" name="pro_name_bm" value={draft.bm.proName} />
      <input type="hidden" name="pro_name_en" value={draft.en.proName} />
      <input type="hidden" name="agency_name_bm" value={draft.bm.agencyName} />
      <input type="hidden" name="agency_name_en" value={draft.en.agencyName} />
      <input type="hidden" name="starter_desc_bm" value={draft.bm.starterDesc} />
      <input type="hidden" name="starter_desc_en" value={draft.en.starterDesc} />
      <input type="hidden" name="pro_desc_bm" value={draft.bm.proDesc} />
      <input type="hidden" name="pro_desc_en" value={draft.en.proDesc} />
      <input type="hidden" name="agency_desc_bm" value={draft.bm.agencyDesc} />
      <input type="hidden" name="agency_desc_en" value={draft.en.agencyDesc} />
    </div>
  );
}

export function UspLanguageFields({ items }: UspFieldsProps) {
  const [lang, setLang] = useState<Lang>('bm');
  const [draft, setDraft] = useState(
    Array.from({ length: 6 }).map((_, index) => {
      const item = items[index] ?? {
        icon: '',
        title_bm: '',
        title_en: '',
        description_bm: '',
        description_en: '',
      };
      return { ...item };
    })
  );

  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm text-slate-300">
        <span>Language</span>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="bm">BM</option>
          <option value="en">EN</option>
        </select>
      </label>

      <div className="space-y-3">
        {draft.map((item, index) => {
          const i = index + 1;
          const title = lang === 'bm' ? item.title_bm : item.title_en;
          const description = lang === 'bm' ? item.description_bm : item.description_en;
          return (
            <div key={`usp-${i}`} className="rounded-md border border-slate-700/80 bg-slate-950/60 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">USP Card {i}</p>
              <div className="grid gap-3 md:grid-cols-[160px_1fr_2fr]">
                <input
                  value={item.icon}
                  onChange={(event) => {
                    const next = [...draft];
                    next[index] = { ...next[index], icon: event.target.value };
                    setDraft(next);
                  }}
                  placeholder="Icon (e.g. Trophy)"
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
                <input
                  value={title}
                  onChange={(event) => {
                    const next = [...draft];
                    next[index] = lang === 'bm'
                      ? { ...next[index], title_bm: event.target.value }
                      : { ...next[index], title_en: event.target.value };
                    setDraft(next);
                  }}
                  placeholder={lang === 'bm' ? `Tajuk BM ${i}` : `Title EN ${i}`}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
                <input
                  value={description}
                  onChange={(event) => {
                    const next = [...draft];
                    next[index] = lang === 'bm'
                      ? { ...next[index], description_bm: event.target.value }
                      : { ...next[index], description_en: event.target.value };
                    setDraft(next);
                  }}
                  placeholder={lang === 'bm' ? 'Deskripsi BM' : 'Description EN'}
                  className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                />
              </div>

              <input type="hidden" name={`usp_icon_${i}`} value={item.icon} />
              <input type="hidden" name={`usp_title_bm_${i}`} value={item.title_bm} />
              <input type="hidden" name={`usp_title_en_${i}`} value={item.title_en} />
              <input type="hidden" name={`usp_description_bm_${i}`} value={item.description_bm} />
              <input type="hidden" name={`usp_description_en_${i}`} value={item.description_en} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PricingBenefitsLanguageFields(initial: PricingBenefitsFieldsProps) {
  const [lang, setLang] = useState<Lang>('bm');
  const [draft, setDraft] = useState({
    bm: {
      starter: initial.pricing_starter_benefits_bm.join('\n'),
      pro: initial.pricing_pro_benefits_bm.join('\n'),
      agency: initial.pricing_agency_benefits_bm.join('\n'),
    },
    en: {
      starter: initial.pricing_starter_benefits_en.join('\n'),
      pro: initial.pricing_pro_benefits_en.join('\n'),
      agency: initial.pricing_agency_benefits_en.join('\n'),
    },
  });

  const active = draft[lang];

  return (
    <div className="space-y-3">
      <label className="block space-y-1 text-sm text-slate-300">
        <span>Language</span>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value as Lang)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="bm">BM</option>
          <option value="en">EN</option>
        </select>
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <textarea
          value={active.starter}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], starter: event.target.value } }))}
          rows={7}
          placeholder={lang === 'bm' ? 'Starter benefits (BM)' : 'Starter benefits (EN)'}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <textarea
          value={active.pro}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], pro: event.target.value } }))}
          rows={7}
          placeholder={lang === 'bm' ? 'Pro benefits (BM)' : 'Pro benefits (EN)'}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <textarea
          value={active.agency}
          onChange={(event) => setDraft((prev) => ({ ...prev, [lang]: { ...prev[lang], agency: event.target.value } }))}
          rows={7}
          placeholder={lang === 'bm' ? 'Agency benefits (BM)' : 'Agency benefits (EN)'}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
      </div>

      <textarea name="pricing_starter_benefits_bm" value={draft.bm.starter} readOnly className="sr-only" />
      <textarea name="pricing_starter_benefits_en" value={draft.en.starter} readOnly className="sr-only" />
      <textarea name="pricing_pro_benefits_bm" value={draft.bm.pro} readOnly className="sr-only" />
      <textarea name="pricing_pro_benefits_en" value={draft.en.pro} readOnly className="sr-only" />
      <textarea name="pricing_agency_benefits_bm" value={draft.bm.agency} readOnly className="sr-only" />
      <textarea name="pricing_agency_benefits_en" value={draft.en.agency} readOnly className="sr-only" />
    </div>
  );
}

