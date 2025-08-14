// utils/salary.js
export function parseSalary(textRaw, cfg) {
  const { ignoreHourly, minYearlyFloor, suffixK, suffixM } = cfg;
  const text = (textRaw || '').toLowerCase();
  const moneyRe = /(?:[$£€]\s*)?(\d{2,3}(?:[,.\s]?\d{3})?|\d{2,3})(\s*[km])?(?:\s*(?:per)?\s*(hour|hr|day|week|mo|month|yr|year|annum))?/gi;
  const nums = [];
  let m;
  while ((m = moneyRe.exec(text)) !== null) {
    let raw = (m[1] || '').replace(/[,\s.]/g, '');
    if (!raw) continue;
    let n = parseInt(raw, 10);
    const suf = (m[2] || '').trim();
    const per = (m[3] || '').trim();
    if (suffixK && suf === 'k') n *= 1_000;
    if (suffixM && suf === 'm') n *= 1_000_000;
    const hourly = /^(hour|hr|day|week|mo|month)$/.test(per);
    const yearly = /^(yr|year|annum)$/.test(per);
    if (ignoreHourly && hourly) continue;
    if (!yearly && n < minYearlyFloor) continue;
    nums.push(n);
  }
  if (!nums.length) return { hasSalary: false, min: null, max: null };
  nums.sort((a, b) => a - b);
  return { hasSalary: true, min: nums[0], max: nums[nums.length - 1] };
}
