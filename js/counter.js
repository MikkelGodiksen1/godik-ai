(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const features = document.querySelector('.hero__features');
  if (!features) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateValue(el, from, to, duration, suffix, onDone) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else if (onDone) {
        onDone();
      }
    }
    requestAnimationFrame(tick);
  }

  function runCounters() {
    const counters = features.querySelectorAll('.hero__feature-number[data-count-to]');

    counters.forEach(el => {
      const from = parseInt(el.dataset.countFrom || '0', 10);
      const to = parseInt(el.dataset.countTo, 10);
      const suffix = el.dataset.suffix || '';
      const bounce = el.dataset.countBounce === 'true';

      if (prefersReduced) {
        el.textContent = (bounce ? 0 : to) + suffix;
        return;
      }

      if (bounce) {
        // 0 → 1000 over 1.5s, pause 0.3s, then 1000 → 0 over 1.5s
        animateValue(el, 0, to, 1500, suffix, () => {
          setTimeout(() => {
            animateValue(el, to, 0, 1500, suffix);
          }, 300);
        });
      } else {
        animateValue(el, from, to, 2000, suffix);
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(features);
})();
