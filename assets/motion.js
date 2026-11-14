// Motion: gentle entrances, counters, a typed message, a tilting phone, a light under the pointer.
// Everything shows at once, untouched, without JavaScript or with reduced motion.
window.pzMotion = 1;
(() => {
  const d = document, els = d.querySelectorAll('.reveal');
  d.querySelectorAll('.grid, .chips').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('in')); return; }
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const count = (el) => {
    const w = d.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) if (/\d/.test(w.currentNode.data)) nodes.push(w.currentNode);
    nodes.forEach((n) => {
      const text = n.data, t0 = performance.now();
      const step = (now) => {
        const k = ease(Math.min(1, (now - t0) / 1400));
        n.data = text.replace(/\d+/g, (m) => String(Math.round(+m * k)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const type = (el) => {
    const n = [...el.childNodes].filter((c) => c.nodeType === 3 && c.data.trim()).pop();
    if (!n) return;
    const full = n.data, sr = d.createElement('span'), out = d.createElement('span');
    sr.className = 'sr'; sr.textContent = full;
    out.className = 'typed'; out.setAttribute('aria-hidden', 'true');
    n.replaceWith(sr, out);
    let i = 0;
    const tick = () => { out.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(tick, 28 + Math.random() * 40); else out.classList.add('done'); };
    setTimeout(tick, 450);
  };
  const io = new IntersectionObserver((list) => {
    for (const e of list) {
      if (!e.isIntersecting) continue;
      const t = e.target;
      t.classList.add('in');
      t.querySelectorAll('.pill, h2').forEach((c) => { if (c.closest('#exemples, #fonctionnement') && /\d/.test(c.textContent)) { c.classList.add('count'); count(c); } });
      t.querySelectorAll('.bubble').forEach(type);
      io.unobserve(t);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  els.forEach((e) => io.observe(e));
  if (matchMedia('(hover: hover)').matches) {
    d.addEventListener('pointermove', (e) => {
      const c = e.target.closest && e.target.closest('.card');
      if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }
    }, { passive: true });
    const hero = d.querySelector('.hero'), stage = d.querySelector('.stage');
    if (hero && stage) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg'); stage.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { stage.style.setProperty('--ry', '0deg'); stage.style.setProperty('--rx', '0deg'); });
    }
  }
})();
