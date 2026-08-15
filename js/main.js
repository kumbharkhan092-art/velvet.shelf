/* ==========================================================================
   VELVET SHELF — shared site behavior
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      // Close all first (accordion behavior — comment out this block if you want multiple open at once)
      document.querySelectorAll('.faq-item').forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Affiliate click tracking ----------
     Every affiliate link is marked rel="sponsored" in the HTML.
     This logs the click locally now. When you add Supabase (or any
     backend), swap the console.log for the fetch/insert call — the
     hook point is already wired up so you don't have to touch your
     HTML again later. */
  document.querySelectorAll('a[rel~="sponsored"]').forEach((link) => {
    link.addEventListener('click', () => {
      const payload = {
        product: link.dataset.product || link.textContent.trim(),
        niche: link.dataset.niche || document.body.dataset.niche || 'unknown',
        href: link.href,
        timestamp: new Date().toISOString()
      };

      console.log('[Velvet Shelf] affiliate click:', payload);

      /* Example for later, once Supabase is connected:
      fetch('https://YOUR_PROJECT.supabase.co/rest/v1/clicks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'YOUR_ANON_KEY'
        },
        body: JSON.stringify(payload)
      });
      */
    });
  });

  /* ---------- Sticky mobile CTA ----------
     Shows a floating "Shop the Edit" bar on mobile once the hero
     is scrolled past, so there's always a CTA in thumb's reach. */
  const stickyCta = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    const onScroll = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      stickyCta.classList.toggle('is-active', heroBottom < 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Header shadow on scroll ---------- */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const onHeaderScroll = () => {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  /* ---------- Hero image carousel ----------
     Each .hero-carousel holds a .hero-carousel-track of slides, prev/
     next arrows, and dot buttons. Auto-advances every 6s, pauses on
     hover/focus, and respects prefers-reduced-motion by turning
     autoplay off (manual arrows/dots still work). Drop in as many or
     as few slides as you like — this reads whatever is in the markup. */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.hero-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.hero-carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.hero-carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    const dots = Array.from(carousel.querySelectorAll('.carousel-dots .dot'));
    if (!track || slides.length <= 1) return;

    let index = 0;
    let timer = null;

    const goTo = (newIndex) => {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', String(i === index));
      });
    };

    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    const startAutoplay = () => {
      if (prefersReducedMotion) return;
      stopAutoplay();
      timer = window.setInterval(next, 6000);
    };
    const stopAutoplay = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAutoplay(); });
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    /* Basic touch swipe support */
    let touchStartX = null;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (delta > 40) prev();
      else if (delta < -40) next();
      touchStartX = null;
      startAutoplay();
    });

    goTo(0);
    startAutoplay();
  });

});
