document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  const CARD_WIDTH = 374; // 350px card + 24px gap
  const AUTO_INTERVAL = 4000;
  const RESUME_DELAY = 3000;

  let autoTimer = null;
  let resumeTimer = null;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;

  // --- Auto-scroll ---

  function scrollNext() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
    }
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoTimer = setInterval(scrollNext, AUTO_INTERVAL);
  }

  function stopAutoScroll() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoScroll, RESUME_DELAY);
  }

  // --- Pause on hover / touch ---

  track.addEventListener('mouseenter', () => {
    stopAutoScroll();
    if (resumeTimer) clearTimeout(resumeTimer);
  });

  track.addEventListener('mouseleave', () => {
    if (!isDragging) scheduleResume();
  });

  track.addEventListener('touchstart', () => {
    stopAutoScroll();
    if (resumeTimer) clearTimeout(resumeTimer);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    scheduleResume();
  }, { passive: true });

  // --- Drag / swipe via pointer events ---

  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    track.style.cursor = 'grabbing';
    track.style.scrollBehavior = 'auto';
    stopAutoScroll();
    if (resumeTimer) clearTimeout(resumeTimer);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.pageX - startX;
    track.scrollLeft = scrollStart - dx;
  });

  track.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.releasePointerCapture(e.pointerId);
    track.style.cursor = '';
    track.style.scrollBehavior = '';
    scheduleResume();
  });

  track.addEventListener('pointercancel', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.releasePointerCapture(e.pointerId);
    track.style.cursor = '';
    track.style.scrollBehavior = '';
    scheduleResume();
  });

  // Prevent link clicks after dragging
  track.addEventListener('click', (e) => {
    if (Math.abs(scrollStart - track.scrollLeft) > 5) {
      e.preventDefault();
    }
  });

  // --- Start ---
  startAutoScroll();
});
