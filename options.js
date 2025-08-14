import { CONFIG } from './config.js';

(function () {
  const api = (typeof globalThis !== 'undefined' ? globalThis : window).browser ?? chrome;

  const DEFAULTS = {
    ui: { showMuted: true },
    tags: { excludePromoted: true, excludeApplied: true, excludeReposted: true },
    seniority: { enabled: true, keep: CONFIG.jobSeniority },
    salary: { requireListed: false, min: 0 },
    company: CONFIG.companies,
    keywords: { exclude: [] }
  };

  function deepMerge(base, override){
    const out = Array.isArray(base) ? base.slice() : {...base};
    for (const k in (override||{})){
      if (override[k] && typeof override[k] === 'object' && !Array.isArray(override[k])){
        out[k] = deepMerge(base[k] || {}, override[k]);
      } else {
        out[k] = override[k];
      }
    }
    return out;
  }

  const get = (id)=>document.getElementById(id);
  const getAll = (cls)=>Array.from(document.getElementsByClassName(cls));
  const toLines = (s)=> (s||'').split(/\r?\n/).map(x=>x.trim().toLowerCase()).filter(Boolean);
  const fromLines = (arr)=> (arr||[]).join("\n");

  function load(){
    api.storage.local.get('settings', (res)=>{
      const s = deepMerge(DEFAULTS, (res && res.settings) || {});
      // Clean legacy keys
      if (s.postedWindow) delete s.postedWindow;
      if (s.workModes) delete s.workModes;
      if (s.source) delete s.source;

      get('excludePromoted').checked = !!s.tags.excludePromoted;
      get('excludeApplied').checked  = !!s.tags.excludeApplied;
      get('excludeReposted').checked = !!s.tags.excludeReposted;

      get('seniorityEnabled').checked = !!s.seniority.enabled;
      getAll('seniority').forEach(cb => cb.checked = (s.seniority.keep||[]).includes(cb.value));

      get('requireSalary').checked = !!s.salary.requireListed;
      get('minSalary').value = s.salary.min || 0;

      get('whitelist').value = fromLines(s.company.whitelist || []);
      get('blacklist').value = fromLines(s.company.blacklist || []);

      get('excludeKeywords').value = fromLines(s.keywords.exclude || []);
    });
  }

  function save(){
    const seniorityKeep = getAll('seniority').filter(cb=>cb.checked).map(cb=>cb.value);

    const settings = {
      tags: {
        excludePromoted: get('excludePromoted').checked,
        excludeApplied:  get('excludeApplied').checked,
        excludeReposted: get('excludeReposted').checked
      },
      seniority: { enabled: get('seniorityEnabled').checked, keep: seniorityKeep },
      salary: { requireListed: get('requireSalary').checked, min: parseInt(get('minSalary').value || '0', 10) || 0 },
      company: { whitelist: toLines(get('whitelist').value), blacklist: toLines(get('blacklist').value) },
      keywords: { exclude: toLines(get('excludeKeywords').value) }
    };

    api.storage.local.set({ settings: deepMerge(DEFAULTS, settings) }, () => {
      const el = get('status'); el.textContent = 'Saved'; setTimeout(()=> el.textContent = '', 1000);
    });
  }

  function init(){
    load();
    get('save').addEventListener('click', save);
  }

  // <-- This is the key change
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
