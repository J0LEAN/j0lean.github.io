// Macro cards in the examples slide in as they reach the screen. Without this script they are simply shown.
window.pzMotion = 1;
(() => {
  const cards = document.querySelectorAll('.macros .macro');
  if (!cards.length || !('IntersectionObserver' in window)) { cards.forEach((c) => c.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const i = [...cards].indexOf(e.target);
    e.target.style.transitionDelay = `${(i % 3) * 80}ms`;
    e.target.classList.add('in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -10% 0px' });
  cards.forEach((c) => io.observe(c));
})();
