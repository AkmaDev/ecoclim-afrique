/* ============================================================
   ECOCLIM — Navigation JS
   Hamburger toggle + mobile overlay
   ============================================================ */

(function () {
  'use strict';

  const burger    = document.getElementById('navBurger');
  const mobile    = document.getElementById('navMobile');
  const closeBtn  = document.getElementById('navClose');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!burger || !mobile) return;

  function openMenu() {
    burger.classList.add('open');
    mobile.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Stagger mobile links
    mobileLinks.forEach((link, i) => {
      link.style.transitionDelay = `${0.05 + i * 0.06}s`;
    });
  }

  function closeMenu() {
    burger.classList.remove('open');
    mobile.classList.remove('open');
    document.body.style.overflow = '';

    mobileLinks.forEach(link => {
      link.style.transitionDelay = '0s';
    });
  }

  burger.addEventListener('click', () => {
    mobile.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) link.classList.add('active');
  });

})();
