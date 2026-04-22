import Link from 'next/link';
import { SectionReveal } from '@/components/shared/section-reveal';
import { loginAction } from '@/app/actions/auth';

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="cyber-grid relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-md items-center">
        <SectionReveal>
          <div className="cyber-panel w-full space-y-8 p-6 md:p-8">
            <div>
              <h2 className="mt-2 text-center font-display text-3xl text-slate-100">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-slate-400">
                Or{' '}
                <Link href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
                  create a new account
                </Link>
              </p>
            </div>

            {params?.error ? (
              <p className="rounded-md bg-red-900/40 p-3 text-sm text-red-300">{params.error}</p>
            ) : null}

            <form className="mt-8 space-y-6" action={loginAction}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900/60 placeholder-slate-500 text-slate-100 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
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
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-700 bg-slate-900/60 placeholder-slate-500 text-slate-100 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-200">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-950 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
