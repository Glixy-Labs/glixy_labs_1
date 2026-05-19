/* ============================================
   Glixy Aether — welcome / signup overlay.
   Runs on first launch when no glixy_token in localStorage.
   ============================================ */
(function () {
  const TOKEN_KEY = 'glixy_token';
  const SKIP_KEY  = 'glixy_skip_signup';
  const API_BASE  = localStorage.getItem('glixy_api_base') || 'https://glixy-labs.onrender.com';

  const overlay  = document.getElementById('welcomeOverlay');
  const form     = document.getElementById('welcomeForm');
  const tabs     = document.querySelectorAll('.welcome-tab');
  const errBox   = document.getElementById('welcomeError');
  const submit   = document.getElementById('welcomeSubmit');
  const nameRow  = document.getElementById('welcomeNameRow');
  const skipBtn  = document.getElementById('welcomeSkip');

  if (!overlay) return;

  const token   = localStorage.getItem(TOKEN_KEY);
  const skipped = localStorage.getItem(SKIP_KEY) === '1';
  if (token || skipped) return;
  overlay.style.display = 'flex';

  function setMode(mode) {
    form.dataset.mode = mode;
    tabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
    submit.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
    nameRow.style.display = mode === 'signup' ? '' : 'none';
    nameRow.querySelectorAll('input').forEach(i => { i.required = mode === 'signup'; });
    errBox.hidden = true;
  }

  tabs.forEach(t => t.addEventListener('click', () => setMode(t.dataset.mode)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.hidden = true;
    const mode = form.dataset.mode;
    const data = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    const originalText = submit.textContent;
    submit.textContent = mode === 'signup' ? 'Creating account…' : 'Signing in…';

    try {
      const res = await fetch(API_BASE + '/api/user-auth.php?action=' + mode, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || ('HTTP ' + res.status));
      if (out.token) localStorage.setItem(TOKEN_KEY, out.token);
      overlay.style.display = 'none';
    } catch (err) {
      errBox.textContent = err.message || 'Something went wrong. Try again.';
      errBox.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = originalText;
    }
  });

  skipBtn.addEventListener('click', () => {
    localStorage.setItem(SKIP_KEY, '1');
    overlay.style.display = 'none';
  });
})();
