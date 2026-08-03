import { describe, it, expect } from 'vitest';
import { t, translations, LOCALES, DEFAULT_LOCALE } from '@/lib/i18n';

describe('i18n', () => {
  describe('t()', () => {
    it('returns the translated string for a given locale and key', () => {
      expect(t('es', 'yes')).toBe('Sí');
      expect(t('fr', 'yes')).toBe('Oui');
    });

    it('returns the key itself if not found in any locale', () => {
      expect(t('es', 'nonexistent_key')).toBe('nonexistent_key');
    });

    it('interpolates variables', () => {
      const result = t('es', 'partyNote', { count: 3 });
      expect(result).toBe('Tu invitación incluye 3 invitados.');
    });

    it('leaves missing variables as-is', () => {
      const result = t('es', 'partyNote');
      expect(result).toBe('Tu invitación incluye {count} invitados.');
    });
  });

  describe('LOCALES', () => {
    it('contains exactly es and fr', () => {
      expect(LOCALES).toEqual(['es', 'fr']);
    });
  });

  describe('DEFAULT_LOCALE', () => {
    it('is es', () => {
      expect(DEFAULT_LOCALE).toBe('es');
    });
  });

  describe('translations', () => {
    it('has the same keys in both locales', () => {
      const esKeys = Object.keys(translations.es).sort();
      const frKeys = Object.keys(translations.fr).sort();
      expect(esKeys).toEqual(frKeys);
    });

    it('has no empty strings', () => {
      for (const locale of LOCALES) {
        for (const [, value] of Object.entries(translations[locale])) {
          expect(value).not.toBe('');
        }
      }
    });
  });
});
