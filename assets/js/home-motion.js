document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const image = document.querySelector('.hero-image');
  const overlay = document.querySelector('.home-overlay');

  if (!hero || !image || !overlay) return;

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
    image.style.transform = `translate3d(0, ${progress * -36}px, 0) scale(1.08)`;
    overlay.style.transform = 'translate3d(0, 0, 0)';
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
});
