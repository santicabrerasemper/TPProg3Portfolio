
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

const MSG = {
  name: 'Decime tu nombre.',
  email: 'Necesito un email válido para poder responderte.',
  phone: '',
  projectType: 'Elegí el tipo de proyecto.',
  timeline: 'Indicá el plazo estimado.',
  budget: 'Seleccioná un rango de presupuesto.',
  ref: '',
  message: 'Contame brevemente tu idea o necesidad.'
};

Object.keys(MSG).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;


  el.addEventListener('invalid', (ev) => {
    ev.preventDefault();
    el.setCustomValidity(MSG[id] || '');
    el.reportValidity();
  });

  const clear = () => el.setCustomValidity('');
  el.addEventListener('input', clear);
  el.addEventListener('change', clear);

  if (id === 'email') {
    el.addEventListener('input', () => {
      el.setCustomValidity('');
      if (el.value && el.validity.typeMismatch) {
        el.setCustomValidity('El email no parece válido (ej: nombre@dominio.com).');
      }
    });
  }
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const val = id => ($('#' + id)?.value || '').trim();
  const name = val('name');
  const email = val('email');
  const phone = val('phone');
  const projectType = val('projectType');
  const timeline = val('timeline');
  const budget = val('budget');
  const ref = val('ref');
  const message = val('message');

  const to = 'santicabrerasemper8@gmail.com';
  const subject = encodeURIComponent(`Consulta Android • ${name}`);

  const body = encodeURIComponent([
    `Nombre: ${name}`,
    `Email: ${email}`,
    phone ? `Teléfono: ${phone}` : null,
    `Tipo de proyecto: ${projectType}`,
    `Plazo: ${timeline}`,
    `Presupuesto: ${budget}`,
    ref ? `Referencia: ${ref}` : null,
    '',
    'Mensaje:',
    message
  ].filter(Boolean).join('\n'));

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  form.reset();
});




