/* ============================================================
   CRYSTAL BEAUTY SALON — Interactions
   ============================================================ */
(function () {
  'use strict';

  var SALON_PHONE = '2347025335401';

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Price tabs ---------- */
  var tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      tabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.price-panel').forEach(function (p) {
        p.classList.toggle('active', p.id === target);
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Active nav (scroll spy) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  function spy() {
    var pos = window.scrollY + 130;
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbIndex = 0;

  function openLightbox(i) {
    if (!galleryItems.length) return;
    lbIndex = (i + galleryItems.length) % galleryItems.length;
    lbImg.setAttribute('src', galleryItems[lbIndex].getAttribute('href'));
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (lightbox && galleryItems.length) {
    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(i);
      });
    });
    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', function () { openLightbox(lbIndex - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { openLightbox(lbIndex + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------- Booking modal ---------- */
  var modal = document.getElementById('bookModal');
  var form = document.getElementById('bookForm');
  var success = document.getElementById('modalSuccess');
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = document.getElementById('bName');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  if (modal) {
    document.querySelectorAll('[data-book]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        success.classList.remove('show');
        form.style.display = '';
        openModal();
      });
    });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* ---------- Global keyboard (Escape + lightbox arrows) ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      if (modal && modal.classList.contains('open')) closeModal();
      if (lightbox && lightbox.classList.contains('open')) closeLightbox();
      return;
    }
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
    }
  });

  /* ---------- Date min = today ---------- */
  var dateInput = document.getElementById('bDate');
  if (dateInput) {
    var t = new Date();
    var iso = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    dateInput.min = iso;
  }

  /* ---------- Form validation + WhatsApp submit ---------- */
  function setInvalid(id, bad) {
    var field = document.getElementById(id).closest('.field');
    field.classList.toggle('invalid', bad);
    return !bad;
  }
  function prettyDate(v) {
    if (!v) return '';
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d)) return v;
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function prettyTime(v) {
    if (!v) return '';
    var parts = v.split(':');
    var h = parseInt(parts[0], 10), m = parts[1];
    var ampm = h >= 12 ? 'pm' : 'am';
    h = h % 12; if (h === 0) h = 12;
    return h + ':' + m + ampm;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('bName').value.trim();
      var phone = document.getElementById('bPhone').value.trim();
      var service = document.getElementById('bService').value;
      var stylist = document.getElementById('bStylist').value;
      var date = document.getElementById('bDate').value;
      var time = document.getElementById('bTime').value;
      var notes = document.getElementById('bNotes').value.trim();

      var ok = true;
      ok = setInvalid('bName', name.length < 2) && ok;
      ok = setInvalid('bPhone', phone.replace(/[^0-9]/g, '').length < 7) && ok;
      ok = setInvalid('bService', !service) && ok;
      ok = setInvalid('bDate', !date) && ok;
      ok = setInvalid('bTime', !time) && ok;

      if (!ok) {
        var firstBad = form.querySelector('.field.invalid input, .field.invalid select');
        if (firstBad) firstBad.focus();
        return;
      }

      var lines = [
        'Hello CRYSTAL Beauty Salon, I would like to book an appointment.',
        '',
        'Name: ' + name,
        'Phone: ' + phone,
        'Service: ' + service,
        'Stylist: ' + (stylist || 'No preference'),
        'Date: ' + prettyDate(date),
        'Time: ' + prettyTime(time)
      ];
      if (notes) lines.push('Notes: ' + notes);

      var url = 'https://wa.me/' + SALON_PHONE + '?text=' + encodeURIComponent(lines.join('\n'));
      var fallback = document.getElementById('waFallback');
      if (fallback) fallback.setAttribute('href', url);

      window.open(url, '_blank', 'noopener');
      form.style.display = 'none';
      success.classList.add('show');
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      function clear() {
        var f = el.closest('.field');
        if (f) f.classList.remove('invalid');
      }
      el.addEventListener('input', clear);
      el.addEventListener('change', clear);
    });
  }
})();
