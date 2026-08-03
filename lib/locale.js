// Server-only: reads the `lang` cookie (set by /api/lang).
// Must not be imported into client components — it uses next/headers.
import { cookies } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE } from './i18n';

export function getLocale() {
  const cookie = cookies().get('lang')?.value;
  return LOCALES.includes(cookie) ? cookie : DEFAULT_LOCALE;
}

// Precedence: URL ?lang= param wins, then the cookie, then the default (es).
export function resolveLocale({ cookie, param }) {
  if (LOCALES.includes(param)) return param;
  return LOCALES.includes(cookie) ? cookie : DEFAULT_LOCALE;
}
