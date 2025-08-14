// ui/styles.js
export function injectStyles(styleText) {
  if (document.getElementById('ljf-style')) return;
  const style = document.createElement('style');
  style.id = 'ljf-style';
  style.textContent = styleText;
  document.documentElement.appendChild(style);
}

// ui/annotate.js
export function annotate(card, reasons, flags, uiCfg) {
  card.classList.add('ljf-card');

  const pillClass = uiCfg.classPill;
  const badgeClass = uiCfg.classBadge;

  card.querySelectorAll(`.${pillClass}`).forEach((el, idx) => { if (idx > 0) el.remove(); });

  let pill = card.querySelector(`.${pillClass}`);
  if (!pill) { pill = document.createElement('span'); pill.className = pillClass; card.appendChild(pill); }

  if (flags.whitelisted) {
    let b = card.querySelector(`.${badgeClass}`);
    if (!b) { b = document.createElement('span'); b.className = badgeClass; b.textContent = uiCfg.strings.badgeWhitelisted; pill.after(b); }
  }

  const txt = reasons.length ? uiCfg.strings.pillFilteredPrefix + reasons.join(', ') : '';
  if (reasons.some(r => /^Salary</.test(r))) pill.classList.add('salary'); else pill.classList.remove('salary');
  pill.textContent = txt;
  pill.style.display = reasons.length ? 'inline-block' : 'none';
}
