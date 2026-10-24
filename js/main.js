document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const drop = document.querySelector('.nav-dropdown');
  const trigger = document.querySelector('.dropdown-toggle');

  const setMenu = open => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  const setDrop = open => {
    drop.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
  };

  menu?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  trigger?.addEventListener('click', () => setDrop(!drop.classList.contains('open')));

  // close dropdown when clicking elsewhere, close everything on Escape
  document.addEventListener('click', e => { if (drop && !drop.contains(e.target)) setDrop(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (drop) setDrop(false);
    if (nav?.classList.contains('open')) { setMenu(false); menu.focus(); }
  });
  // leaving the mobile layout resets the menu state
  window.matchMedia('(min-width: 941px)').addEventListener('change', e => { if (e.matches && nav) setMenu(false); });

  document.querySelector('#year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));

  // scroll reveal (content is only hidden when JS is running)
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    }), { threshold: .08 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('visible'));
  }

  // enquiry form -> opens the visitor's email app
  const form = document.querySelector('#enquiry-form');
  if (form) {
    const slug = new URLSearchParams(location.search).get('service');
    const opt = [...form.querySelectorAll('option')].find(o => o.dataset.slug === slug);
    if (opt) form.elements.service.value = opt.value;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = 'Bodogen enquiry: ' + d.get('service');
      const body = 'Name: ' + d.get('name') + '\nEmail: ' + d.get('email') + '\nService: ' + d.get('service') + '\n\n' + d.get('message');
      location.href = 'mailto:bodogenconstructionltd@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
});
