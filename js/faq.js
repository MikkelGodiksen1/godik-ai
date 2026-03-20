document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('details.faq__item');

  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });
});
