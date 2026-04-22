import './globals.css';
import type { Metadata } from 'next';
import {
  Bricolage_Grotesque,
  Geist,
  Instrument_Serif,
  Inter,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/providers/language-provider';
import { GlobalStyleSync } from '@/components/providers/global-style-sync';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { GlobalCursor } from '@/components/shared/global-cursor';
import { PageTransition } from '@/components/shared/page-transition';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800', '900'],
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  weight: ['400', '500', '600', '700'],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'EZ Meta',
  description: 'AI-powered SaaS platform for Meta Ads optimization and content generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${instrumentSerif.variable} ${plusJakartaSans.variable} ${geistSans.variable} ${bricolageGrotesque.variable} font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <GlobalStyleSync />
            <div className="min-h-screen bg-slate-950 text-slate-100">
              <GlobalCursor />
              <SiteHeader />
              <div className="relative">
                <div
                  className="pointer-events-none fixed inset-0 -z-10 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                <PageTransition>{children}</PageTransition>
              </div>
              <SiteFooter />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
