export function makeSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 4);
  return base ? `${base}-${suffix}` : suffix;
}
