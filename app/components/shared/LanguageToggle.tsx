'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

const LABELS: Record<Locale, string> = { es: 'ES', fr: 'FR' };

function cookieLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  return LOCALES.includes(match?.[1] as Locale) ? (match?.[1] as Locale) : DEFAULT_LOCALE;
}

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>(cookieLocale);

  if (pathname?.startsWith('/admin')) return null;

  const urlLocale = searchParams.get('lang');
  const active =
    urlLocale && LOCALES.includes(urlLocale as Locale) ? (urlLocale as Locale) : locale;

  async function switchTo(next: Locale) {
    if (next === active) return;
    setLocale(next);
    await fetch('/api/lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: next }),
    });
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('lang', next);
    router.replace(`${pathname}?${sp.toString()}`);
    router.refresh();
  }

  return (
    <div className="lang-toggle" role="group" aria-label="Idioma / Langue">
      {LOCALES.map((l: Locale) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === active}
          onClick={() => switchTo(l)}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
