(() => {
  // Danish phone: 8 digits, optionally prefixed with +45
  function isValidDanishPhone(val) {
    const cleaned = val.replace(/[\s\-().]/g, '');
    return /^(\+45)?\d{8}$/.test(cleaned);
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
  }

  function sendToTelegram(data) {
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
  }

  function initForm(formEl) {
    if (!formEl) return;

    const prefix = formEl.id === 'hero-form' ? 'hero-form' : 'cta-form';
    const steps = formEl.querySelectorAll(`.${prefix}__step[data-step]`);
    const dots = formEl.querySelectorAll(`.${prefix}__dot`);
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

      const activeStep = formEl.querySelector(`.${prefix}__step.active`);
      if (activeStep) {
        const input = activeStep.querySelector(`.${prefix}__input`);
        if (input) setTimeout(() => input.focus(), 150);
      }
    }

    function showError(input, msg) {
      input.classList.add(`${prefix}__input--error`);
      const existing = input.parentNode.querySelector(`.${prefix}__error`);
      if (existing) existing.remove();
      const el = document.createElement('span');
      el.className = `${prefix}__error`;
      el.textContent = msg;
      input.after(el);
      input.focus();
    }

    function clearError(input) {
      input.classList.remove(`${prefix}__input--error`);
      const existing = input.parentNode.querySelector(`.${prefix}__error`);
      if (existing) existing.remove();
    }

    // "Næste" buttons
    formEl.querySelectorAll(`.${prefix}__next`).forEach(btn => {
      btn.addEventListener('click', () => {
        const step = btn.closest(`.${prefix}__step`);
        const input = step.querySelector(`.${prefix}__input`);
        if (input && !input.value.trim()) {
          showError(input, 'Udfyld venligst dette felt');
          return;
        }

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

    // Enter key
    formEl.querySelectorAll(`.${prefix}__input`).forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const btn = input.closest(`.${prefix}__step`).querySelector(`.${prefix}__next, .${prefix}__submit`);
          if (btn) btn.click();
        }
      });
      input.addEventListener('input', () => clearError(input));
    });

    // Choice buttons
    formEl.querySelectorAll(`.${prefix}__choice`).forEach(btn => {
      btn.addEventListener('click', () => {
        formEl.querySelectorAll(`.${prefix}__choice`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        data.type = btn.dataset.value;
        setTimeout(() => showStep(3), 300);
      });
    });

    // Submit
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = formEl.querySelector('[name="email"]');
      if (emailInput) {
        const email = emailInput.value.trim();
        if (!isValidEmail(email)) {
          showError(emailInput, 'Indtast en gyldig emailadresse');
          return;
        }
        data.email = email;
      }
      sendToTelegram(data);
      showStep('done');
    });
  }

  // Init both forms
  initForm(document.getElementById('hero-form'));
  initForm(document.getElementById('cta-form'));
})();
