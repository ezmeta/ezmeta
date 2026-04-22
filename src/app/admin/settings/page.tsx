import { cookies } from 'next/headers';
import {
  getSiteSettings,
  getFaqs,
  unlockAdmin,
  saveGlobalStylesModuleSettings,
  savePricingModuleSettings,
  saveContentModuleSettings,
  saveUspModuleSettings,
  saveTestimonialsModuleSettings,
  saveFaqModuleSettings,
  savePopupModuleSettings,
} from '@/app/actions/admin-settings';
import { SaveStatusToast } from '@/components/admin/save-status-toast';
import { SettingsDynamicFields } from '@/components/admin/settings-dynamic-fields';
import {
  ContentLanguageFields,
  PopupLanguageFields,
  PricingBenefitsLanguageFields,
  PricingLanguageFields,
  UspLanguageFields,
} from '@/components/admin/bilingual-module-fields';
import { ModuleSaveButton } from '@/components/admin/module-save-button';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DateTimePicker } from '@/components/ui/date-time-picker';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get('admin_auth')?.value === 'true';
  const lang = cookieStore.get('ez_lang')?.value === 'en' ? 'en' : 'bm';
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()]);

  const uspFallback = [
    {
      icon: 'Trophy',
      title_bm: 'Winning Ad Detector',
      title_en: 'Winning Ad Detector',
      description_bm: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.',
      description_en: 'AI scans all campaigns and detects top-performing ads.',
    },
    {
      icon: 'Globe2',
      title_bm: 'Creative Fatigue Detector',
      title_en: 'Creative Fatigue Detector',
      description_bm: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.',
      description_en: 'Detect CTR drop, high frequency, and rising CPM before performance dips.',
    },
    {
      icon: 'HandCoins',
      title_bm: 'Budget Tracker',
      title_en: 'Budget Tracker',
      description_bm: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.',
      description_en: 'Monitor monthly budgets and alert when spend is near limits.',
    },
    {
      icon: 'Heart',
      title_bm: 'Campaign Health Score',
      title_en: 'Campaign Health Score',
      description_bm: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.',
      description_en: 'Each campaign receives an A-D grade based on ROAS, CTR, CPC, frequency, and conversions.',
    },
    {
      icon: 'BarChart3',
      title_bm: 'Laporan AI dalam BM',
      title_en: 'AI Reports in EN',
      description_bm: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.',
      description_en: 'Daily reports in English that are easy to understand and immediately actionable via Telegram.',
    },
    {
      icon: 'Bot',
      title_bm: 'AI Recommendations',
      title_en: 'AI Recommendations',
      description_bm: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.',
      description_en: 'Clear AI automation recommendations for every campaign.',
    },
  ];

  const rawUsp = settings.usp_features_payload ?? [];
  const uspEditorSource = Array.from({ length: 6 }).map((_, index) => {
    const current = rawUsp[index];
    const fallback = uspFallback[index];
    return {
      icon: current?.icon?.trim() ? current.icon : fallback.icon,
      title_bm: current?.title_bm?.trim() ? current.title_bm : fallback.title_bm,
      title_en: current?.title_en?.trim() ? current.title_en : fallback.title_en,
      description_bm: current?.description_bm?.trim() ? current.description_bm : fallback.description_bm,
      description_en: current?.description_en?.trim() ? current.description_en : fallback.description_en,
    };
  });

  const faqsPayload = faqs
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => `${item.question_bm}||${item.answer_bm}||${item.question_en}||${item.answer_en}`)
    .join('\n');

  const copy = {
    bm: {
      title: 'Tetapan Laman (CMS)',
      subtitle: 'Modul CMS kini collapsible untuk kurangkan scrolling.',
      adminPassword: 'Kata Laluan Admin',
      unlock: 'Buka Akses Admin',
      save: 'Simpan Modul',
    },
    en: {
      title: 'Site Settings (CMS)',
      subtitle: 'CMS modules are collapsible to reduce vertical fatigue.',
      adminPassword: 'Admin Password',
      unlock: 'Unlock Admin',
      save: 'Save Module',
    },
  }[lang];

  return (
    <div className="cyber-grid min-h-screen bg-slate-950 text-white">
      <SaveStatusToast />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-[280px_1fr]">
        <AdminSidebar
          active="settings"
          quickNav={[
            { href: '#module-global-styles', label: '01 · Global Styles', accordionValue: 'module-1' },
            { href: '#module-popup', label: '02 · Marketing Pop-up', accordionValue: 'module-2' },
            { href: '#module-content', label: '03 · Headline & Ticker', accordionValue: 'module-3' },
            { href: '#module-usp', label: '04 · USP EZ Meta Features', accordionValue: 'module-4' },
            { href: '#module-testimonials', label: '05 · Testimonials', accordionValue: 'module-5' },
            { href: '#module-pricing', label: '06 · Pricing & Plans', accordionValue: 'module-6' },
            { href: '#module-faq', label: '07 · Benefits & FAQ', accordionValue: 'module-7' },
          ]}
        />

        <main className="cyber-panel p-6">
          <h1 className="mb-1 font-display text-3xl text-white">{copy.title}</h1>
          <p className="mb-6 text-sm text-slate-300">{copy.subtitle}</p>

          {!isUnlocked ? (
            <form action={unlockAdmin} className="max-w-lg space-y-4">
              <div>
                <label htmlFor="admin_password_unlock" className="mb-1 block text-sm font-medium text-slate-200">
                  {copy.adminPassword}
                </label>
                <input
                  id="admin_password_unlock"
                  name="admin_password"
                  type="password"
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                  placeholder="Enter admin password to unlock"
                />
              </div>
              <button type="submit" className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400">
                {copy.unlock}
              </button>
            </form>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem id="module-global-styles" value="module-1" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 01</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">Global Styles</h3>
                    <p className="text-xs text-slate-400">Global colors and font family for landing UI.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={saveGlobalStylesModuleSettings} className="space-y-5">
                    <div className="flex justify-end">
                      <ModuleSaveButton label={copy.save} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>Primary Theme Color</span>
                        <input name="primary_theme_color" type="color" defaultValue={settings.primary_theme_color} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 p-1" />
                      </label>
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>Highlight Color</span>
                        <input name="highlight_color" type="color" defaultValue={settings.highlight_color} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 p-1" />
                      </label>
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>Button Background</span>
                        <input name="button_bg_color" type="color" defaultValue={settings.button_bg_color} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 p-1" />
                      </label>
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>Button Text Color</span>
                        <input name="button_text_color" type="color" defaultValue={settings.button_text_color} className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 p-1" />
                      </label>
                    </div>

                    <label className="block space-y-2 text-sm text-slate-300">
                      <span>Font Family</span>
                      <select name="font_family" defaultValue={settings.font_family} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Poppins, sans-serif">Poppins</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="system-ui, sans-serif">System UI</option>
                        <option value="Instrument Serif">Instrument Serif</option>
                        <option value="Cal Sans">Cal Sans</option>
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                        <option value="Geist Sans">Geist Sans</option>
                        <option value="Bricolage Grotesque">Bricolage Grotesque</option>
                      </select>
                    </label>
                  </form>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem id="module-popup" value="module-2" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 02</p>
                    <h3 className="mt-1 text-lg font-semibold">Marketing Pop-up</h3>
                    <p className="text-xs text-slate-400">Popup copy, CTA and schedule window.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={savePopupModuleSettings} className="space-y-5">
                    <div className="flex justify-end"><ModuleSaveButton label={copy.save} /></div>

                    <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                      <input type="hidden" name="popup_enabled_present" value="1" />
                      <input name="popup_enabled" type="checkbox" defaultChecked={settings.popup_enabled} className="h-4 w-4" />
                      Enable Pop-up
                    </label>

                    <PopupLanguageFields
                      popup_headline_bm={settings.popup_headline_bm}
                      popup_headline_en={settings.popup_headline_en}
                      popup_description_bm={settings.popup_description_bm}
                      popup_description_en={settings.popup_description_en}
                      popup_button_text_bm={settings.popup_button_text_bm}
                      popup_button_text_en={settings.popup_button_text_en}
                    />

                    <input name="popup_redirect_url" defaultValue={settings.popup_redirect_url} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                    <div className="grid gap-4 md:grid-cols-2">
                      <DateTimePicker id="popup_start_date" name="popup_start_date" defaultIsoValue={settings.popup_start_date} placeholder="Start date/time" />
                      <DateTimePicker id="popup_end_date" name="popup_end_date" defaultIsoValue={settings.popup_end_date} placeholder="End date/time" />
                    </div>
                  </form>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem id="module-content" value="module-3" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 03</p>
                    <h3 className="mt-1 text-lg font-semibold">Headline & Ticker</h3>
                    <p className="text-xs text-slate-400">Hero copy, alert banner, ticker switch and speed.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={saveContentModuleSettings} className="space-y-5">
                    <div className="flex justify-end"><ModuleSaveButton label={copy.save} /></div>
                    <ContentLanguageFields
                      hero_headline_bm={settings.hero_headline_bm}
                      hero_headline_en={settings.hero_headline_en}
                      hero_subheadline_bm={settings.hero_subheadline_bm}
                      hero_subheadline_en={settings.hero_subheadline_en}
                      alert_banner_text_bm={settings.alert_banner_text_bm}
                      alert_banner_text_en={settings.alert_banner_text_en}
                      feature_heading_bm={settings.feature_heading_bm}
                      feature_heading_en={settings.feature_heading_en}
                      feature_subheading_bm={settings.feature_subheading_bm}
                      feature_subheading_en={settings.feature_subheading_en}
                      testimonials_badge_bm={settings.testimonials_badge_bm}
                      testimonials_badge_en={settings.testimonials_badge_en}
                      testimonials_title_bm={settings.testimonials_title_bm}
                      testimonials_title_en={settings.testimonials_title_en}
                      pricing_section_title_bm={settings.pricing_section_title_bm}
                      pricing_section_title_en={settings.pricing_section_title_en}
                      pricing_section_link_bm={settings.pricing_section_link_bm}
                      pricing_section_link_en={settings.pricing_section_link_en}
                      ticker_items_bm={settings.ticker_items_bm}
                      ticker_items_en={settings.ticker_items_en}
                    />

                    <div className="space-y-1 rounded-md border border-slate-700/70 bg-slate-950/50 p-3 text-xs text-slate-300">
                      <p className="font-semibold text-emerald-200">Tip Format Teks (Landing Preview)</p>
                      <p>
                        Highlight: <span className="font-mono text-emerald-200">[text]</span> → warna ikut{' '}
                        <span className="font-semibold text-slate-200">Module 01 · Highlight Color</span>
                      </p>
                      <p>
                        Bold: <span className="font-mono text-emerald-200">**text**</span> · Italic:{' '}
                        <span className="font-mono text-emerald-200">*text*</span> · Monospace:{' '}
                        <span className="font-mono text-emerald-200">`text`</span>
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                        <input type="hidden" name="ticker_enabled_present" value="1" />
                        <input type="checkbox" name="ticker_enabled" defaultChecked={settings.ticker_enabled} className="h-4 w-4" />
                        Enable ticker
                      </label>
                      <input name="ticker_speed_seconds" type="number" defaultValue={settings.ticker_speed_seconds} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                    </div>

                  </form>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem id="module-usp" value="module-4" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 04</p>
                    <h3 className="mt-1 text-lg font-semibold">USP EZ Meta Features</h3>
                    <p className="text-xs text-slate-400">Dynamic features list for landing page cards.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={saveUspModuleSettings} className="space-y-5">
                    <div className="flex justify-end"><ModuleSaveButton label={copy.save} /></div>
                    <div className="rounded-md border border-emerald-400/20 bg-slate-900/40 p-3 text-xs text-slate-300">
                      <p className="font-semibold text-emerald-200">Susunan ikut landing page (Card 1 → Card 6)</p>
                      <p className="mt-1">Tip: isi BM + EN untuk semua 6 card. Landing akan ikut toggle bahasa tanpa campur. Icon cadangan: Trophy, Globe2, HandCoins, Heart, BarChart3, Bot.</p>
                    </div>
                    <UspLanguageFields items={uspEditorSource} />
                  </form>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem id="module-testimonials" value="module-5" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 05</p>
                    <h3 className="mt-1 text-lg font-semibold">Testimonials</h3>
                    <p className="text-xs text-slate-400">Dynamic testimonial cards: user, avatar, quote.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={saveTestimonialsModuleSettings} className="space-y-5">
                    <div className="flex justify-end"><ModuleSaveButton label={copy.save} /></div>
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const item = settings.testimonials_payload[index];
                        const i = index + 1;
                        return (
                          <div key={`testimonial-${i}`} className="grid gap-3 rounded-md border border-slate-700/80 bg-slate-950/60 p-3 md:grid-cols-3">
                            <input name={`testimonial_name_${i}`} defaultValue={item?.name ?? ''} placeholder={`User name ${i}`} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                            <input name={`testimonial_role_${i}`} defaultValue={(item as any)?.role ?? ''} placeholder="Role / Company" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                            <input name={`testimonial_avatar_${i}`} defaultValue={item?.avatar_url ?? ''} placeholder="Avatar URL (optional)" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                            <textarea name={`testimonial_quote_${i}`} defaultValue={item?.quote ?? ''} rows={2} placeholder="Quote" className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 md:col-span-3" />
                          </div>
                        );
                      })}
                    </div>
                  </form>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem id="module-pricing" value="module-6" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 06</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">Pricing & Plans</h3>
                    <p className="text-xs text-slate-400">Pricing, plan labels, descriptions and effective date.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={savePricingModuleSettings} className="space-y-5">
                    <div className="flex justify-end">
                      <ModuleSaveButton label={copy.save} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <input name="pricing_starter_price" type="number" defaultValue={settings.pricing_starter_price} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      <input name="pricing_pro_price" type="number" defaultValue={settings.pricing_pro_price} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      <input name="pricing_agency_price" type="number" defaultValue={settings.pricing_agency_price} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                    </div>

                    <PricingLanguageFields
                      starter_name_bm={settings.starter_name_bm}
                      starter_name_en={settings.starter_name_en}
                      pro_name_bm={settings.pro_name_bm}
                      pro_name_en={settings.pro_name_en}
                      agency_name_bm={settings.agency_name_bm}
                      agency_name_en={settings.agency_name_en}
                      starter_desc_bm={settings.starter_desc_bm}
                      starter_desc_en={settings.starter_desc_en}
                      pro_desc_bm={settings.pro_desc_bm}
                      pro_desc_en={settings.pro_desc_en}
                      agency_desc_bm={settings.agency_desc_bm}
                      agency_desc_en={settings.agency_desc_en}
                    />

                    <div className="grid gap-4 md:grid-cols-4">
                      <input name="starter_bonus_accounts" type="number" defaultValue={settings.starter_bonus_accounts} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      <input name="pro_bonus_accounts" type="number" defaultValue={settings.pro_bonus_accounts} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      <input name="agency_bonus_accounts" type="number" defaultValue={settings.agency_bonus_accounts} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      <input name="contact_whatsapp" defaultValue={settings.contact_whatsapp} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                    </div>

                    <div className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
                      <p className="text-sm font-medium text-slate-200">Pricing Button Styler (Override)</p>
                      <label className="mt-3 flex items-center gap-3 rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
                        <input type="hidden" name="pricing_button_override_enabled_present" value="1" />
                        <input
                          type="checkbox"
                          name="pricing_button_override_enabled"
                          defaultChecked={settings.pricing_button_override_enabled}
                          className="h-4 w-4"
                        />
                        Enable pricing button override
                      </label>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="space-y-1 text-xs text-slate-300">
                          <span>Pricing Button Background</span>
                          <input
                            type="color"
                            name="pricing_button_bg_color"
                            defaultValue={settings.pricing_button_bg_color}
                            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 p-1"
                          />
                        </label>
                        <label className="space-y-1 text-xs text-slate-300">
                          <span>Pricing Button Text</span>
                          <input
                            type="color"
                            name="pricing_button_text_color"
                            defaultValue={settings.pricing_button_text_color}
                            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 p-1"
                          />
                        </label>
                      </div>
                    </div>

                    <DateTimePicker id="pricing_effective_date" name="pricing_effective_date" placeholder="Effective date/time" />
                  </form>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem id="module-faq" value="module-7" className="overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950/60 px-5">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 07</p>
                    <h3 className="mt-1 text-lg font-semibold">Benefits & FAQ</h3>
                    <p className="text-xs text-slate-400">Pricing bullets and FAQ repeater editor.</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <form action={saveFaqModuleSettings} className="space-y-5">
                    <div className="flex justify-end"><ModuleSaveButton label={copy.save} /></div>
                    <PricingBenefitsLanguageFields
                      pricing_starter_benefits_bm={settings.pricing_starter_benefits_bm}
                      pricing_starter_benefits_en={settings.pricing_starter_benefits_en}
                      pricing_pro_benefits_bm={settings.pricing_pro_benefits_bm}
                      pricing_pro_benefits_en={settings.pricing_pro_benefits_en}
                      pricing_agency_benefits_bm={settings.pricing_agency_benefits_bm}
                      pricing_agency_benefits_en={settings.pricing_agency_benefits_en}
                    />
                    <SettingsDynamicFields tickerItemsBm={settings.ticker_items_bm} tickerItemsEn={settings.ticker_items_en} faqs={faqs} showTicker={false} showFaq faqAccordion />
                    <textarea name="faqs_payload" defaultValue={faqsPayload} className="sr-only" readOnly />
                  </form>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          )}
        </main>
      </div>
    </div>
  );
}

