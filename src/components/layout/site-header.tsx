'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { landingDictionary } from '@/lib/i18n/landing';
import { useLanguage } from '@/components/providers/language-provider';

export function SiteHeader() {
  const { lang, setLang } = useLanguage();
  const t = landingDictionary[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          EZ Meta
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/#features" className="text-slate-300 hover:text-emerald-400">{t.nav.features}</Link>
          <Link href="/pricing" className="text-slate-300 hover:text-emerald-400">{t.nav.pricing}</Link>
          <Link href="/guide" className="text-slate-300 hover:text-emerald-400">{lang === 'bm' ? 'Panduan' : 'Guide'}</Link>
          <Link href="/login" className="text-slate-300 hover:text-emerald-400">{t.nav.login}</Link>
          <div className="flex rounded-md border border-slate-700 bg-slate-900/60 p-0.5">
            <button
              type="button"
              onClick={() => setLang('bm')}
              className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs transition ${lang === 'bm' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              aria-label="Switch language to Bahasa Melayu"
            >
              <Image src="/flags/my.svg" alt="Malaysia" width={14} height={14} className="h-3.5 w-3.5 shrink-0 rounded-full" />
              <span>BM</span>
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs transition ${lang === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              aria-label="Switch language to English"
            >
              <Image src="/flags/gb.svg" alt="United Kingdom" width={14} height={14} className="h-3.5 w-3.5 shrink-0 rounded-full" />
              <span>EN</span>
            </button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

