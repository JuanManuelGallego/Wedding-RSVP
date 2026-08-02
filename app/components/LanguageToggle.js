'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  const [locale, setLocale] = useState(cookieLocale);

  if (pathname?.startsWith('/admin')) return null;

  async function switchTo(next) {
    if (next === locale) return;
    setLocale(next);
    await fetch('/api/lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  return (
    <div className="lang-toggle" role="group" aria-label="Idioma / Langue">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={l === locale}
          onClick={() => switchTo(l)}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
