import Link from 'next/link';
import { getAllUserFeedback } from '@/db/client';
import { formatDistanceToNow } from 'date-fns';
import { updateFeedbackStatus } from '@/app/actions/admin-settings';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const dynamic = 'force-dynamic';

export default async function AdminFeedbackPage() {
  const feedback = await getAllUserFeedback(100);
  
  return (
    <div className="cyber-grid min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <AdminSidebar active="feedback" />

        <main>
        <h1 className="mb-2 text-2xl font-bold">Feedback Logs</h1>
        <p className="mb-6 text-sm text-slate-400">Review user sentiment and persist internal triage status/notes.</p>

        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/90">
               <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  User ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Rating
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Comment
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Workflow
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/30">
              {feedback.length > 0 ? (
                feedback.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-200">
                      {item.user_id.substring(0, 8)}...
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i}
                            className={`h-5 w-5 ${i < item.rating ? 'text-yellow-400' : 'text-slate-700'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                        ${item.category === 'Bug' ? 'bg-rose-900/40 text-rose-200' : 
                          item.category === 'Feature Request' ? 'bg-sky-900/40 text-sky-200' : 
                          'bg-emerald-900/40 text-emerald-200'}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-4 text-sm text-slate-300">
                      {item.comment || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-400">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </td>

                    <td className="px-4 py-4">
                      <form action={updateFeedbackStatus} className="grid gap-2">
                        <input type="hidden" name="feedback_id" value={item.id} />
                        <select
                          name="status"
                          defaultValue={(item as any).status || 'new'}
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                        >
                          <option value="new">new</option>
                          <option value="resolved">resolved</option>
                        </select>
                        <textarea
                          name="internal_notes"
                          defaultValue={(item as any).internal_notes || ''}
                          rows={2}
                          placeholder="Internal notes"
                          className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                        />
                        <button type="submit" className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-white">
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                    No feedback records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
