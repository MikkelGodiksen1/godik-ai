(() => {
  const form = document.getElementById('hero-form');
  if (!form) return;

  const steps = form.querySelectorAll('.hero-form__step[data-step]');
  const dots = form.querySelectorAll('.hero-form__dot');
  const data = {};
  let current = 1;

  function showStep(n) {
    steps.forEach(s => {
      const isTarget = s.dataset.step === String(n) || s.dataset.step === n;
      s.classList.toggle('active', isTarget);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i < (typeof n === 'number' ? n : 5));
      dot.classList.toggle('done', i < (typeof n === 'number' ? n - 1 : 5));
    });

    current = n;

    // Auto-focus input in new step
    const activeStep = form.querySelector('.hero-form__step.active');
    if (activeStep) {
      const input = activeStep.querySelector('.hero-form__input');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }

  // "Næste" buttons
  form.querySelectorAll('.hero-form__next').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.hero-form__step');
      const input = step.querySelector('.hero-form__input');
      if (input && !input.value.trim()) {
        input.classList.add('hero-form__input--error');
        input.focus();
        return;
      }
      if (input) {
        input.classList.remove('hero-form__input--error');
        data[input.name] = input.value.trim();
      }
      showStep(current + 1);
    });
  });

  // Enter key on inputs
  form.querySelectorAll('.hero-form__input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const btn = input.closest('.hero-form__step').querySelector('.hero-form__next, .hero-form__submit');
        if (btn) btn.click();
      }
    });

    input.addEventListener('input', () => {
      input.classList.remove('hero-form__input--error');
    });
  });

  // Choice buttons (step 2)
  form.querySelectorAll('.hero-form__choice').forEach(btn => {
    btn.addEventListener('click', () => {
      form.querySelectorAll('.hero-form__choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      data.type = btn.dataset.value;
      setTimeout(() => showStep(3), 300);
    });
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('[name="email"]');
    if (emailInput) data.email = emailInput.value.trim();
    console.log('Form data:', data);
    showStep('done');
  });
})();
