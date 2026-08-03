import { describe, it, expect } from 'vitest';
import { guestInsertSchema, guestUpdateSchema, loginSchema, langSchema } from '@/lib/validations';

describe('validations', () => {
  describe('guestInsertSchema', () => {
    it('accepts valid guest data', () => {
      const result = guestInsertSchema.safeParse({
        display_name: 'The Alvarez Family',
        party_size: 3,
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const result = guestInsertSchema.safeParse({
        display_name: '',
        party_size: 1,
      });
      expect(result.success).toBe(false);
    });

    it('defaults party_size to 1', () => {
      const result = guestInsertSchema.safeParse({
        display_name: 'Test Guest',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.party_size).toBe(1);
      }
    });
  });

  describe('guestUpdateSchema', () => {
    it('accepts partial updates', () => {
      const result = guestUpdateSchema.safeParse({
        display_name: 'Updated Name',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid lang', () => {
      const result = guestUpdateSchema.safeParse({
        lang: 'de',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid lang values', () => {
      expect(guestUpdateSchema.safeParse({ lang: 'es' }).success).toBe(true);
      expect(guestUpdateSchema.safeParse({ lang: 'fr' }).success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('accepts non-empty password', () => {
      expect(loginSchema.safeParse({ password: 'secret' }).success).toBe(true);
    });

    it('rejects empty password', () => {
      expect(loginSchema.safeParse({ password: '' }).success).toBe(false);
    });
  });

  describe('langSchema', () => {
    it('accepts valid locales', () => {
      expect(langSchema.safeParse({ locale: 'es' }).success).toBe(true);
      expect(langSchema.safeParse({ locale: 'fr' }).success).toBe(true);
    });

    it('rejects invalid locale', () => {
      expect(langSchema.safeParse({ locale: 'de' }).success).toBe(false);
    });
  });
});
