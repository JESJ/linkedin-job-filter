// dom/selectors.js
export function getCardRoot(node) {
  if (!node) return null;
  let root = node.closest('li[data-occludable-job-id]');
  if (root) return root;
  root = node.closest('.job-card-container, .base-card, .base-search-card');
  if (root) return root;
  root = node.closest('li') || node.closest('div');
  return root || node;
}

export function selectJobCards(doc, selectors) {
  const nodes = [];
  selectors.cardRoots.forEach(sel => doc.querySelectorAll(sel).forEach(el => nodes.push(el)));
  doc.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => {
    const c = a.closest('li,div');
    if (c) nodes.push(c);
  });
  const set = new Set();
  nodes.forEach(n => set.add(getCardRoot(n) || n));
  return Array.from(set);
}
