(() => {
  const form = document.getElementById('hero-form');
  if (!form) return;

  const steps = form.querySelectorAll('.hero-form__step[data-step]');
  const dots = form.querySelectorAll('.hero-form__dot');
  const data = {};
  let current = 1;

  // Danish phone: 8 digits, optionally prefixed with +45
  function isValidDanishPhone(val) {
    const cleaned = val.replace(/[\s\-().]/g, '');
    return /^(\+45)?\d{8}$/.test(cleaned);
  }

  // Basic email validation
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
  }

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

    const activeStep = form.querySelector('.hero-form__step.active');
    if (activeStep) {
      const input = activeStep.querySelector('.hero-form__input');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }

  function showError(input, msg) {
    input.classList.add('hero-form__input--error');
    // Remove existing error message
    const existing = input.parentNode.querySelector('.hero-form__error');
    if (existing) existing.remove();
    // Add error message
    const el = document.createElement('span');
    el.className = 'hero-form__error';
    el.textContent = msg;
    input.after(el);
    input.focus();
  }

  function clearError(input) {
    input.classList.remove('hero-form__input--error');
    const existing = input.parentNode.querySelector('.hero-form__error');
    if (existing) existing.remove();
  }

  // "Næste" buttons
  form.querySelectorAll('.hero-form__next').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.closest('.hero-form__step');
      const input = step.querySelector('.hero-form__input');
      if (input && !input.value.trim()) {
        showError(input, 'Udfyld venligst dette felt');
        return;
      }

      // Phone validation (step 4)
      if (input && input.name === 'phone') {
        if (!isValidDanishPhone(input.value.trim())) {
          showError(input, 'Indtast et gyldigt dansk telefonnummer (8 cifre)');
          return;
        }
      }

      if (input) {
        clearError(input);
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
      clearError(input);
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
    if (emailInput) {
      const email = emailInput.value.trim();
      if (!isValidEmail(email)) {
        showError(emailInput, 'Indtast en gyldig emailadresse');
        return;
      }
      data.email = email;
    }

    // Send to Telegram
    const msg = `🌐 Ny henvendelse fra Godik.ai\n\n` +
      `🏢 Virksomhed: ${data.company || '-'}\n` +
      `📋 Type: ${data.type || '-'}\n` +
      `👤 Navn: ${data.name || '-'}\n` +
      `📞 Telefon: ${data.phone || '-'}\n` +
      `📧 Email: ${data.email || '-'}`;

    fetch('https://api.telegram.org/bot8386618676:AAHGK32MGSU58lqnC5keUdVQH5ZqE0yTaEU/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: 6339427304, text: msg })
    }).catch(() => {});

    showStep('done');
  });
})();
