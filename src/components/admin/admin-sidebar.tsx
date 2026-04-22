'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useState } from 'react';

type AdminSidebarProps = {
  active: 'dashboard' | 'settings' | 'users' | 'system' | 'feedback';
  quickNav?: Array<{ href: string; label: string; accordionValue?: string }>;
};

const links: Array<{ key: AdminSidebarProps['active']; href: string; label: string; disabled?: boolean }> = [
  { key: 'dashboard', href: '/admin', label: 'Stat Dashboard' },
  { key: 'settings', href: '/admin/settings', label: 'Tetapan Laman (CMS)' },
  { key: 'users', href: '/admin/users', label: 'User Management' },
  { key: 'system', href: '/admin/system', label: 'System & API Settings' },
  { key: 'feedback', href: '/admin/feedback', label: 'Feedback Logs' },
];

export function AdminSidebar({ active, quickNav = [] }: AdminSidebarProps) {
  const [activeQuickNav, setActiveQuickNav] = useState<string>(quickNav[0]?.href ?? '');

  useEffect(() => {
    if (quickNav.length === 0) return;

    const sectionElements = quickNav
      .map((item) => ({ item, element: document.querySelector(item.href) as HTMLElement | null }))
      .filter((entry) => Boolean(entry.element)) as Array<{ item: { href: string; label: string; accordionValue?: string }; element: HTMLElement }>;

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const matched = sectionElements.find((entry) => entry.element === visible[0].target);
        if (matched) setActiveQuickNav(matched.item.href);
      },
      {
        root: null,
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6],
      }
    );

    for (const entry of sectionElements) {
      observer.observe(entry.element);
    }

    return () => {
      observer.disconnect();
    };
  }, [quickNav]);

  const handleQuickNavClick = (item: { href: string; label: string; accordionValue?: string }) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.querySelector(item.href) as HTMLElement | null;
    if (!section) return;

    setActiveQuickNav(item.href);
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const trigger = section.querySelector('button[data-state]') as HTMLButtonElement | null;
    if (trigger && trigger.getAttribute('data-state') !== 'open') {
      window.setTimeout(() => trigger.click(), 120);
    }
  };

  return (
    <aside className="cyber-panel h-fit p-4 md:sticky md:top-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Admin CMS</h2>
      <nav className="space-y-2 text-sm">
        {links.map((item) => (
          item.disabled ? (
            <span key={item.key} className="block cursor-not-allowed rounded-md px-3 py-2 text-slate-500">
              {item.label}
            </span>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              className={
                item.key === active
                  ? 'block cursor-pointer rounded-md bg-slate-800 px-3 py-2 text-white'
                  : 'block cursor-pointer rounded-md px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white active:opacity-80'
              }
            >
              {item.label}
            </Link>
          )
        ))}
      </nav>

      {quickNav.length > 0 ? (
        <div className="mt-6 rounded-lg border border-emerald-400/20 bg-slate-900/60 p-3 text-xs text-slate-300">
          <p className="font-semibold uppercase tracking-[0.14em] text-emerald-200">Quick Nav</p>
          <ul className="mt-2 space-y-1">
            {quickNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleQuickNavClick(item)}
                  className={
                    activeQuickNav === item.href
                      ? 'block rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-200'
                      : 'block rounded-md px-2 py-1 hover:bg-slate-800 hover:text-emerald-200'
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

