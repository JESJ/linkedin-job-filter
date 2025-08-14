# LinkedIn Job Filter

Filters/mutes low‑value LinkedIn job cards (reposts, staffing spam, wrong seniority, additional salary filter and excluded keywords) and adds a small toolbar to toggle visibility and open options.

## Features
- Mutes cards by: **tags** (Promoted/Applied/Reposted), **company lists**, **seniority**, **salary threshold**, **excluded keywords**
- Lightweight content script, no frameworks
- Pure helpers split by domain (utils/dom/filters/ui)
- Cross‑browser: Chrome + Firefox (MV3)

---

## Build & Install

### Prereqs
- Node 18+
- `manifests/manifest.chrome.json` (uses `background.service_worker`)
- `manifests/manifest.firefox.json` (uses `background.scripts`)
- `scripts/build.mjs` (copies only needed files and swaps the manifest)

### Build
```bash
# Chrome build → dist/chrome
npm run build:chrome

# Firefox build → dist/firefox
npm run build:firefox
```

### Install

**Chrome (unpacked)**
1. Open `chrome://extensions`, enable **Developer mode**.
2. **Load unpacked** → select **`dist/chrome`** (the folder).

**Firefox (temporary)**
1. Open `about:debugging` → **This Firefox** → **Load Temporary Add-on…**
2. Pick **`dist/firefox/manifest.json`**.

> Optional: `npm run zip:chrome` / `npm run zip:firefox` create zipped builds in `dist/`.

---

## Quick Start (no build)
If you don’t want `dist/`, you can still load the repo root for quick tests:
- **Chrome**: Load the project folder directly (but `dist/` keeps things clean).
- **Firefox**: `about:debugging` → Load **`manifest.json`** (temporary).

---

## Cross‑Browser Manifest
This project uses a classic content script with **dynamic imports** (`import(api.runtime.getURL(...))`) so it runs in both browsers.

**Chrome (MV3 SW)**
```json
{ "background": { "service_worker": "background.js" } }
```

**Firefox (fallback background script)**
```json
{ "background": { "scripts": ["background.js"] } }
```

---

## Configure
Edit **`config.js`** to change:
- `defaults.ui` → toolbar IDs, strings, style text
- `defaults.tags` → label strings that mark Promoted/Applied/Reposted
- `jobSeniority` → terms to retain (e.g. `["senior","staff","principal","manager","director","lead"]`)
- `defaults.salary` → `min`, `requireListed`, parsing options
- `defaults.keywords.exclude` → muted terms
- `companies.whitelist` / `blacklist`

---

## How It Works (short)
- `content.js` runs on LinkedIn job pages.
- Loads `config.js` and helper modules via `import(api.runtime.getURL(...))`.
- Extracts info from each card → runs composable filters → annotates/mutes matching cards.
- Toolbar shows counts; toggle “show muted”; open options page.

---

## Common Errors
- **Cannot use import statement outside a module (content.js:1)**  
  Remove `"type": "module"` from `content_scripts` (classic script + dynamic imports).

- **Failed to fetch dynamically imported module**  
  Path wrong *or* missing in `web_accessible_resources`. Ensure the file exists in the extension and is listed under `resources`.

- **Cannot access 'api' before initialization**  
  Declare `const api = (globalThis.browser ?? chrome);` **before** any `import(api.runtime.getURL(...))` calls.

- **Identifier 'X' has already been declared**  
  Don’t export duplicate names from the same module. `filters/filters.js` uses unique names + `runAll`.

- **Firefox: nothing shows after “Load Temporary Add-on…”**  
  Check **Browser Console** (Shift+Cmd+J / Ctrl+Shift+J). If SW fails, use the Firefox background script variant.

---

## package.json scripts (reference)
```json
{
  "scripts": {
    "build:chrome": "node scripts/build.mjs chrome",
    "build:firefox": "node scripts/build.mjs firefox",
    "zip:chrome": "npm run build:chrome && cd dist/chrome && zip -r ../chrome.zip .",
    "zip:firefox": "npm run build:firefox && cd dist/firefox && zip -r ../firefox.zip ."
  }
}
```
