import Link from 'next/link';
import { supabase } from '@/db/client';

export const dynamic = 'force-dynamic';

type AdminStats = {
  totalUsers: number;
  proSubscribers: number;
  aiGenerations: number;
  connectedAdAccounts: number;
  overLimitUsers: number;
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
    proSubscribers: 0,
    aiGenerations: 0,
    connectedAdAccounts: 0,
    overLimitUsers: 0,
  };

  try {
    const [
      usersCountRes,
      proCountRes,
      aiCountRes,
      adAccountsRes,
      profilesRes,
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
    ]);

    const totalUsers = Number(usersCountRes?.count ?? 0);
    const proSubscribers = Number(proCountRes?.count ?? 0);
    const aiGenerations = Number(aiCountRes?.count ?? 0);

    const profiles = Array.isArray(profilesRes?.data) ? (profilesRes.data as Array<{ user_id: string; subscription_tier: string }>) : [];
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

    return {
      totalUsers,
      proSubscribers,
      aiGenerations,
      connectedAdAccounts: adAccounts.length,
      overLimitUsers,
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
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 font-display text-3xl text-white">Admin Dashboard Stats</h1>
        <p className="mb-6 text-slate-300">Overview panel for CMS and platform metrics.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.totalUsers}</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">Pro Subscribers</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.proSubscribers}</p>
          </div>
          <div className="cyber-panel p-4">
            <p className="text-sm text-slate-400">AI Generations</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.aiGenerations}</p>
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

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/admin/settings" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            Site Settings
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
  );
}
