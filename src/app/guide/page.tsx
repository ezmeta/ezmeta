import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, CheckCircle2, Gauge, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { SectionReveal } from '@/components/shared/section-reveal';

export const metadata: Metadata = {
  title: 'Guide | EZ Meta',
  description: 'Cyber-sophisticated operating guide for EZ Meta workflows, setup, and optimization.',
};

const quickStart = [
  {
    title: 'Connect Meta Account',
    desc: 'Attach your Ad Account securely from dashboard settings. We use official API scopes only.',
  },
  {
    title: 'Enable AI Monitoring',
    desc: 'Activate campaign health analysis to track spend leaks, fatigue signals, and ROAS drift.',
  },
  {
    title: 'Review Telegram Alerts',
    desc: 'Receive actionable summaries and recommendations directly in your mission feed.',
  },
  {
    title: 'Scale Winning Ads',
    desc: 'Use data-backed recommendations to increase budgets and rotate new creatives safely.',
  },
];

const modules = [
  {
    icon: Gauge,
    title: 'Performance Radar',
    body: 'Real-time snapshot of spend, CTR, CPC, and conversion quality across active campaigns.',
  },
  {
    icon: Bot,
    title: 'AI Creative Studio',
    body: 'Generate copy, visual prompts, and script directions based on campaign context and metrics.',
  },
  {
    icon: Layers,
    title: 'Optimization Workflows',
    body: 'Detect fatigue early, triage budget leaks, and prioritize changes with confidence scores.',
  },
  {
    icon: ShieldCheck,
    title: 'Security & Ownership',
    body: 'You keep control over your data and campaigns while EZ Meta assists with recommendations.',
  },
];

export default function GuidePage() {
  return (
    <main className="cyber-grid relative min-h-[calc(100vh-128px)] overflow-hidden px-4 py-16 text-slate-100 md:py-24">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl space-y-14 md:space-y-20">
        <SectionReveal>
        <section className="cyber-panel p-8 md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-xs tracking-[0.18em] text-emerald-200 uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            Operator Guide
          </p>
          <h1 className="font-display mt-5 text-4xl leading-tight md:text-6xl">EZ Meta Documentation Hub</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            A high-end operating manual for campaign teams. Use this guide to launch faster, diagnose issues quickly,
            and scale profitable creatives with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/55 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10">
              View Plans
            </Link>
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delay={0.03}>
        <section className="space-y-6">
          <h2 className="font-display text-3xl text-white md:text-4xl">Quick Start Sequence</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickStart.map((step, index) => (
              <article key={step.title} className="cyber-panel p-5">
                <p className="text-xs tracking-[0.16em] text-emerald-200 uppercase">Step {(index + 1).toString().padStart(2, '0')}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delay={0.06}>
        <section className="space-y-6">
          <h2 className="font-display text-3xl text-white md:text-4xl">Core Modules</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {modules.map((module) => (
              <article key={module.title} className="cyber-panel p-6">
                <module.icon className="h-5 w-5 text-emerald-300" />
                <h3 className="mt-3 text-xl font-semibold text-white">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{module.body}</p>
              </article>
            ))}
          </div>
        </section>
        </SectionReveal>

        <SectionReveal delay={0.09}>
        <section className="cyber-panel p-6 md:p-8">
          <h2 className="font-display text-3xl text-white md:text-4xl">Operational Best Practices</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            {[
              'Review alert feed 2–3 times daily and mark each signal as acted/not-needed.',
              'Refresh creative assets when CTR falls >15% over 7 days.',
              'Scale only campaigns with stable ROAS and healthy frequency.',
              'Use weekly summaries to align decisions with your team or clients.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            Pro insight: keep one controlled experiment running every week for compounding performance gains.
          </p>
        </section>
        </SectionReveal>
      </div>
    </main>
  );
}

