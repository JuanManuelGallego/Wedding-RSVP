import { cookies } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE } from './i18n';
import type { Locale } from './types';

export function getLocale(): Locale {
  const cookie = cookies().get('lang')?.value;
  return LOCALES.includes(cookie as Locale) ? (cookie as Locale) : DEFAULT_LOCALE;
}

export function resolveLocale({
  cookie,
  param,
  fallback,
}: {
  cookie?: string;
  param?: string;
  fallback?: Locale;
}): Locale {
  if (param && LOCALES.includes(param as Locale)) return param as Locale;
  if (cookie && LOCALES.includes(cookie as Locale)) return cookie as Locale;
  if (fallback && LOCALES.includes(fallback)) return fallback;
  return DEFAULT_LOCALE;
}
