document.addEventListener('DOMContentLoaded', () => {
  let lastY = window.scrollY;
  const navs = document.querySelectorAll('.main-nav, .blog-nav');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navs.forEach(nav => {
      if (y > lastY && y > 100) {
        // scrolled down past 100px → hide
        nav.classList.add('nav-hidden');
      } else {
        // scrolled up or near top → show
        nav.classList.remove('nav-hidden');
      }
    });
    lastY = y <= 0 ? 0 : y;
  });
});
