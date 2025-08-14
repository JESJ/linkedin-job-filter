(async () => {

  const api = (globalThis.browser ?? chrome);
  const { CONFIG } = await import(api.runtime.getURL('config.js'));
  const [settingsMod, stringsMod, salaryMod, scheduleMod, uiMod, toolbarMod, selectorsMod, extractMod, filtersMod] = await Promise.all([
    import(api.runtime.getURL('storage/settings.js')),
    import(api.runtime.getURL('utils/strings.js')),
    import(api.runtime.getURL('utils/salary.js')),
    import(api.runtime.getURL('utils/schedule.js')),
    import(api.runtime.getURL('ui/ui.js')),
    import(api.runtime.getURL('ui/toolbar.js')),
    import(api.runtime.getURL('dom/selectors.js')),
    import(api.runtime.getURL('dom/extract.js')),
    import(api.runtime.getURL('filters/filters.js'))
  ]);

  const { deepMerge, loadSettings, saveSettings } = settingsMod;
  const { norm, includesCompany } = stringsMod;
  const { parseSalary } = salaryMod;
  const { schedule } = scheduleMod;
  const { injectStyles, annotate } = uiMod;
  const { createToolbar, updateToggleButton, updateCounts } = toolbarMod;
  const { getCardRoot, selectJobCards } = selectorsMod;
  const { getCardInfo } = extractMod;
  const { runAll } = filtersMod;

  // Defaults
  const DEFAULTS = {
    ui: CONFIG.defaults.ui,
    tags: CONFIG.defaults.tags,
    seniority: { enabled: true, keep: CONFIG.jobSeniority },
    salary: CONFIG.defaults.salary,
    company: CONFIG.companies,
    keywords: CONFIG.defaults.keywords
  };

  let settings = deepMerge({}, DEFAULTS);
  let totals = { all: 0, muted: 0 };

  function apply(card) {
    const root = getCardRoot(card) || card;
    const info = getCardInfo(root, CONFIG.selectors, (t) => parseSalary(t, CONFIG.salary));
    const { reasons, flags } = runAll(info, settings, { includesCompany, norm }, CONFIG);
    const muted = !flags.whitelisted && reasons.length > 0;
    annotate(root, reasons, flags, CONFIG.ui);
    root.classList.toggle(CONFIG.ui.classMuted, muted);
    root.classList.toggle(CONFIG.ui.classHidden, muted && !settings.ui.showMuted);
    return muted;
  }

  const rescan = schedule(() => {
    totals = { all: 0, muted: 0 };
    const cards = selectJobCards(document, CONFIG.selectors);
    totals.all = cards.length;
    for (const card of cards) {
      try { if (apply(card)) totals.muted += 1; }
      catch {
        try {
          let pill = card.querySelector(`.${CONFIG.ui.classPill}`) || (() => {
            const p = document.createElement('span'); p.className = CONFIG.ui.classPill; card.appendChild(p); return p;
          })();
          pill.textContent = CONFIG.ui.strings.pillError;
          pill.style.display = 'inline-block';
        } catch {}
      }
    }
    updateCounts(CONFIG.ui, totals);
    updateToggleButton(CONFIG.ui, settings.ui.showMuted);
  }, CONFIG.behavior.debounceMs);

  function observe() {
    const obs = new MutationObserver(rescan);
    obs.observe(document.documentElement, CONFIG.behavior.observer);
    window.addEventListener('popstate', rescan, { passive: true });
    window.addEventListener('hashchange', rescan, { passive: true });
  }

  // Boot
  injectStyles(CONFIG.ui.styleText);
  createToolbar(CONFIG.ui, {
    onToggle: async () => {
      settings.ui.showMuted = !settings.ui.showMuted;
      await saveSettings(settings, api);
      updateToggleButton(CONFIG.ui, settings.ui.showMuted);
      rescan();
    },
    onOpen: () => {
      try { api.runtime.sendMessage({ type: 'OPEN_OPTIONS' }); }
      catch { window.open(api.runtime.getURL('options.html'), '_blank'); }
    }
  });
  settings = await loadSettings(DEFAULTS, api);
  updateToggleButton(CONFIG.ui, settings.ui.showMuted);
  rescan();
  observe();
})();
