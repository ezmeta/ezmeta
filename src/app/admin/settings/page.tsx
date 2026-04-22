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
import { ModuleSaveButton } from '@/components/admin/module-save-button';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      title: 'Winning Ad Detector',
      description: 'AI scan semua campaigns dan detect ads yang perform terbaik. Score 0–100. Alert terus bila ada winning ad.',
    },
    {
      icon: 'Globe2',
      title: 'Creative Fatigue Detector',
      description: 'Detect CTR drop, frequency tinggi, dan CPM naik — tanda creative dah mati. Alert awal sebelum performance jatuh teruk.',
    },
    {
      icon: 'HandCoins',
      title: 'Budget Tracker',
      description: 'Monitor budget bulanan semua campaigns. Alert bila dah guna 80% serta pacing cadangan untuk baki hari.',
    },
    {
      icon: 'Heart',
      title: 'Campaign Health Score',
      description: 'Setiap campaign dapat gred A–D berdasarkan ROAS, CTR, CPC, frequency dan conversions.',
    },
    {
      icon: 'BarChart3',
      title: 'Laporan AI dalam BM',
      description: 'Laporan harian dalam Bahasa Malaysia, mudah faham dan actionable terus ke Telegram.',
    },
    {
      icon: 'Bot',
      title: 'AI Recommendations',
      description: 'AI bagi cadangan automasi yang jelas untuk setiap campaign.',
    },
  ];

  const rawUsp = settings.usp_features_payload ?? [];
  const uspEditorSource = Array.from({ length: 6 }).map((_, index) => {
    const current = rawUsp[index];
    const fallback = uspFallback[index];
    return {
      icon: current?.icon?.trim() ? current.icon : fallback.icon,
      title: current?.title?.trim() ? current.title : fallback.title,
      description: current?.description?.trim() ? current.description : fallback.description,
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

                    <Tabs defaultValue="bm">
                      <TabsList className="grid h-auto grid-cols-2 bg-slate-900 p-1 text-slate-300">
                        <TabsTrigger value="bm" className="data-[state=active]:bg-slate-700">BM</TabsTrigger>
                        <TabsTrigger value="en" className="data-[state=active]:bg-slate-700">EN</TabsTrigger>
                      </TabsList>
                      <TabsContent value="bm" className="mt-3 space-y-3">
                        <input name="popup_headline_bm" defaultValue={settings.popup_headline_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="popup_description_bm" defaultValue={settings.popup_description_bm} rows={3} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="popup_button_text_bm" defaultValue={settings.popup_button_text_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                      <TabsContent value="en" className="mt-3 space-y-3">
                        <input name="popup_headline_en" defaultValue={settings.popup_headline_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="popup_description_en" defaultValue={settings.popup_description_en} rows={3} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="popup_button_text_en" defaultValue={settings.popup_button_text_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                    </Tabs>

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
                    <Tabs defaultValue="bm">
                      <TabsList className="grid h-auto grid-cols-2 bg-slate-900 p-1 text-slate-300">
                        <TabsTrigger value="bm" className="data-[state=active]:bg-slate-700">BM</TabsTrigger>
                        <TabsTrigger value="en" className="data-[state=active]:bg-slate-700">EN</TabsTrigger>
                      </TabsList>
                      <TabsContent value="bm" className="mt-3 space-y-3">
                        <input
                          name="hero_headline_bm"
                          defaultValue={settings.hero_headline_bm}
                          placeholder="Contoh: Hentikan [Pembaziran] Bajet"
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                        />
                        <textarea name="hero_subheadline_bm" defaultValue={settings.hero_subheadline_bm} rows={3} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="alert_banner_text_bm" defaultValue={settings.alert_banner_text_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="feature_heading_bm" defaultValue={settings.feature_heading_bm} placeholder="Feature section heading (BM)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="feature_subheading_bm" defaultValue={settings.feature_subheading_bm} placeholder="Feature section subheading (BM)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="testimonials_badge_bm" defaultValue={settings.testimonials_badge_bm} placeholder="Testimonials badge (BM)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="testimonials_title_bm" defaultValue={settings.testimonials_title_bm} placeholder="Testimonials title (BM)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="pricing_section_title_bm" defaultValue={settings.pricing_section_title_bm} placeholder="Pricing section title (BM)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="pricing_section_link_bm" defaultValue={settings.pricing_section_link_bm} placeholder="Pricing section link text (BM)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                      <TabsContent value="en" className="mt-3 space-y-3">
                        <input
                          name="hero_headline_en"
                          defaultValue={settings.hero_headline_en}
                          placeholder="Example: Stop [Wasting] Ad Spend"
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                        />
                        <textarea name="hero_subheadline_en" defaultValue={settings.hero_subheadline_en} rows={3} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="alert_banner_text_en" defaultValue={settings.alert_banner_text_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="feature_heading_en" defaultValue={settings.feature_heading_en} placeholder="Feature section heading (EN)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="feature_subheading_en" defaultValue={settings.feature_subheading_en} placeholder="Feature section subheading (EN)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="testimonials_badge_en" defaultValue={settings.testimonials_badge_en} placeholder="Testimonials badge (EN)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="testimonials_title_en" defaultValue={settings.testimonials_title_en} placeholder="Testimonials title (EN)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="pricing_section_title_en" defaultValue={settings.pricing_section_title_en} placeholder="Pricing section title (EN)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="pricing_section_link_en" defaultValue={settings.pricing_section_link_en} placeholder="Pricing section link text (EN)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                    </Tabs>

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

                    <SettingsDynamicFields tickerItemsBm={settings.ticker_items_bm} tickerItemsEn={settings.ticker_items_en} faqs={faqs} showTicker showFaq={false} />
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
                      <p className="mt-1">Tip: isi semua 6 card untuk sama seperti paparan landing. Icon cadangan: Trophy, Globe2, HandCoins, Heart, BarChart3, Bot.</p>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const item = uspEditorSource[index];
                        const i = index + 1;
                        return (
                          <div key={`usp-${i}`} className="rounded-md border border-slate-700/80 bg-slate-950/60 p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">USP Card {i}</p>
                            <div className="grid gap-3 md:grid-cols-[160px_1fr_2fr]">
                              <input
                                name={`usp_icon_${i}`}
                                defaultValue={item?.icon ?? ''}
                                placeholder="Icon (e.g. Trophy)"
                                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                              />
                              <input
                                name={`usp_title_${i}`}
                                defaultValue={item?.title ?? ''}
                                placeholder={`USP title ${i}`}
                                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                              />
                              <input
                                name={`usp_description_${i}`}
                                defaultValue={item?.description ?? ''}
                                placeholder="USP description"
                                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

                    <Tabs defaultValue="bm">
                      <TabsList className="grid h-auto grid-cols-2 bg-slate-900 p-1 text-slate-300">
                        <TabsTrigger value="bm" className="data-[state=active]:bg-slate-700">BM</TabsTrigger>
                        <TabsTrigger value="en" className="data-[state=active]:bg-slate-700">EN</TabsTrigger>
                      </TabsList>
                      <TabsContent value="bm" className="mt-3 grid gap-3 md:grid-cols-3">
                        <input name="starter_name_bm" defaultValue={settings.starter_name_bm} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="pro_name_bm" defaultValue={settings.pro_name_bm} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="agency_name_bm" defaultValue={settings.agency_name_bm} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="starter_desc_bm" defaultValue={settings.starter_desc_bm} rows={2} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="pro_desc_bm" defaultValue={settings.pro_desc_bm} rows={2} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="agency_desc_bm" defaultValue={settings.agency_desc_bm} rows={2} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                      <TabsContent value="en" className="mt-3 grid gap-3 md:grid-cols-3">
                        <input name="starter_name_en" defaultValue={settings.starter_name_en} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="pro_name_en" defaultValue={settings.pro_name_en} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <input name="agency_name_en" defaultValue={settings.agency_name_en} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="starter_desc_en" defaultValue={settings.starter_desc_en} rows={2} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="pro_desc_en" defaultValue={settings.pro_desc_en} rows={2} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="agency_desc_en" defaultValue={settings.agency_desc_en} rows={2} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                    </Tabs>

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
                    <Tabs defaultValue="starter">
                      <TabsList className="grid h-auto grid-cols-3 bg-slate-900 p-1 text-slate-300">
                        <TabsTrigger value="starter" className="data-[state=active]:bg-slate-700">Starter</TabsTrigger>
                        <TabsTrigger value="pro" className="data-[state=active]:bg-slate-700">Pro</TabsTrigger>
                        <TabsTrigger value="agency" className="data-[state=active]:bg-slate-700">Agency</TabsTrigger>
                      </TabsList>
                      <TabsContent value="starter" className="mt-3 grid gap-3 md:grid-cols-2">
                        <textarea name="pricing_starter_benefits_bm" defaultValue={settings.pricing_starter_benefits_bm.join('\n')} rows={7} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="pricing_starter_benefits_en" defaultValue={settings.pricing_starter_benefits_en.join('\n')} rows={7} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                      <TabsContent value="pro" className="mt-3 grid gap-3 md:grid-cols-2">
                        <textarea name="pricing_pro_benefits_bm" defaultValue={settings.pricing_pro_benefits_bm.join('\n')} rows={7} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="pricing_pro_benefits_en" defaultValue={settings.pricing_pro_benefits_en.join('\n')} rows={7} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                      <TabsContent value="agency" className="mt-3 grid gap-3 md:grid-cols-2">
                        <textarea name="pricing_agency_benefits_bm" defaultValue={settings.pricing_agency_benefits_bm.join('\n')} rows={7} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                        <textarea name="pricing_agency_benefits_en" defaultValue={settings.pricing_agency_benefits_en.join('\n')} rows={7} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2" />
                      </TabsContent>
                    </Tabs>
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

