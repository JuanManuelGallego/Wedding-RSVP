import { describe, it, expect } from 'vitest';
import { makeSlug } from '@/lib/slug';

describe('makeSlug', () => {
  it('converts a name to a lowercase slug with random suffix', () => {
    const slug = makeSlug('The Alvarez Family');
    expect(slug).toMatch(/^the-alvarez-family-[a-z0-9]{4}$/);
  });

  it('trims whitespace', () => {
    const slug = makeSlug('  Manuela  ');
    expect(slug).toMatch(/^manuela-[a-z0-9]{4}$/);
  });

  it('replaces non-alphanumeric characters with hyphens', () => {
    const slug = makeSlug('Sam & Priya');
    expect(slug).toMatch(/^sam-priya-[a-z0-9]{4}$/);
  });

  it('handles empty string by returning just the suffix', () => {
    const slug = makeSlug('');
    expect(slug).toMatch(/^[a-z0-9]{4}$/);
  });

  it('strips leading and trailing hyphens', () => {
    const slug = makeSlug('---hello---');
    expect(slug).toMatch(/^hello-[a-z0-9]{4}$/);
  });

  it('generates unique slugs for the same input', () => {
    const slug1 = makeSlug('Test');
    const slug2 = makeSlug('Test');
    expect(slug1).not.toBe(slug2);
  });
});
