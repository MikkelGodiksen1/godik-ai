document.addEventListener('DOMContentLoaded', () => {
  // Respect reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay for children inside grid/flex containers
        const parent = entry.target.parentElement;
        if (parent) {
          const style = getComputedStyle(parent);
          const isGridOrFlex = style.display === 'grid' || style.display === 'flex';

          if (isGridOrFlex) {
            const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
            const index = siblings.indexOf(entry.target);
            if (index >= 0) {
              entry.target.style.setProperty('--stagger-index', index);
            }
          }
        }

        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
});
