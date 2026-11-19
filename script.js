/* script.js — semua interaksi halaman (tanpa library tambahan) */
(function () {
  var d = document;

  // Preloader
  function hidePreloader() {
    var p = d.getElementById('preloader');
    if (!p) return;
    p.classList.add('hide');
    setTimeout(function () { p.remove(); }, 600);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 4000);

  // Topbar, tombol scroll-top, menu aktif
  var bar = d.getElementById('topbar');
  var topBtn = d.getElementById('scroll-top');
  var links = [].slice.call(d.querySelectorAll('.menu a[href^="#"]'));
  var sections = links.map(function (a) { return d.querySelector(a.getAttribute('href')); });

  function onScroll() {
    var y = window.scrollY;
    bar.classList.toggle('scrolled', y > 40);
    topBtn.classList.toggle('show', y > 500);
    var current = 0;
    sections.forEach(function (s, i) {
      if (s && s.offsetTop - 140 <= y) current = i;
    });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = d.getElementById('menu-toggle');
  var menu = d.getElementById('menu');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
  });
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  // Animasi muncul saat di-scroll (juga menjalankan progress bar skill)
  d.querySelectorAll('.svc-grid .reveal, .cert-grid .reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 0.12 + 's';
  });
  var items = [].slice.call(d.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Efek mengetik
  var target = d.getElementById('typed');
  if (target) {
    var words = (target.getAttribute('data-items') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      c += del ? -1 : 1;
      target.textContent = word.slice(0, c);
      var delay = del ? 45 : 95;
      if (!del && c === word.length) { del = true; delay = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    })();
  }

  // Zoom sertifikat (lightbox sederhana)
  function openLightbox(src, caption) {
    var lb = d.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = '<button class="lb-x" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
    var img = lb.querySelector('img');
    img.alt = caption || '';
    lb.querySelector('figcaption').textContent = caption || '';
    function close() {
      lb.classList.remove('show');
      d.removeEventListener('keydown', onKey);
      setTimeout(function () { lb.remove(); }, 250);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    img.onerror = close;
    img.src = src;
    lb.addEventListener('click', close);
    d.addEventListener('keydown', onKey);
    d.body.appendChild(lb);
    requestAnimationFrame(function () { lb.classList.add('show'); });
  }
  d.querySelectorAll('.cert').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(a.getAttribute('href'), a.getAttribute('title'));
    });
  });

  // Form kontak: buka aplikasi email (statis, tanpa server/database)
  var form = d.getElementById('contact-form');
  var sent = d.getElementById('sent-message');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nama = d.getElementById('name-field').value.trim();
      var email = d.getElementById('email-field').value.trim();
      var subjek = d.getElementById('subject-field').value.trim();
      var pesan = d.getElementById('message-field').value.trim();
      var body = 'Name: ' + nama + '\nEmail: ' + email + '\n\n' + pesan;
      window.location.href = 'mailto:arnesginting420@gmail.com' +
        '?subject=' + encodeURIComponent(subjek) +
        '&body=' + encodeURIComponent(body);
      sent.style.display = 'block';
      form.reset();
    });
  }
})();
