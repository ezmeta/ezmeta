'use client';

import { useEffect } from 'react';

type GlobalStyleSettings = {
  primary_theme_color?: string;
  highlight_color?: string;
  button_bg_color?: string;
  button_text_color?: string;
  font_family?: string;
  pricing_button_bg_color?: string;
  pricing_button_text_color?: string;
};

const FALLBACK = {
  primary_theme_color: '#00FF94',
  highlight_color: '#00FF94',
  button_bg_color: '#22c55e',
  button_text_color: '#020617',
  font_family: 'Inter, sans-serif',
  pricing_button_bg_color: '#22c55e',
  pricing_button_text_color: '#020617',
};

function resolveFontFamily(value?: string): string {
  if (!value || value === 'default') {
    return 'var(--font-geist-sans), Geist, Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  }

  if (value === 'Instrument Serif') {
    return 'var(--font-instrument-serif), "Instrument Serif", "Times New Roman", Georgia, serif';
  }
  if (value === 'Cal Sans') {
    return '"Cal Sans", Inter, system-ui, sans-serif';
  }
  if (value === 'Plus Jakarta Sans') {
    return 'var(--font-plus-jakarta-sans), "Plus Jakarta Sans", Inter, system-ui, sans-serif';
  }
  if (value === 'Geist Sans') {
    return 'var(--font-geist-sans), Geist, Inter, system-ui, sans-serif';
  }
  if (value === 'Bricolage Grotesque') {
    return 'var(--font-bricolage-grotesque), "Bricolage Grotesque", Inter, system-ui, sans-serif';
  }

  if (value === 'Inter, sans-serif') {
    return 'var(--font-sans), Inter, system-ui, sans-serif';
  }
  if (value === 'Poppins, sans-serif') {
    return 'Poppins, Inter, system-ui, sans-serif';
  }
  if (value === 'Montserrat, sans-serif') {
    return 'Montserrat, Inter, system-ui, sans-serif';
  }
  if (value === 'system-ui, sans-serif') {
    return 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  }

  return value;
}

function resolveHeadingFontFamily(value?: string): string {
  if (value === 'Instrument Serif') {
    return 'var(--font-instrument-serif), "Instrument Serif", "Times New Roman", Georgia, serif';
  }
  return resolveFontFamily(value);
}

function applyGlobalStyles(settings: GlobalStyleSettings) {
  const root = document.documentElement;
  const primary = settings.primary_theme_color || FALLBACK.primary_theme_color;
  const highlight = settings.highlight_color || FALLBACK.highlight_color;
  const buttonBg = settings.button_bg_color || FALLBACK.button_bg_color;
  const buttonText = settings.button_text_color || FALLBACK.button_text_color;
  const pricingButtonBg = settings.pricing_button_bg_color || buttonBg;
  const pricingButtonText = settings.pricing_button_text_color || buttonText;
  const fontFamily = resolveFontFamily(settings.font_family || FALLBACK.font_family);
  const headingFontFamily = resolveHeadingFontFamily(settings.font_family || FALLBACK.font_family);

  root.style.setProperty('--ez-primary-theme', primary);
  root.style.setProperty('--ez-highlight-color', highlight);
  root.style.setProperty('--primary-color', highlight);
  root.style.setProperty('--ez-button-bg', buttonBg);
  root.style.setProperty('--ez-button-text', buttonText);
  root.style.setProperty('--ez-pricing-button-bg', pricingButtonBg);
  root.style.setProperty('--ez-pricing-button-text', pricingButtonText);
  root.style.setProperty('--ez-font-family', fontFamily);
  root.style.setProperty('--ez-heading-font', headingFontFamily);
  document.body.style.fontFamily = 'var(--ez-font-family)';
}

export function GlobalStyleSync() {
  useEffect(() => {
    let active = true;

    async function hydrateStyles() {
      try {
        const response = await fetch('/api/site-settings', { cache: 'no-store' });
        if (!response.ok) {
          applyGlobalStyles(FALLBACK);
          return;
        }
        const data = (await response.json()) as GlobalStyleSettings;
        if (!active) return;
        applyGlobalStyles(data);
      } catch {
        applyGlobalStyles(FALLBACK);
      }
    }

    applyGlobalStyles(FALLBACK);
    void hydrateStyles();

    return () => {
      active = false;
    };
  }, []);

  return null;
}

