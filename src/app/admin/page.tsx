import Link from 'next/link';
import { supabase } from '@/db/client';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const dynamic = 'force-dynamic';

type AdminStats = {
  totalUsers: number;
  starterUsers: number;
  proUsers: number;
  agencyUsers: number;
  proSubscribers: number;
  aiGenerations: number;
  connectedAdAccounts: number;
  overLimitUsers: number;
  aiKillSwitchMode: 'off' | 'soft' | 'hard';
  aiUsageEvents7d: number;
  aiCostUsd7d: number;
  topAiFeatures7d: Array<{ feature_key: string; requests: number; cost_usd: number }>;
};

const PLAN_ACCOUNT_LIMIT: Record<string, number> = {
  free: 1,
  basic: 2,
  pro: 5,
  agency: 10,
};

async function getAdminStats(): Promise<AdminStats> {
  const safeDefault: AdminStats = {
    totalUsers: 0,
    starterUsers: 0,
    proUsers: 0,
    agencyUsers: 0,
    proSubscribers: 0,
    aiGenerations: 0,
    connectedAdAccounts: 0,
    overLimitUsers: 0,
    aiKillSwitchMode: 'off',
    aiUsageEvents7d: 0,
    aiCostUsd7d: 0,
    topAiFeatures7d: [],
  };

  try {
    const [
      usersCountRes,
      proCountRes,
      aiCountRes,
      adAccountsRes,
      profilesRes,
      aiUsageRes,
      killSwitchRes,
    ] = await Promise.all([
      (supabase as any).from('profiles').select('id', { head: true, count: 'exact' }),
      (supabase as any)
        .from('profiles')
        .select('id', { head: true, count: 'exact' })
        .in('subscription_tier', ['pro', 'agency'])
        .eq('subscription_status', 'active'),
      (supabase as any).from('ai_generations').select('id', { head: true, count: 'exact' }),
      (supabase as any).from('ad_accounts').select('user_id, status'),
      (supabase as any).from('profiles').select('user_id, subscription_tier'),
      (supabase as any)
        .from('ai_usage_events')
        .select('feature_key, estimated_cost_usd, input_tokens, output_tokens, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      (supabase as any).from('system_flags').select('value').eq('key', 'ai_kill_switch').maybeSingle(),
    ]);

    const totalUsers = Number(usersCountRes?.count ?? 0);
    const proSubscribers = Number(proCountRes?.count ?? 0);
    const aiGenerations = Number(aiCountRes?.count ?? 0);

    const profiles = Array.isArray(profilesRes?.data) ? (profilesRes.data as Array<{ user_id: string; subscription_tier: string }>) : [];
    const starterUsers = profiles.filter((profile) => profile.subscription_tier === 'basic').length;
    const proUsers = profiles.filter((profile) => profile.subscription_tier === 'pro').length;
    const agencyUsers = profiles.filter((profile) => profile.subscription_tier === 'agency').length;
    const adAccounts = Array.isArray(adAccountsRes?.data)
      ? (adAccountsRes.data as Array<{ user_id: string; status: string }>).filter((item) => item.status === 'active')
      : [];

    const accountsByUser = new Map<string, number>();
    for (const account of adAccounts) {
      accountsByUser.set(account.user_id, (accountsByUser.get(account.user_id) ?? 0) + 1);
    }

    let overLimitUsers = 0;
    for (const profile of profiles) {
      const limit = PLAN_ACCOUNT_LIMIT[profile.subscription_tier] ?? PLAN_ACCOUNT_LIMIT.free;
      const used = accountsByUser.get(profile.user_id) ?? 0;
      if (used > limit) overLimitUsers += 1;
    }

    const usageRows = Array.isArray(aiUsageRes?.data) ? (aiUsageRes.data as Array<any>) : [];
    let aiCostUsd7d = 0;
    const featureMap = new Map<string, { requests: number; cost_usd: number }>();
    for (const row of usageRows) {
      const featureKey = String(row.feature_key || 'unknown');
      const cost = Number(row.estimated_cost_usd ?? 0);
      aiCostUsd7d += Number.isFinite(cost) ? cost : 0;
      const current = featureMap.get(featureKey) ?? { requests: 0, cost_usd: 0 };
      featureMap.set(featureKey, {
        requests: current.requests + 1,
        cost_usd: current.cost_usd + (Number.isFinite(cost) ? cost : 0),
      });
    }
    const topAiFeatures7d = Array.from(featureMap.entries())
      .map(([feature_key, agg]) => ({ feature_key, requests: agg.requests, cost_usd: agg.cost_usd }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 4);

    const killMode = String((killSwitchRes?.data as any)?.value?.mode || 'off');
    const aiKillSwitchMode: 'off' | 'soft' | 'hard' = killMode === 'soft' || killMode === 'hard' ? killMode : 'off';

    return {
      totalUsers,
      starterUsers,
      proUsers,
      agencyUsers,
      proSubscribers,
      aiGenerations,
      connectedAdAccounts: adAccounts.length,
      overLimitUsers,
      aiKillSwitchMode,
      aiUsageEvents7d: usageRows.length,
      aiCostUsd7d,
      topAiFeatures7d,
    };
  } catch (error) {
    console.error('Failed to load admin dashboard stats:', error);
    return safeDefault;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="cyber-grid min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <AdminSidebar active="dashboard" />
        <div>
        <h1 className="mb-2 font-display text-3xl text-white">Admin Dashboard Stats</h1>
        <p className="mb-6 text-slate-300">Overview panel for CMS and platform metrics.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.totalUsers}</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Active Subscribers</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.proSubscribers}</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">AI Generations</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.aiGenerations}</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Starter Users</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.starterUsers}</p>
            <p className="mt-2 text-xs text-slate-400">Mapped from <span className="font-medium text-slate-300">basic</span> tier.</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Pro Users</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.proUsers}</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Agency Users</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.agencyUsers}</p>
          </div>
          <div className="cyber-panel p-4 md:col-span-2">
            <p className="text-sm text-slate-400">Connected Ad Accounts</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.connectedAdAccounts}</p>
            <p className="mt-2 text-xs text-slate-400">Active ad accounts linked across all users.</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Users Over Plan Limit</p>
            <p className={`mt-1 text-2xl font-semibold ${stats.overLimitUsers > 0 ? 'text-rose-300' : 'text-emerald-200'}`}>
              {stats.overLimitUsers}
            </p>
            <p className="mt-2 text-xs text-slate-400">Users with active ad accounts exceeding plan allowance.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">AI Kill Switch</p>
            <p className={`mt-1 text-2xl font-semibold uppercase ${stats.aiKillSwitchMode === 'hard' ? 'text-rose-300' : stats.aiKillSwitchMode === 'soft' ? 'text-amber-300' : 'text-emerald-200'}`}>
              {stats.aiKillSwitchMode}
            </p>
            <p className="mt-2 text-xs text-slate-400">Current global AI operations mode.</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">AI Usage Events (7d)</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.aiUsageEvents7d}</p>
            <p className="mt-2 text-xs text-slate-400">Tracked prompts/actions for recent 7 days.</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Estimated AI Cost (7d)</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">${stats.aiCostUsd7d.toFixed(4)}</p>
            <p className="mt-2 text-xs text-slate-400">Based on logged usage events cost estimates.</p>
          </div>
        </div>

        <div className="cyber-panel mt-4 p-4">
          <p className="text-sm text-slate-400">Top AI Features (7d)</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {stats.topAiFeatures7d.length > 0 ? stats.topAiFeatures7d.map((feature) => (
              <div key={feature.feature_key} className="rounded-md border border-slate-700/70 bg-slate-950/70 p-3">
                <p className="text-sm text-white">{feature.feature_key}</p>
                <p className="mt-1 text-xs text-slate-400">Requests: {feature.requests} · Cost: ${feature.cost_usd.toFixed(4)}</p>
              </div>
            )) : (
              <p className="text-xs text-slate-400">No AI usage events recorded yet.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/admin/settings" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            Site Settings
          </Link>
          <Link href="/admin/system" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            System & API Settings
          </Link>
          <Link href="/admin/users" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            User Management
          </Link>
          <Link href="/admin/feedback" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            Feedback Logs
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
