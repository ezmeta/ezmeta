import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-2xl font-bold">Admin Dashboard Stats</h1>
        <p className="mb-6 text-slate-400">Overview panel for CMS and platform metrics.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-1 text-2xl font-semibold">--</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">Pro Subscribers</p>
            <p className="mt-1 text-2xl font-semibold">--</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">AI Generations</p>
            <p className="mt-1 text-2xl font-semibold">--</p>
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
