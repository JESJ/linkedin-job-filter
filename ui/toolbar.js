// ui/toolbar.js
export function createToolbar(ids, { onToggle, onOpen }) {
  if (document.getElementById(ids.toolbarId)) return document.getElementById(ids.toolbarId);
  const bar = document.createElement('div');
  bar.id = ids.toolbarId;
  bar.className = 'ljf-toolbar';
  bar.innerHTML = `
    <strong>${ids.strings.title}</strong>
    <span id="${ids.countsId}">–</span>
    <button class="ljf-toolbar__btn" id="${ids.toggleBtnId}">${ids.strings.btnShow}</button>
    <button class="ljf-toolbar__btn" id="${ids.openBtnId}">${ids.strings.btnOptions}</button>
  `;
  document.documentElement.appendChild(bar);

  bar.querySelector(`#${ids.toggleBtnId}`)?.addEventListener('click', onToggle);
  bar.querySelector(`#${ids.openBtnId}`)?.addEventListener('click', onOpen);
  return bar;
}

export function updateToggleButton(ids, showMuted) {
  const btn = document.getElementById(ids.toggleBtnId);
  if (!btn) return;
  btn.textContent = showMuted ? ids.strings.btnHide : ids.strings.btnShow;
}

export function updateCounts(ids, totals) {
  const el = document.getElementById(ids.countsId);
  if (el) el.textContent = `${totals.muted} filtered / ${totals.all} total`;
}
