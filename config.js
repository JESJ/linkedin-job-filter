export const CONFIG = {
  jobSeniority: ["senior","staff","principal","manager","director","lead"],
  companies: {
    whitelist: [
      "oracle", "meta", "amazon", "microsoft", "apple", "netflix", "adobe", "salesforce",
      "stripe", "shopify", "snowflake", "datadog", "twilio", "atlassian", "nvidia"
    ],
    blacklist: [
      "simplyapply", "remoteworker", "jobot", "dice", "aha", "veeva systems", "talentify.io",
      "cybercoders", "hiremefast", "phoenix recruitment", "tekjobs", "dataannotation",
      "archesys", "underdog", "patterned learning ai", "ryder system, inc.", "tietalent",
      "lensa", "jobright", "wiraa", "applicantz", "insight global", "jobgether", "hirenza",
      "micro1", "acceler8", "braintrust", "revature", "actalent", "jobs by allup", "mindrift",
      "gainwell technologies"
    ]
  },
  tags: {
      promoted: ["promoted"],
      applied:  ["applied"],
      reposted: ["reposted"]
    },
    selectors: {
      cardRoots: [
        'li[data-occludable-job-id]',
        'li.reusable-search__result-container',
        'div.jobs-search-results__list-item',
        'div.job-card-container',
        'div.base-card',
        'div.base-search-card'
      ],
      title: 'a[href*="/jobs/view/"]',
      companyTry: [
        '[data-company-name]',
        '.job-card-container__company-name',
        '.job-card-container__primary-description',
        '.base-search-card__subtitle',
        'h4.base-search-card__subtitle',
        'h4.base-search-card__subtitle a',
        '.artdeco-entity-lockup__subtitle',
        '.base-card__subtitle',
        'a[href*="/company/"]'
      ]
    },
    ui: {
      classMuted: 'ljf-muted',
      classHidden: 'ljf-hidden',
      classPill: 'ljf-pill',
      classBadge: 'ljf-badge',
      toolbarId: 'ljf-toolbar',
      toggleBtnId: 'ljf-toggle-muted',
      openBtnId: 'ljf-open-options',
      countsId: 'ljf-counts',
      strings: {
        title: 'LinkedIn Job Filter',
        btnShow: 'Show filtered',
        btnHide: 'Hide filtered',
        btnOptions: 'Options',
        pillFilteredPrefix: 'Filtered: ',
        pillError: 'Filtered: Error',
        badgeWhitelisted: 'Whitelisted'
      },
      styleText: `
        .ljf-muted { filter: grayscale(1); opacity: .55 !important; }
        .ljf-hidden { display: none !important; }
        .ljf-toolbar { position: fixed; bottom:16px; left:16px; z-index:2147483647;
          background:#fff; border:1px solid rgba(0,0,0,.12); border-radius:8px;
          box-shadow:0 6px 14px rgba(0,0,0,.12); padding:10px 12px;
          font:13px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
          color:#111; display:flex; gap:8px; align-items:center; }
        .ljf-toolbar__btn { cursor:pointer; padding:4px 8px; border-radius:6px; border:1px solid rgba(0,0,0,.1); background:#f8f8f8; }
        .ljf-pill { position:absolute; top:6px; right:6px; font-size:11px; background:#f0f0f0; border:1px solid rgba(0,0,0,.1); border-radius:999px; padding:2px 6px; color:#333; }
        .ljf-card { position:relative; min-height:48px; }
        .ljf-badge { margin-left:6px; font-size:11px; background:#e8f5e9; border:1px solid #c8e6c9; padding:2px 6px; border-radius:999px; }
        .ljf-pill.salary { background:#ffdddd !important; border-color:#ffaaaa !important; color:#900 !important; }
      `
    },
    behavior: {
      debounceMs: 150,
      observer: { childList: true, subtree: true }
    },
    salary: {
      ignoreHourly: true,
      minYearlyFloor: 10000,
      suffixK: true,
      suffixM: true
    },
    defaults: {
      ui: { showMuted: true },
      tags: { excludePromoted: true, excludeApplied: true, excludeReposted: true },
      salary: { requireListed: false, min: 0 },
      keywords: { exclude: [] }
    }
};
