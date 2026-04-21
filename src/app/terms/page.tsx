export default function TermsOfServicePage() {
  return (
    <main className="cyber-grid relative min-h-[calc(100vh-128px)] overflow-hidden px-4 py-16 text-slate-100 md:py-24">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl">
        <article className="cyber-panel p-8 md:p-10">
          <h1 className="font-display text-4xl text-white md:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-400">Last Updated: April 20, 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300">
            <section>
              <h2 className="font-display text-2xl text-white">1. Agreement to Terms</h2>
              <p className="mt-2">By using EZ Meta, you agree to these terms and all applicable laws and regulations.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">2. License & Usage</h2>
              <p className="mt-2">You receive a limited, revocable license to access our services. You may not misuse, reverse engineer, redistribute, or mirror the platform.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">3. Subscription & Billing</h2>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>Fees are billed according to your selected plan cycle.</li>
                <li>Plans renew automatically unless canceled.</li>
                <li>Cancellation keeps access until the current billing period ends.</li>
                <li>Refund decisions follow applicable law and case review.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">4. Meta API Integration</h2>
              <p className="mt-2">You authorize EZ Meta to access approved ad account data through official Meta APIs. API functionality may change at Meta’s discretion.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">5. AI-Generated Content</h2>
              <p className="mt-2">You remain responsible for reviewing AI outputs before publishing. EZ Meta provides decision support, not legal or compliance guarantees.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">6. Disclaimer & Liability</h2>
              <p className="mt-2">Services are provided “as is” without warranties. To the fullest extent allowed by law, EZ Meta is not liable for indirect or consequential losses.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">7. Contact</h2>
              <p className="mt-2">Questions about these terms can be sent to legal@ezmeta.com.</p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

