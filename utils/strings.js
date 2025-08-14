// utils/strings.js
export const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function includesCompany(companyText, term) {
  const t = (term || '').trim();
  if (!t) return false;
  const re = new RegExp(`(^|[^a-z0-9])${escapeRegex(t)}([^a-z0-9]|$)`, 'i');
  return re.test(companyText || '');
}
