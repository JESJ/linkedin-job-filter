// utils/schedule.js
export function schedule(fn, delay) {
  let t = null;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
