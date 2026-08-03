'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LOCALES, DEFAULT_LOCALE } from '../../lib/i18n';

const LABELS = { es: 'ES', fr: 'FR' };

function cookieLocale() {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  return LOCALES.includes(match?.[1]) ? match[1] : DEFAULT_LOCALE;
}

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState(cookieLocale);

  if (pathname?.startsWith('/admin')) return null;

  const urlLocale = searchParams.get('lang');
  const active = urlLocale && LOCALES.includes(urlLocale) ? urlLocale : locale;

  async function switchTo(next) {
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
      {LOCALES.map((l) => (
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
