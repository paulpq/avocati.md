// ============================================================
//  Site behaviour: i18n, mobile menu, scroll reveal, form
// ============================================================

(function () {
  var SUPPORTED = ['ro', 'ru', 'en', 'it'];
  var DEFAULT = 'ro';

  function getLang() {
    var url = new URLSearchParams(window.location.search).get('lang');
    if (url && SUPPORTED.indexOf(url) !== -1) return url;
    try {
      var stored = localStorage.getItem('site_lang');
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    var nav = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED.indexOf(nav) !== -1) return nav;
    return DEFAULT;
  }

  function applyLang(lang) {
    var dict = window.I18N[lang];
    if (!dict) return;

    document.documentElement.lang = dict.htmlLang || lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    var titleKey = document.body.getAttribute('data-title-key');
    if (titleKey && dict[titleKey]) {
      document.title = dict[titleKey] + ' — BAA Ariadna Dodi & Gheorghe Iudin';
    }

    document.querySelectorAll('.lang a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem('site_lang', lang); } catch (e) {}
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    applyLang(lang);
    var u = new URL(window.location.href);
    u.searchParams.set('lang', lang);
    history.replaceState(null, '', u);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang());

    document.querySelectorAll('.lang a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        setLang(a.getAttribute('data-lang'));
      });
    });

    var burger = document.querySelector('.burger');
    var menu = document.querySelector('.menu');
    if (burger && menu) {
      burger.addEventListener('click', function () { menu.classList.toggle('open'); });
    }

    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      items.forEach(function (el, i) {
        el.style.transitionDelay = (Math.min(i % 4, 3) * 0.08) + 's';
        obs.observe(el);
      });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }

    var form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var lang = getLang();
        var note = document.getElementById('formNote');
        if (note) {
          note.style.display = 'block';
          note.textContent = (window.I18N[lang] && window.I18N[lang]['con.fSuccess']) || 'Thank you!';
        }
        form.reset();
      });
    }
  });
})();
