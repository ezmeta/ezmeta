export type LandingLang = 'bm' | 'en';

export const landingDictionary = {
  bm: {
    nav: {
      features: 'Ciri',
      pricing: 'Harga',
      login: 'Log Masuk',
      explore: 'Teroka',
    },
    heroCta: 'Cuba Percuma',
    heroSubCta: 'Lihat Harga',
    featuresTitle: 'Ciri Premium untuk Scale Prestasi Iklan',
    featureCards: [
      {
        title: 'Dashboard Real-Time',
        desc: 'Pantau spend, CTR, CPC dan ROAS secara live dengan paparan yang jelas.',
      },
      {
        title: 'AI Creative Studio',
        desc: 'Jana idea copywriting dan creative baharu untuk naikkan conversion.',
      },
      {
        title: 'Optimization Intelligence',
        desc: 'Kenal pasti iklan rugi, pantau fatigue dan dapatkan cadangan tindakan pantas.',
      },
    ],
    pricingTitle: 'Pelan Harga Telus & Berimpak Tinggi',
    starterSubtitle: 'Untuk individu & pemula yang nak start monitor ads dengan betul.',
    proSubtitle: 'Untuk dropshipper & e-commerce yang nak automate semua.',
    agencySubtitle: 'Untuk agency & freelancer yang manage banyak client sekaligus.',
    mostPopular: 'PALING POPULAR',
    starterCta: 'Cuba Percuma',
    proCta: 'Langgan Pro',
    agencyCta: 'Hubungi Kami',
    comparisonTitle: 'Kenapa EZ Meta Lebih Laju Daripada Cara Manual',
    faqTitle: 'Soalan Lazim',
    faq1q: 'Adakah saya boleh tukar pelan bila-bila masa?',
    faq1a: 'Ya, anda boleh naik taraf atau turun taraf mengikut keperluan bisnes anda.',
    faq2q: 'Pelan mana sesuai untuk agensi?',
    faq2a: 'Pelan Agency paling sesuai kerana fokus pada multi-client, skala akaun dan branding.',
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      login: 'Login',
      explore: 'Explore',
    },
    heroCta: 'Try for Free',
    heroSubCta: 'View Pricing',
    featuresTitle: 'Premium Features Built for High-Scale Growth',
    featureCards: [
      {
        title: 'Real-time Dashboard',
        desc: 'Track spend, CTR, CPC, and ROAS live in a clean performance workspace.',
      },
      {
        title: 'AI Creative Studio',
        desc: 'Generate fresh ad copy and creative concepts to improve conversion rate.',
      },
      {
        title: 'Optimization Intelligence',
        desc: 'Identify waste, detect fatigue, and act faster with AI-driven recommendations.',
      },
    ],
    pricingTitle: 'Transparent Pricing for Teams That Want Results',
    starterSubtitle: 'For individuals and beginners who want to start monitoring ads properly.',
    proSubtitle: 'For dropshippers and e-commerce teams who want to automate everything.',
    agencySubtitle: 'For agencies and freelancers managing many clients at once.',
    mostPopular: 'MOST POPULAR',
    starterCta: 'Try for Free',
    proCta: 'Subscribe Pro',
    agencyCta: 'Contact Us',
    comparisonTitle: 'Why EZ Meta Beats Manual Workflow',
    faqTitle: 'Frequently Asked Questions',
    faq1q: 'Can I change my plan anytime?',
    faq1a: 'Yes. You can upgrade or downgrade anytime based on your business needs.',
    faq2q: 'Which plan is best for agencies?',
    faq2a: 'Agency plan is best for multi-client operations, account scaling, and branded reporting.',
  },
} as const;

