import Link from 'next/link';
import { getAdminUsers, updateUserGovernance } from '@/app/actions/admin-settings';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const dynamic = 'force-dynamic';

type AdminUsersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getPlanLimit(plan: string): number {
  if (plan === 'agency') return 10;
  if (plan === 'pro') return 5;
  if (plan === 'basic') return 2;
  return 1;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = (await searchParams) ?? {};
  const q = typeof params.q === 'string' ? params.q : '';
  const plan = typeof params.plan === 'string' ? params.plan : 'all';
  const users = await getAdminUsers(q, plan);

  return (
    <div className="cyber-grid min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <AdminSidebar active="users" />

        <main>
        <h1 className="mb-2 text-2xl font-bold">User Management</h1>
        <p className="mb-6 text-slate-400">Search users, apply plan filters, and enforce manual governance overrides.</p>

        <form className="cyber-panel mb-4 grid gap-3 p-4 md:grid-cols-[1fr_180px_auto]" method="get">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by email..."
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
          />
          <select
            name="plan"
            defaultValue={plan}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
          >
            <option value="all">All plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
            <option value="agency">Agency</option>
          </select>
          <button type="submit" className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400">Apply</button>
        </form>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/70">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/90 text-left text-xs uppercase tracking-[0.08em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ad Accounts</th>
                <th className="px-4 py-3">AI Credits</th>
                <th className="px-4 py-3">Governance</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => {
                const softLimit = getPlanLimit(user.subscription_tier) + user.bonus_ad_account_limit;
                const isOverLimit = user.ad_accounts_connected > softLimit;

                return (
                  <tr key={user.user_id} className="border-b border-slate-800/80 align-top">
                    <td className="px-4 py-3 text-slate-200">
                      <p>{user.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(user.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 uppercase">{user.subscription_tier}</td>
                    <td className="px-4 py-3 text-slate-300">{user.subscription_status}</td>
                    <td className="px-4 py-3">
                      <span className={isOverLimit ? 'font-semibold text-rose-300' : 'text-emerald-200'}>
                        {user.ad_accounts_connected} / {softLimit}
                      </span>
                      {isOverLimit ? <p className="mt-1 text-xs text-rose-300">Over plan allowance</p> : null}
                    </td>
                    <td className="px-4 py-3 text-slate-200">{user.ai_credits}</td>
                    <td className="px-4 py-3">
                      <form action={updateUserGovernance} className="grid gap-2 md:grid-cols-3">
                        <input type="hidden" name="user_id" value={user.user_id} />
                        <select
                          name="subscription_tier"
                          defaultValue={user.subscription_tier}
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                        >
                          <option value="free">free</option>
                          <option value="basic">basic</option>
                          <option value="pro">pro</option>
                          <option value="agency">agency</option>
                        </select>
                        <input
                          name="bonus_ad_account_limit"
                          type="number"
                          min={0}
                          step={1}
                          defaultValue={user.bonus_ad_account_limit}
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                        />
                        <input
                          name="manual_plan_override"
                          defaultValue={user.manual_plan_override ?? ''}
                          placeholder="override note"
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                        />
                        <button type="submit" className="md:col-span-3 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-white">
                          Save governance
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link href="/admin" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            Back to Admin Dashboard
          </Link>
        </div>
        </main>
      </div>
    </div>
  );
}
