'use client';

import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 px-4 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-slate-400 md:flex-row">
        <p>© {new Date().getFullYear()} EZ Meta. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-emerald-400">Privacy</Link>
          <Link href="/terms" className="hover:text-emerald-400">Terms</Link>
          <Link href="/guide" className="hover:text-emerald-400">Guide</Link>
        </div>
      </div>
    </footer>
  );
}

