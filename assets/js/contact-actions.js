document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-email-button').forEach(button => {
    button.addEventListener('click', async () => {
      const user = button.dataset.user;
      const domain = button.dataset.domain;
      if (!user || !domain) return;
      const email = `${user}@${domain}`;

      try {
        await navigator.clipboard.writeText(email);
        const originalText = button.textContent;
        button.textContent = 'Copied';
        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1400);
      } catch (_) {
        button.textContent = 'Copy failed';
      }
    });
  });
});
