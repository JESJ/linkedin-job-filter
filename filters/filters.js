import { norm as defaultNorm } from '../utils/strings.js';

// tags
export function matchTags(info, settings, CONFIG, reasons) {
  if (!settings?.tags) return;
  if (settings.tags.excludePromoted && CONFIG.tags.promoted.some(k => info.badgesText.includes(k))) reasons.push('Promoted');
  if (settings.tags.excludeApplied  && CONFIG.tags.applied.some(k  => info.badgesText.includes(k)))  reasons.push('Applied');
  if (settings.tags.excludeReposted && CONFIG.tags.reposted.some(k => info.badgesText.includes(k))) reasons.push('Reposted');
}

// companies
export function matchCompanies(info, settings, includesCompany, flags, reasons) {
  const wl = new Set((settings.company?.whitelist || []).map(s => (s || '').toLowerCase().trim()));
  const bl = new Set((settings.company?.blacklist || []).map(s => (s || '').toLowerCase().trim()));
  const comp = (info.company || '').toLowerCase().trim();
  if (comp && Array.from(wl).some(w => includesCompany(comp, w))) { flags.whitelisted = true; return; }
  if (comp && Array.from(bl).some(b => includesCompany(comp, b))) reasons.push('Blacklisted company');
}

// seniority
export function matchSeniority(info, settings, reasons) {
  if (!settings.seniority?.enabled) return;
  const keep = settings.seniority.keep || [];
  const has = keep.some(k => info.title.includes(k));
  if (!has) reasons.push('Seniority');
}

// salary
export function matchSalary(info, settings, reasons) {
  const s = settings.salary || {};
  const threshold = parseInt(s.min, 10) || 0;
  if (s.requireListed && !info.hasSalary) { reasons.push('No salary listed'); return; }
  if (!threshold) return;
  if (info.hasSalary) {
    const max = info.maxSalary != null ? info.maxSalary : info.minSalary;
    if (max != null && max < threshold) reasons.push(`Salary<${threshold}`);
  }
}

// keywords
export function matchKeywords(info, settings, normFn, reasons) {
  const n = typeof normFn === 'function' ? normFn : defaultNorm;
  const ex = (settings.keywords?.exclude || []).map(n).filter(Boolean);
  if (ex.length && ex.some(k => info.text.includes(k))) reasons.push('Excluded keyword');
}

// compose
export function runAll(info, settings, helpers = {}, CONFIG) {
  const reasons = [];
  const flags = { whitelisted: false };
  const inc = helpers.includesCompany;
  const nfn = helpers.norm || defaultNorm;

  matchTags(info, settings, CONFIG, reasons);
  matchCompanies(info, settings, inc, flags, reasons);
  if (!flags.whitelisted) {
    matchSeniority(info, settings, reasons);
    matchSalary(info, settings, reasons);
    matchKeywords(info, settings, nfn, reasons);
  }
  return { reasons, flags };
}
