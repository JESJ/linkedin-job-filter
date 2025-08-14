// dom/extract.js
import { norm } from '../utils/strings.js';

export function extractCompany(card, selectors) {
  for (const sel of selectors.companyTry) {
    const el = card.querySelector(sel);
    const n = norm(el?.innerText || '');
    if (n) return n;
  }
  const a = card.querySelector('a[aria-label*="Company"], a[aria-label*="company"]');
  return norm(a?.innerText || '');
}

export function getCardInfo(card, selectors, parseSalary) {
  const text = norm(card.innerText || '');
  const title = norm(card.querySelector(selectors.title)?.innerText || '');
  const company = extractCompany(card, selectors);
  const badgesText = text;
  const salary = parseSalary(card.innerText || '');
  const hasSalary = !!salary.hasSalary;
  const minSalary = salary.min; const maxSalary = salary.max;
  return { text, title, company, badgesText, hasSalary, minSalary, maxSalary };
}
