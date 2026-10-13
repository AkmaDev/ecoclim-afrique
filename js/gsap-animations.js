/* ============================================================
   ECOCLIM — GSAP Animations
   Load sequence + ScrollTrigger scroll animations
   ============================================================ */

(function () {
  'use strict';

  const scroller = document.querySelector('[data-scroll-container]');

  /* ============================================================
     PRELOADER
  ============================================================ */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Dismiss preloader after bar animation (~1.4s)
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove from DOM after fade
      setTimeout(() => preloader.remove(), 700);

      // Trigger hero load animations
      runHeroAnimations();
    }, 1400);
  });

  /* ============================================================
     HERO — Load sequence animations
  ============================================================ */
  function runHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Nav drop in
    tl.fromTo('#nav', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0);

    // Eyebrow fade
    tl.fromTo('#heroEyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.2);

    // Headline words stagger
    const words = document.querySelectorAll('.hero__headline-word');
    tl.fromTo(
      words,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
      0.3
    );

    // Sub paragraph
    tl.fromTo(
      '#heroSub',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.65
    );

    // Actions
    tl.fromTo(
      '#heroActions',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.8
    );

    // Marquee band
    tl.fromTo(
      '#heroMarquee',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      1.0
    );
  }

  /* ============================================================
     SCROLL ANIMATIONS — statement band clip-path wipe
  ============================================================ */
  function initScrollAnimations() {
    // Statement text wipe
    gsap.fromTo(
      '#statementText',
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#statementText',
          scroller,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Statement arrow
    gsap.fromTo(
      '#statementArrow',
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#statementText',
          scroller,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Services bento tiles stagger
    gsap.fromTo(
      '.service-tile',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.bento-grid',
          scroller,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Stats count-up
    document.querySelectorAll('.stats__number[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';

      ScrollTrigger.create({
        trigger: el,
        scroller,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              const v = Math.round(this.targets()[0].val);
              const formatted = v >= 1000
                ? v.toLocaleString('fr-FR')
                : v;
              el.textContent = prefix + formatted + suffix;
            }
          });
        }
      });
    });

    // À Propos image clip-path reveal
    gsap.fromTo(
      '#aboutImage',
      { clipPath: 'inset(0 0 0 100%)' },
      {
        clipPath: 'inset(0 0 0 0%)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: '.about-split',
          scroller,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );

    // À Propos text stagger
    gsap.fromTo(
      ['#aboutTitle', '#aboutText', '#aboutValues'],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-split__content',
          scroller,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Blog cards stagger
    gsap.fromTo(
      '.blog-card',
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blog-track',
          scroller,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Contact CTA stagger
    gsap.fromTo(
      ['#ctaQuestion', '#ctaDetails'],
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-cta',
          scroller,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  /* ============================================================
     BLOG TRACK — drag to scroll
  ============================================================ */
  function initBlogDrag() {
    const track = document.getElementById('blogTrack');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', e => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* ============================================================
     Init — wait for Locomotive to be ready
  ============================================================ */
  // Small delay to ensure Locomotive + ScrollTrigger proxy is set up
  setTimeout(() => {
    initScrollAnimations();
    initBlogDrag();
    ScrollTrigger.refresh();
  }, 200);

})();
