import {
  getAiKillSwitchMode,
  getIntegrationHealth,
  getPlanFeatureEntitlements,
  getSiteSettingsHistory,
  getSystemApiSettings,
  rollbackSiteSettings,
  savePlanFeatureEntitlements,
  saveSystemApiSettings,
  setAiKillSwitch,
} from '@/app/actions/admin-settings';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ModuleSaveButton } from '@/components/admin/module-save-button';

export const dynamic = 'force-dynamic';

export default async function AdminSystemPage() {
  const [killSwitchMode, integrationHealth, entitlements, settingsHistory, apiSettings] = await Promise.all([
    getAiKillSwitchMode(),
    getIntegrationHealth(),
    getPlanFeatureEntitlements(),
    getSiteSettingsHistory(20),
    getSystemApiSettings(),
  ]);

  const entitlementFeatures = Array.from(new Set(entitlements.map((row) => row.feature_key)));
  const entitlementPlans: Array<'free' | 'basic' | 'pro' | 'agency'> = ['free', 'basic', 'pro', 'agency'];

  return (
    <div className="cyber-grid min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <AdminSidebar active="system" />

        <main className="cyber-panel p-6">
          <h1 className="mb-2 text-3xl font-semibold">System & API Settings</h1>
          <p className="mb-6 text-sm text-slate-400">Governance controls, health center, kill-switch, and settings rollback.</p>

          <section className="mb-6 rounded-xl border border-emerald-400/20 bg-slate-950/60 p-5">
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
              <h4 className="text-sm font-semibold text-slate-100">API Credentials Vault</h4>
              <p className="mt-1 text-xs text-slate-400">
                Central place to store API keys / integration IDs for EZ Meta tools and automations.
                Leave field blank to keep existing saved value.
              </p>

              <form action={saveSystemApiSettings} className="mt-4 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-1 text-xs text-slate-300">
                    <span>OpenRouter API Key</span>
                    <input
                      name="openrouter_api_key"
                      type="password"
                      placeholder={apiSettings.openrouter_api_key ? '•••••••• saved' : 'sk-or-v1-...'}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>OpenRouter Model</span>
                    <input
                      name="openrouter_model"
                      defaultValue={apiSettings.openrouter_model}
                      placeholder="openai/gpt-4o-mini"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Meta App ID</span>
                    <input
                      name="meta_app_id"
                      defaultValue={apiSettings.meta_app_id}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Meta App Secret</span>
                    <input
                      name="meta_app_secret"
                      type="password"
                      placeholder={apiSettings.meta_app_secret ? '•••••••• saved' : 'Meta app secret'}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300 md:col-span-2">
                    <span>Meta Access Token</span>
                    <textarea
                      name="meta_access_token"
                      rows={2}
                      placeholder={apiSettings.meta_access_token ? '•••••••• saved' : 'EAAB...'}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Stripe Secret Key</span>
                    <input
                      name="stripe_secret_key"
                      type="password"
                      placeholder={apiSettings.stripe_secret_key ? '•••••••• saved' : 'sk_live_...'}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Stripe Webhook Secret</span>
                    <input
                      name="stripe_webhook_secret"
                      type="password"
                      placeholder={apiSettings.stripe_webhook_secret ? '•••••••• saved' : 'whsec_...'}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Stripe Publishable Key</span>
                    <input
                      name="stripe_publishable_key"
                      defaultValue={apiSettings.stripe_publishable_key}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Telegram Bot Token</span>
                    <input
                      name="telegram_bot_token"
                      type="password"
                      placeholder={apiSettings.telegram_bot_token ? '•••••••• saved' : '123456:AA...'}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300">
                    <span>Telegram Chat ID</span>
                    <input
                      name="telegram_chat_id"
                      defaultValue={apiSettings.telegram_chat_id}
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>

                  <label className="space-y-1 text-xs text-slate-300 md:col-span-2">
                    <span>Tools Webhook URL</span>
                    <input
                      name="tools_webhook_url"
                      defaultValue={apiSettings.tools_webhook_url}
                      placeholder="https://..."
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    Runtime status endpoint: <code className="rounded bg-slate-900 px-1.5 py-0.5">/api/system/runtime-config</code>
                  </p>
                  <ModuleSaveButton label="Save API Credentials" />
                </div>
              </form>
            </div>
          </section>

          <section className="space-y-6 rounded-xl border border-emerald-400/20 bg-slate-950/60 p-5">
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
              <h4 className="text-sm font-semibold text-slate-100">Plan Feature Entitlement Matrix</h4>
              <form action={savePlanFeatureEntitlements} className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-left text-slate-400">
                      <th className="px-3 py-2">Feature</th>
                      {entitlementPlans.map((plan) => (
                        <th key={plan} className="px-3 py-2 uppercase">{plan}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entitlementFeatures.map((feature) => (
                      <tr key={feature} className="border-b border-slate-800/80">
                        <td className="px-3 py-2 text-slate-200">{feature}</td>
                        {entitlementPlans.map((plan) => {
                          const row = entitlements.find((entry) => entry.feature_key === feature && entry.plan_tier === plan);
                          const inputName = `entitlement_${plan}_${feature}`;
                          return (
                            <td key={`${plan}-${feature}`} className="px-3 py-2 text-center">
                              <label className="inline-flex cursor-pointer items-center">
                                <input type="checkbox" name={inputName} defaultChecked={row?.enabled ?? false} className="peer sr-only" />
                                <span className="h-5 w-10 rounded-full bg-slate-700 transition-colors peer-checked:bg-emerald-500" />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4">
                  <ModuleSaveButton label="Save Entitlements" />
                </div>
              </form>
            </div>

            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
              <h4 className="text-sm font-semibold text-slate-100">AI Kill Switch</h4>
              <p className="mt-1 text-xs text-slate-400">Current mode: <span className={`rounded-full px-2 py-0.5 font-semibold uppercase ${killSwitchMode === 'hard' ? 'bg-rose-900/40 text-rose-200' : killSwitchMode === 'soft' ? 'bg-amber-900/40 text-amber-200' : 'bg-emerald-900/40 text-emerald-200'}`}>{killSwitchMode}</span></p>
              <form action={setAiKillSwitch} className="mt-3 flex flex-wrap items-center gap-3">
                <select name="kill_switch_mode" defaultValue={killSwitchMode} className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500">
                  <option value="off">Off</option>
                  <option value="soft">Soft</option>
                  <option value="hard">Hard</option>
                </select>
                <ModuleSaveButton label="Apply Kill Switch" className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60" />
              </form>
            </div>

            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
              <h4 className="text-sm font-semibold text-slate-100">Integration Health Center</h4>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {integrationHealth.length > 0 ? integrationHealth.map((item) => (
                  <div key={item.id} className="rounded-md border border-slate-700 bg-slate-950/70 p-3 text-xs text-slate-300">
                    <p className="text-sm font-semibold text-white">{item.provider}</p>
                    <p className="mt-1">Status: <span className={item.status === 'green' ? 'text-emerald-300' : item.status === 'amber' ? 'text-amber-300' : 'text-rose-300'}>{item.status.toUpperCase()}</span></p>
                    <p>Latency: {item.latency_ms ?? '-'} ms</p>
                    <p>Webhook: {item.webhook_status ?? '-'}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400">No integration health records found yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
              <h4 className="text-sm font-semibold text-slate-100">Settings History & Rollback</h4>
              <div className="mt-3">
                {settingsHistory.length > 0 ? (
                  <Accordion type="single" collapsible className="rounded-md border border-slate-700/70 bg-slate-950/60 px-3">
                    {settingsHistory.map((historyItem) => (
                      <AccordionItem key={historyItem.id} value={historyItem.id} className="border-slate-800">
                        <AccordionTrigger className="py-3 text-left text-xs text-slate-300 hover:no-underline">
                          {new Date(historyItem.created_at).toLocaleString()} · {historyItem.id.slice(0, 8)}...
                        </AccordionTrigger>
                        <AccordionContent>
                          <form action={rollbackSiteSettings} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-950/70 p-3 text-xs text-slate-300">
                            <div>
                              <p>ID: {historyItem.id}</p>
                              <p>by {historyItem.created_by}</p>
                            </div>
                            <input type="hidden" name="history_id" value={historyItem.id} />
                            <ModuleSaveButton label="Rollback" className="rounded-md border border-rose-400/40 px-3 py-1.5 text-rose-200 hover:bg-rose-900/20 disabled:cursor-not-allowed disabled:opacity-60" requireDirty={false} />
                          </form>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-xs text-slate-400">No settings history snapshot yet.</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

