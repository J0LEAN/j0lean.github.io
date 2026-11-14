// The rule section: while it is pinned, scrolling walks through the six macros. Each step swaps the
// "When" and "Do" clauses and lights the matching macro on the phone. Small dots under the phone jump
// to a step. Without this script the six rules read as a plain list (see site.css).
window.pzMotion = 1;
(() => {
  const d = document;
  const rule = d.querySelector('.rule');
  if (!rule) return;
  const scenes = [...rule.querySelectorAll('.scene')];
  const items = [...rule.querySelectorAll('.m')];
  const list = rule.querySelector('.screen ul');
  const grid = rule.querySelector('.rule-grid');
  const n = scenes.length;
  if (!n) return;

  const dots = d.createElement('div');
  dots.className = 'rule-dots';
  const buttons = scenes.map((s, i) => {
    const b = d.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', (items[i] && items[i].textContent.trim()) || String(i + 1));
    b.addEventListener('click', () => go(i));
    dots.append(b);
    return b;
  });
  grid.append(dots);

  let current = -1;
  const show = (i) => {
    if (i === current) return;
    current = i;
    scenes.forEach((s, k) => { s.classList.toggle('is-on', k === i); s.classList.toggle('is-past', k < i); });
    items.forEach((m, k) => m.classList.toggle('is-on', k === i));
    buttons.forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    if (list) list.style.setProperty('--at', Math.max(0, Math.min(i - 1, n - 3)));
  };

  // Where the page must be for step i: the section's scrollable length is cut into n equal parts.
  const span = () => rule.offsetHeight - (innerHeight - (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--header')) || 64));
  const top = () => rule.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(d.documentElement).getPropertyValue('--header')) || 64);
  const go = (i) => {
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollTo({ top: top() + (span() * (i + 0.5)) / n, behavior: smooth ? 'smooth' : 'auto' });
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const p = (scrollY - top()) / Math.max(1, span());
    show(Math.max(0, Math.min(n - 1, Math.floor(p * n))));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();
