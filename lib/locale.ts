import { cookies } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE } from './i18n';
import type { Locale } from './types';

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value) && (LOCALES as readonly string[]).includes(value!);
}

export function asLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return asLocale(cookieStore.get('lang')?.value);
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
  if (isLocale(param)) return param;
  if (isLocale(cookie)) return cookie;
  if (fallback) return fallback;
  return DEFAULT_LOCALE;
}
