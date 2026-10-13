/* ============================================================
   ECOCLIM — Locomotive Scroll + GSAP ScrollTrigger proxy
   CRITICAL: ScrollerProxy must be set up BEFORE any ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const scrollContainer = document.querySelector('[data-scroll-container]');

  // Init Locomotive Scroll
  const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    multiplier: 0.8,
    lerp: 0.08,
    smartphone: {
      smooth: false
    },
    tablet: {
      smooth: false,
      breakpoint: 1024
    }
  });

  // --------------------------------------------------------
  // GSAP ScrollTrigger proxy — MANDATORY for correct offsets
  // --------------------------------------------------------
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    // Fix for pinType when using Locomotive (transforms vs fixed)
    pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
  });

  // Keep ScrollTrigger in sync with Locomotive scroll events
  locoScroll.on('scroll', ScrollTrigger.update);

  // After GSAP recalculates positions, update Locomotive
  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());

  // Refresh ScrollTrigger after full initialization
  ScrollTrigger.refresh();

  // Nav scroll state
  locoScroll.on('scroll', ({ scroll }) => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    if (scroll.y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Expose to other scripts
  window.locoScroll = locoScroll;
})();
