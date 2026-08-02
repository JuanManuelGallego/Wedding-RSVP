export function makeSlug(name) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return base ? `${base}-${suffix}` : suffix;
}
