/* ============================================================
   ECOCLIM — Scroll Sequence
   Frame-by-frame image sequence tied to scroll position.
   Frames: assets/images/service-frames/frame-001.jpg → frame-NNN.jpg
   Technique from the Animated Website tutorial.
   ============================================================ */

(function () {
  'use strict';

  const FRAME_COUNT = 60;  // Adjust to actual number of frames
  const FRAME_PATH  = 'assets/images/service-frames/frame-';
  const FRAME_EXT   = '.jpg';

  const seqSection  = document.getElementById('scrollSequence');
  const seqCanvas   = document.getElementById('seqCanvas');
  const panels      = document.querySelectorAll('.scroll-sequence__panel');

  if (!seqSection || !seqCanvas) return;

  // --------------------------------------------------------
  // Build frame URL list
  // --------------------------------------------------------
  function frameUrl(index) {
    const padded = String(index + 1).padStart(3, '0');
    return `${FRAME_PATH}${padded}${FRAME_EXT}`;
  }

  // --------------------------------------------------------
  // Preload all frames
  // --------------------------------------------------------
  const frames = [];
  let framesLoaded = 0;
  let framesReady  = false;

  function preloadFrames() {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => {
        framesLoaded++;
        if (framesLoaded === FRAME_COUNT) {
          framesReady = true;
          // Show first frame immediately
          seqCanvas.src = frames[0].src;
        }
      };
      img.onerror = () => {
        // Frame not found — reduce FRAME_COUNT gracefully
        framesLoaded++;
      };
      img.src = frameUrl(i);
      frames.push(img);
    }
  }

  // --------------------------------------------------------
  // Update frame based on scroll progress (0–1)
  // --------------------------------------------------------
  function updateFrame(progress) {
    if (!framesReady) return;
    const index = Math.min(
      FRAME_COUNT - 1,
      Math.floor(progress * FRAME_COUNT)
    );
    const frame = frames[index];
    if (frame && frame.complete && seqCanvas.src !== frame.src) {
      seqCanvas.src = frame.src;
    }
  }

  // --------------------------------------------------------
  // Update text panel based on scroll progress
  // --------------------------------------------------------
  function updatePanel(progress) {
    const panelIndex = Math.min(
      panels.length - 1,
      Math.floor(progress * panels.length)
    );
    panels.forEach((panel, i) => {
      panel.classList.toggle('active', i === panelIndex);
    });
  }

  // --------------------------------------------------------
  // Observe scroll progress via GSAP ScrollTrigger
  // --------------------------------------------------------
  function initScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    const scroller = document.querySelector('[data-scroll-container]');

    ScrollTrigger.create({
      trigger: seqSection,
      scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: self => {
        updateFrame(self.progress);
        updatePanel(self.progress);
      }
    });
  }

  // --------------------------------------------------------
  // Fallback: native scroll (no Locomotive, for mobile)
  // --------------------------------------------------------
  function initNativeScroll() {
    function onScroll() {
      const rect = seqSection.getBoundingClientRect();
      const totalHeight = seqSection.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalHeight);
      updateFrame(progress);
      updatePanel(progress);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --------------------------------------------------------
  // Init
  // --------------------------------------------------------
  preloadFrames();

  // Wait for Locomotive + GSAP to be ready
  setTimeout(() => {
    if (typeof LocomotiveScroll !== 'undefined' && window.locoScroll) {
      initScrollTrigger();
    } else {
      initNativeScroll();
    }
  }, 300);

})();
