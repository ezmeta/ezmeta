import Link from 'next/link';
import { signupAction } from '@/app/actions/auth';

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        {params?.error ? (
          <p className="rounded-md bg-red-900/40 p-3 text-sm text-red-300">{params.error}</p>
        ) : null}

        <form className="mt-8 space-y-6" action={signupAction}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900/60 placeholder-slate-500 text-slate-100 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900/60 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900/60 placeholder-slate-500 text-slate-100 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-200">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-emerald-400 hover:text-emerald-300">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-emerald-400 hover:text-emerald-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
