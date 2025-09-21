const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const themeBtn = $('#themeBtn');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

const cycleTheme = () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'auto';
  const next = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  if (themeBtn) themeBtn.title = `Tema: ${next}`;
};
themeBtn?.addEventListener('click', cycleTheme);

const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinks.classList.remove('open');
});

$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const linksMap = new Map($$('#navLinks a').map(a => [a.getAttribute('href'), a]));
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = linksMap.get(id);
    if (link) link.classList.toggle('active', entry.isIntersecting && entry.intersectionRatio > 0.6);
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: [0, .6, 1] });
$$('main section[id]').forEach(sec => io.observe(sec));

$('#year')?.append(new Date().getFullYear());

const form = $('#contactForm');
const statusEl = $('#formStatus');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  btn?.setAttribute('disabled', '');
  if (btn) btn.textContent = 'Enviando…';
  if (statusEl) statusEl.textContent = '';

  try {
    const fd = new FormData(form);
    fd.append('_captcha', 'false');
    fd.append('_subject', 'Consulta Android desde el portfolio');
    fd.append('_template', 'table');

    const resp = await fetch('https://formsubmit.co/ajax/santicabrerasemper8@gmail.com', {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    form.reset();
    if (statusEl) statusEl.textContent = '¡Mensaje enviado! ✅';
  } catch (err) {
    if (statusEl) statusEl.textContent = 'Hubo un error al enviar. Probá de nuevo.';
    console.error(err);
  } finally {
    if (btn) {
      btn.removeAttribute('disabled');
      btn.textContent = 'Enviar';
    }
  }
});
