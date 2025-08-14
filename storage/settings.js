// storage/settings.js
export function deepMerge(base, override) {
  const out = Array.isArray(base) ? base.slice() : { ...base };
  for (const k in (override || {})) {
    const v = override[k];
    out[k] = (v && typeof v === 'object' && !Array.isArray(v))
      ? deepMerge(base?.[k] || {}, v)
      : v;
  }
  return out;
}

export function loadSettings(DEFAULTS, api) {
  return new Promise((resolve) => {
    api.storage.local.get('settings', (res) => {
      const s = res?.settings || {};
      if (s.postedWindow) delete s.postedWindow;
      if (s.workModes) delete s.workModes;
      if (s.source) delete s.source;
      resolve(deepMerge(DEFAULTS, s));
    });
  });
}

export function saveSettings(newSettings, api) {
  return new Promise((resolve) => api.storage.local.set({ settings: newSettings }, resolve));
}
