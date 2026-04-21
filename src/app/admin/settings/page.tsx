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
    <div className="min-h-screen bg-slate-950 text-white">
      <SaveStatusToast />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="mb-4 text-lg font-semibold">{copy.adminCms}</h2>
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
        </aside>

        <main className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
          <h1 className="mb-1 text-2xl font-bold">{copy.title}</h1>
          <p className="mb-6 text-sm text-slate-400">{copy.subtitle}</p>

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
                className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 active:scale-[0.98]"
              >
                {copy.unlock}
              </button>
            </form>
          ) : (

          <form action={saveSiteSettings} className="space-y-5">

            <div className="grid gap-5 md:grid-cols-2">
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

            <div className="grid gap-5 md:grid-cols-2">
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

            <div className="grid gap-5 md:grid-cols-2">
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
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
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
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
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
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contact_whatsapp" className="mb-1 block text-sm font-medium text-slate-200">
                  Contact WhatsApp
                </label>
                <input
                  id="contact_whatsapp"
                  name="contact_whatsapp"
                  defaultValue={settings.contact_whatsapp}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="alert_banner_text_bm" className="mb-1 block text-sm font-medium text-slate-200">
                  Alert Banner Text (BM)
                </label>
                <input
                  id="alert_banner_text_bm"
                  name="alert_banner_text_bm"
                  defaultValue={settings.alert_banner_text_bm}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="alert_banner_text_en" className="mb-1 block text-sm font-medium text-slate-200">
                  Alert Banner Text (EN)
                </label>
                <input
                  id="alert_banner_text_en"
                  name="alert_banner_text_en"
                  defaultValue={settings.alert_banner_text_en}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
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

            <div>
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

            <button
              type="submit"
              className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 active:scale-[0.98]"
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
