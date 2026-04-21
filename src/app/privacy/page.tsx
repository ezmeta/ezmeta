export default function PrivacyPolicyPage() {
  return (
    <main className="cyber-grid relative min-h-[calc(100vh-128px)] overflow-hidden px-4 py-16 text-slate-100 md:py-24">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-sky-400/15 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl">
        <article className="cyber-panel p-8 md:p-10">
          <h1 className="font-display text-4xl text-white md:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-400">Last Updated: April 20, 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300">
            <section>
              <h2 className="font-display text-2xl text-white">1. Introduction</h2>
              <p className="mt-2">Welcome to EZ Meta ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">2. Information We Collect</h2>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li><strong>Personal Information:</strong> Name, email address, and billing information when you register for an account.</li>
                <li><strong>Meta Ad Account Data:</strong> Performance data retrieved through the Meta Graph API after connection.</li>
                <li><strong>Usage Data:</strong> Feature usage, AI generations, and interaction patterns.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, operating system, and platform diagnostics.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">3. How We Use Your Information</h2>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage subscriptions</li>
                <li>Retrieve and analyze ad performance data you authorize</li>
                <li>Generate AI-powered outputs based on campaign context</li>
                <li>Send service updates, notices, and security communication</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">4. Data Sharing and Disclosure</h2>
              <p className="mt-2">We may share data with essential service providers, Meta (for connected API operations), legal authorities when required, and during lawful business transfers.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">5. Security</h2>
              <p className="mt-2">We apply practical administrative and technical controls to protect your information. No internet transmission method is absolutely secure.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">6. Your Rights</h2>
              <p className="mt-2">Depending on jurisdiction, you may request access, correction, deletion, restriction, objection, and data portability. Contact: privacy@ezmeta.com.</p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white">7. Contact</h2>
              <p className="mt-2">Questions regarding this policy can be sent to privacy@ezmeta.com.</p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}

