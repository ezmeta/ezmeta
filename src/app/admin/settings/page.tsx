import Link from 'next/link';
import { cookies } from 'next/headers';
import { saveSiteSettings, getSiteSettings, getFaqs, unlockAdmin } from '@/app/actions/admin-settings';
import { SaveStatusToast } from '@/components/admin/save-status-toast';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get('admin_auth')?.value === 'true';
  const lang = cookieStore.get('ez_lang')?.value === 'en' ? 'en' : 'bm';
  const settings = await getSiteSettings();
  const faqs = await getFaqs();
  const faqsPayload = faqs
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => `${item.question_bm}||${item.answer_bm}||${item.question_en}||${item.answer_en}`)
    .join('\n');

  const copy = {
    bm: {
      adminCms: 'Admin CMS',
      dashboardStats: 'Stat Dashboard',
      siteSettings: 'Tetapan Laman',
      userManagement: 'Pengurusan Pengguna',
      feedbackLogs: 'Log Maklum Balas',
      title: 'Tetapan Laman',
      subtitle: 'Kemas kini kandungan landing page dan harga melalui CMS.',
      adminPassword: 'Kata Laluan Admin',
      unlock: 'Buka Akses Admin',
      save: 'Simpan',
    },
    en: {
      adminCms: 'Admin CMS',
      dashboardStats: 'Dashboard Stats',
      siteSettings: 'Site Settings',
      userManagement: 'User Management',
      feedbackLogs: 'Feedback Logs',
      title: 'Site Settings',
      subtitle: 'Update landing-page content and pricing labels for the CMS.',
      adminPassword: 'Admin Password',
      unlock: 'Unlock Admin',
      save: 'Save',
    },
  }[lang];

  return (
    <div className="cyber-grid min-h-screen bg-slate-950 text-white">
      <SaveStatusToast />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-[280px_1fr]">
        <aside className="cyber-panel h-fit p-4 md:sticky md:top-6">
          <h2 className="mb-4 text-lg font-semibold text-white">{copy.adminCms}</h2>
          <nav className="space-y-2 text-sm">
            <Link href="/admin" className="block cursor-pointer rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white active:opacity-80">
              {copy.dashboardStats}
            </Link>
            <Link href="/admin/settings" className="block cursor-pointer rounded-md bg-slate-800 px-3 py-2 text-white">
              {copy.siteSettings}
            </Link>
            <Link href="/admin/users" className="block cursor-pointer rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white active:opacity-80">
              {copy.userManagement}
            </Link>
            <Link href="/admin/feedback" className="block cursor-pointer rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white active:opacity-80">
              {copy.feedbackLogs}
            </Link>
          </nav>

          <div className="mt-6 rounded-lg border border-emerald-400/20 bg-slate-900/60 p-3 text-xs text-slate-300">
            <p className="font-semibold uppercase tracking-[0.14em] text-emerald-200">Struktur Tapak</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#module-pricing" className="hover:text-emerald-200">01 · Pricing & Plans</a>
              </li>
              <li>
                <a href="#module-content" className="hover:text-emerald-200">02 · Headline & Hero</a>
              </li>
              <li>
                <a href="#module-faq" className="hover:text-emerald-200">03 · Benefits & FAQ</a>
              </li>
              <li>
                <a href="#module-popup" className="hover:text-emerald-200">04 · Marketing Pop-up</a>
              </li>
            </ul>
          </div>
        </aside>

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
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition-colors hover:bg-emerald-400 active:scale-[0.98]"
              >
                {copy.unlock}
              </button>
            </form>
          ) : (

          <form action={saveSiteSettings} className="space-y-6">
            <section id="module-pricing" className="scroll-mt-24 rounded-xl border border-emerald-400/20 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 01</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Pricing & Plan Manager</h3>
              <p className="mt-1 text-sm text-slate-400">Edit monthly pricing, plan labels, descriptions, account offers, and WhatsApp endpoint.</p>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <label htmlFor="pricing_starter_price" className="mb-1 block text-sm font-medium text-slate-200">
                    Starter Price (RM)
                  </label>
                  <input
                    id="pricing_starter_price"
                    name="pricing_starter_price"
                    type="number"
                    min={0}
                    step="1"
                    defaultValue={settings.pricing_starter_price}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="pricing_pro_price" className="mb-1 block text-sm font-medium text-slate-200">
                    Pro Price (RM)
                  </label>
                  <input
                    id="pricing_pro_price"
                    name="pricing_pro_price"
                    type="number"
                    min={0}
                    step="1"
                    defaultValue={settings.pricing_pro_price}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="pricing_agency_price" className="mb-1 block text-sm font-medium text-slate-200">
                    Agency Price (RM)
                  </label>
                  <input
                    id="pricing_agency_price"
                    name="pricing_agency_price"
                    type="number"
                    min={0}
                    step="1"
                    defaultValue={settings.pricing_agency_price}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="starter_name_bm" className="mb-1 block text-sm font-medium text-slate-200">Plan Name Starter (BM)</label>
                  <input id="starter_name_bm" name="starter_name_bm" defaultValue={settings.starter_name_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="starter_name_en" className="mb-1 block text-sm font-medium text-slate-200">Plan Name Starter (EN)</label>
                  <input id="starter_name_en" name="starter_name_en" defaultValue={settings.starter_name_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="pro_name_bm" className="mb-1 block text-sm font-medium text-slate-200">Plan Name Pro (BM)</label>
                  <input id="pro_name_bm" name="pro_name_bm" defaultValue={settings.pro_name_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="pro_name_en" className="mb-1 block text-sm font-medium text-slate-200">Plan Name Pro (EN)</label>
                  <input id="pro_name_en" name="pro_name_en" defaultValue={settings.pro_name_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="agency_name_bm" className="mb-1 block text-sm font-medium text-slate-200">Plan Name Agency (BM)</label>
                  <input id="agency_name_bm" name="agency_name_bm" defaultValue={settings.agency_name_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="agency_name_en" className="mb-1 block text-sm font-medium text-slate-200">Plan Name Agency (EN)</label>
                  <input id="agency_name_en" name="agency_name_en" defaultValue={settings.agency_name_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="starter_desc_bm" className="mb-1 block text-sm font-medium text-slate-200">Starter Description (BM)</label>
                  <textarea id="starter_desc_bm" name="starter_desc_bm" rows={2} defaultValue={settings.starter_desc_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="starter_desc_en" className="mb-1 block text-sm font-medium text-slate-200">Starter Description (EN)</label>
                  <textarea id="starter_desc_en" name="starter_desc_en" rows={2} defaultValue={settings.starter_desc_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="pro_desc_bm" className="mb-1 block text-sm font-medium text-slate-200">Pro Description (BM)</label>
                  <textarea id="pro_desc_bm" name="pro_desc_bm" rows={2} defaultValue={settings.pro_desc_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="pro_desc_en" className="mb-1 block text-sm font-medium text-slate-200">Pro Description (EN)</label>
                  <textarea id="pro_desc_en" name="pro_desc_en" rows={2} defaultValue={settings.pro_desc_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="agency_desc_bm" className="mb-1 block text-sm font-medium text-slate-200">Agency Description (BM)</label>
                  <textarea id="agency_desc_bm" name="agency_desc_bm" rows={2} defaultValue={settings.agency_desc_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="agency_desc_en" className="mb-1 block text-sm font-medium text-slate-200">Agency Description (EN)</label>
                  <textarea id="agency_desc_en" name="agency_desc_en" rows={2} defaultValue={settings.agency_desc_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-4">
                <div>
                  <label htmlFor="starter_bonus_accounts" className="mb-1 block text-sm font-medium text-slate-200">Starter Bonus Accounts</label>
                  <input id="starter_bonus_accounts" name="starter_bonus_accounts" type="number" min={0} step="1" defaultValue={settings.starter_bonus_accounts} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="pro_bonus_accounts" className="mb-1 block text-sm font-medium text-slate-200">Pro Bonus Accounts</label>
                  <input id="pro_bonus_accounts" name="pro_bonus_accounts" type="number" min={0} step="1" defaultValue={settings.pro_bonus_accounts} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="agency_bonus_accounts" className="mb-1 block text-sm font-medium text-slate-200">Agency Bonus Accounts</label>
                  <input id="agency_bonus_accounts" name="agency_bonus_accounts" type="number" min={0} step="1" defaultValue={settings.agency_bonus_accounts} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="contact_whatsapp" className="mb-1 block text-sm font-medium text-slate-200">Contact WhatsApp</label>
                  <input id="contact_whatsapp" name="contact_whatsapp" defaultValue={settings.contact_whatsapp} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
                <p className="text-sm font-semibold text-slate-100">Feature Toggles Scaffold</p>
                <p className="mt-1 text-xs text-slate-400">UI scaffold for next phase. Toggle persistence will be wired in a dedicated module update.</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    'Telegram Alerts',
                    'Winning Ad Detector',
                    'Creative Fatigue Detector',
                    'Budget Tracker',
                    'Campaign Health Score',
                    'AI Copywriter BM',
                  ].map((feature) => (
                    <label key={feature} className="flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
                      <input type="checkbox" disabled className="h-3.5 w-3.5 accent-emerald-400" />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section id="module-content" className="scroll-mt-24 rounded-xl border border-emerald-400/20 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Module 02</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Site Content Manager · Headline Editor</h3>
              <p className="mt-1 text-sm text-slate-400">Update hero headline and subheadline for BM/EN with instant save persistence.</p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="hero_headline_bm" className="mb-1 block text-sm font-medium text-slate-200">
                  Hero Headline (BM)
                </label>
                <input
                  id="hero_headline_bm"
                  name="hero_headline_bm"
                  defaultValue={settings.hero_headline_bm}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="hero_headline_en" className="mb-1 block text-sm font-medium text-slate-200">
                  Hero Headline (EN)
                </label>
                <input
                  id="hero_headline_en"
                  name="hero_headline_en"
                  defaultValue={settings.hero_headline_en}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="hero_subheadline_bm" className="mb-1 block text-sm font-medium text-slate-200">
                  Hero Subheadline (BM)
                </label>
                <textarea
                  id="hero_subheadline_bm"
                  name="hero_subheadline_bm"
                  defaultValue={settings.hero_subheadline_bm}
                  rows={3}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="hero_subheadline_en" className="mb-1 block text-sm font-medium text-slate-200">
                  Hero Subheadline (EN)
                </label>
                <textarea
                  id="hero_subheadline_en"
                  name="hero_subheadline_en"
                  defaultValue={settings.hero_subheadline_en}
                  rows={3}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="alert_banner_text_bm" className="mb-1 block text-sm font-medium text-slate-200">Alert Banner Text (BM)</label>
                  <input id="alert_banner_text_bm" name="alert_banner_text_bm" defaultValue={settings.alert_banner_text_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="alert_banner_text_en" className="mb-1 block text-sm font-medium text-slate-200">Alert Banner Text (EN)</label>
                  <input id="alert_banner_text_en" name="alert_banner_text_en" defaultValue={settings.alert_banner_text_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="ticker_items_bm" className="mb-1 block text-sm font-medium text-slate-200">Ticker Items BM (1 per line)</label>
                  <textarea id="ticker_items_bm" name="ticker_items_bm" rows={5} defaultValue={settings.ticker_items_bm.join('\n')} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="ticker_items_en" className="mb-1 block text-sm font-medium text-slate-200">Ticker Items EN (1 per line)</label>
                  <textarea id="ticker_items_en" name="ticker_items_en" rows={5} defaultValue={settings.ticker_items_en.join('\n')} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>
            </section>

            <section id="module-faq" className="scroll-mt-24 rounded-xl border border-slate-700/80 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Module 03</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Benefits & FAQ Manager</h3>
              <p className="mt-1 text-sm text-slate-400">Maintain benefit bullets and FAQ records used by landing and pricing pages.</p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="pricing_starter_benefits_bm" className="mb-1 block text-sm font-medium text-slate-200">
                  Starter Benefits BM (1 per line)
                </label>
                <textarea
                  id="pricing_starter_benefits_bm"
                  name="pricing_starter_benefits_bm"
                  defaultValue={settings.pricing_starter_benefits_bm.join('\n')}
                  rows={10}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />

                <label htmlFor="pricing_starter_benefits_en" className="mb-1 mt-4 block text-sm font-medium text-slate-200">
                  Starter Benefits EN (1 per line)
                </label>
                <textarea
                  id="pricing_starter_benefits_en"
                  name="pricing_starter_benefits_en"
                  defaultValue={settings.pricing_starter_benefits_en.join('\n')}
                  rows={10}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="pricing_pro_benefits_bm" className="mb-1 block text-sm font-medium text-slate-200">
                  Pro Benefits BM (1 per line)
                </label>
                <textarea
                  id="pricing_pro_benefits_bm"
                  name="pricing_pro_benefits_bm"
                  defaultValue={settings.pricing_pro_benefits_bm.join('\n')}
                  rows={10}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />

                <label htmlFor="pricing_pro_benefits_en" className="mb-1 mt-4 block text-sm font-medium text-slate-200">
                  Pro Benefits EN (1 per line)
                </label>
                <textarea
                  id="pricing_pro_benefits_en"
                  name="pricing_pro_benefits_en"
                  defaultValue={settings.pricing_pro_benefits_en.join('\n')}
                  rows={10}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="pricing_agency_benefits_bm" className="mb-1 block text-sm font-medium text-slate-200">
                  Agency Benefits BM (1 per line)
                </label>
                <textarea
                  id="pricing_agency_benefits_bm"
                  name="pricing_agency_benefits_bm"
                  defaultValue={settings.pricing_agency_benefits_bm.join('\n')}
                  rows={10}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />

                <label htmlFor="pricing_agency_benefits_en" className="mb-1 mt-4 block text-sm font-medium text-slate-200">
                  Agency Benefits EN (1 per line)
                </label>
                <textarea
                  id="pricing_agency_benefits_en"
                  name="pricing_agency_benefits_en"
                  defaultValue={settings.pricing_agency_benefits_en.join('\n')}
                  rows={10}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="faqs_payload" className="mb-1 block text-sm font-medium text-slate-200">
                FAQ Editor (BM_Q||BM_A||EN_Q||EN_A, one item per line)
              </label>
              <textarea
                id="faqs_payload"
                name="faqs_payload"
                defaultValue={faqsPayload}
                rows={10}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Edit existing FAQ, remove a line to delete, or add a line to create a new FAQ item.
              </p>
            </div>
            </section>

            <section id="module-popup" className="scroll-mt-24 rounded-xl border border-slate-700/80 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Module 04</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Dynamic Marketing Pop-up</h3>
              <p className="mt-1 text-sm text-slate-400">Configure popup copy and CTA destination. Landing rendering integration is next step.</p>

              <div className="mt-5 flex items-center gap-3">
                <input id="popup_enabled" name="popup_enabled" type="checkbox" defaultChecked={settings.popup_enabled} className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-400" />
                <label htmlFor="popup_enabled" className="text-sm text-slate-200">Enable Pop-up</label>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="popup_headline_bm" className="mb-1 block text-sm font-medium text-slate-200">Popup Headline (BM)</label>
                  <input id="popup_headline_bm" name="popup_headline_bm" defaultValue={settings.popup_headline_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="popup_headline_en" className="mb-1 block text-sm font-medium text-slate-200">Popup Headline (EN)</label>
                  <input id="popup_headline_en" name="popup_headline_en" defaultValue={settings.popup_headline_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="popup_description_bm" className="mb-1 block text-sm font-medium text-slate-200">Popup Description (BM)</label>
                  <textarea id="popup_description_bm" name="popup_description_bm" rows={3} defaultValue={settings.popup_description_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="popup_description_en" className="mb-1 block text-sm font-medium text-slate-200">Popup Description (EN)</label>
                  <textarea id="popup_description_en" name="popup_description_en" rows={3} defaultValue={settings.popup_description_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="popup_button_text_bm" className="mb-1 block text-sm font-medium text-slate-200">Popup Button (BM)</label>
                  <input id="popup_button_text_bm" name="popup_button_text_bm" defaultValue={settings.popup_button_text_bm} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label htmlFor="popup_button_text_en" className="mb-1 block text-sm font-medium text-slate-200">Popup Button (EN)</label>
                  <input id="popup_button_text_en" name="popup_button_text_en" defaultValue={settings.popup_button_text_en} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="popup_redirect_url" className="mb-1 block text-sm font-medium text-slate-200">Popup Redirect URL</label>
                <input id="popup_redirect_url" name="popup_redirect_url" defaultValue={settings.popup_redirect_url} className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500" />
              </div>
            </section>

            <button
              type="submit"
              className="cursor-pointer rounded-md bg-emerald-500 px-5 py-2 font-medium text-slate-950 transition-colors hover:bg-emerald-400 active:scale-[0.98]"
            >
              {copy.save}
            </button>
          </form>
          )}
        </main>
      </div>
    </div>
  );
}
