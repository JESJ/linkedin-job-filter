// scripts/build.mjs
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const TARGET = (process.argv[2] || process.env.TARGET || '').toLowerCase();
if (!['chrome', 'firefox'].includes(TARGET)) {
  console.error('Usage: node scripts/build.mjs <chrome|firefox>');
  process.exit(1);
}

const DIST = path.join(root, 'dist', TARGET);
const MANIFESTS = {
  chrome: path.join(root, 'manifests', 'manifest.chrome.json'),
  firefox: path.join(root, 'manifests', 'manifest.firefox.json'),
};

const ALLOW_ROOT = new Set([
  'background.js',
  'content.js',
  'options.html',
  'options.js',
  'config.js',
]);

const ALLOW_DIRS = new Set([
  'storage',
  'utils',
  'dom',
  'filters',
  'ui',
  'config',
  'icons',
  'images',
  'assets',
  'styles',
  '_locales',
]);

const SKIP_NAMES = new Set(['node_modules', '.git', 'dist', 'manifests', 'scripts', '.DS_Store']);

async function rmrf(p) { await fs.rm(p, { recursive: true, force: true }); }
async function mkdirp(p) { await fs.mkdir(p, { recursive: true }); }

async function copySelected(src, dst, rel = '') {
  const dir = rel ? path.join(src, rel) : src;
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const it of items) {
    const name = it.name;
    if (!rel && SKIP_NAMES.has(name)) continue;

    const relPath = rel ? `${rel}/${name}` : name;
    const s = path.join(src, relPath);
    const d = path.join(dst, relPath);

    if (it.isDirectory()) {
      if (!rel && !ALLOW_DIRS.has(name)) continue; // only enforce at repo root
      await mkdirp(d);
      await copySelected(src, dst, relPath);
      continue;
    }

    // files
    if (!rel && !ALLOW_ROOT.has(name)) continue; // only enforce at repo root
    await fs.copyFile(s, d);
  }
}

function assert(cond, msg) { if (!cond) { console.error(msg); process.exit(1); } }

async function normalizeManifest(manifestPath) {
  const json = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

  // strip "type":"module" from all content scripts
  if (Array.isArray(json.content_scripts)) {
    json.content_scripts = json.content_scripts.map((cs) => {
      const rest = { ...cs };
      if ('type' in rest) delete rest.type;
      return rest;
    });
  }

  if (TARGET === 'chrome') {
    // Chrome: service_worker only
    if (json.background?.scripts) delete json.background.scripts;
    assert(json.background?.service_worker, 'Chrome manifest must have background.service_worker');
  } else {
    // Firefox: scripts only
    if (!json.background) json.background = {};
    delete json.background.service_worker;
    if (!Array.isArray(json.background.scripts) || !json.background.scripts.length) {
      json.background.scripts = ['background.js'];
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(json, null, 2));
  return json;
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  await rmrf(DIST);
  await mkdirp(DIST);
  await copySelected(root, DIST);

  // swap manifest
  const srcManifest = MANIFESTS[TARGET];
  assert(await fileExists(srcManifest), `Missing ${srcManifest}`);
  const dstManifest = path.join(DIST, 'manifest.json');
  await fs.copyFile(srcManifest, dstManifest);

  const normalized = await normalizeManifest(dstManifest);

  // Guard rails: ensure options assets made it
  for (const req of ['options.html', 'options.js']) {
    const p = path.join(DIST, req);
    assert(await fileExists(p), `Build is missing ${req} in dist/${TARGET}. Add it to ALLOW_ROOT if needed.`);
  }

  console.log(`Built ${TARGET} → ${DIST}`);
  console.log('Background field:', normalized.background);
}

main().catch(e => { console.error(e); process.exit(1); });
