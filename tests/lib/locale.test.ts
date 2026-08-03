import { describe, it, expect } from 'vitest';
import { resolveLocale } from '@/lib/locale';
import { DEFAULT_LOCALE } from '@/lib/i18n';

describe('resolveLocale', () => {
  it('returns param if it is a valid locale', () => {
    expect(resolveLocale({ param: 'fr' })).toBe('fr');
  });

  it('returns cookie if param is invalid but cookie is valid', () => {
    expect(resolveLocale({ param: 'de', cookie: 'fr' })).toBe('fr');
  });

  it('returns fallback if param and cookie are invalid', () => {
    expect(resolveLocale({ param: 'de', cookie: 'de', fallback: 'fr' })).toBe('fr');
  });

  it('returns default if nothing is valid', () => {
    expect(resolveLocale({})).toBe(DEFAULT_LOCALE);
  });

  it('param takes precedence over cookie', () => {
    expect(resolveLocale({ param: 'fr', cookie: 'es' })).toBe('fr');
  });

  it('cookie takes precedence over fallback', () => {
    expect(resolveLocale({ cookie: 'fr', fallback: 'es' })).toBe('fr');
  });
});
