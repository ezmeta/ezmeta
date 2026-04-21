import Link from 'next/link';

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-bold">User Management</h1>
        <p className="mb-6 text-slate-400">Manage users, subscriptions, and credits from this panel.</p>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-slate-300">
          User list module placeholder. Connect this page to Supabase user/profile queries for full management controls.
        </div>

        <div className="mt-6">
          <Link href="/admin/settings" className="cursor-pointer rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800">
            Back to Site Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
