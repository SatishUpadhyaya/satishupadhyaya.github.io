/* satishupadhyaya.github.io — vanilla JS, no dependencies */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Nav: elevate on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Nav: mobile toggle ---------- */
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  function closeMenu() {
    if (!links) return;
    links.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---------- Scroll spy ---------- */
  var navAnchors = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    // Track every section's state rather than reacting to single entries, so
    // that scrolling back up into the hero — where nothing is in view — clears
    // the highlight instead of leaving the last section stuck as active.
    var inView = {};

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView[entry.target.id] = entry.isIntersecting;
      });

      var activeId = null;
      for (var i = 0; i < sections.length; i++) {
        if (inView[sections[i].id]) { activeId = sections[i].id; break; }
      }

      navAnchors.forEach(function (a) {
        a.classList.toggle(
          'active',
          activeId !== null && a.getAttribute('href') === '#' + activeId
        );
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.prototype.slice.call(
          entry.target.parentElement.querySelectorAll('.reveal')
        );
        var i = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- Typewriter ---------- */
  var typed = document.getElementById('typed');
  var roles = [
    'Software Engineer @ Microsoft',
    'Agentic Software Engineer',
    'CU Boulder CS, 2021',
    'Hiker & skier'
  ];

  // The markup already carries every role as a static list, which is what
  // reduced-motion and no-JS visitors keep. Only take over when motion is OK.
  if (typed && !reduceMotion) {
    var roleIdx = 0;
    var charIdx = 0;
    var deleting = false;

    var TYPE_MS = 55;
    var DELETE_MS = 28;
    var HOLD_MS = 2100;
    var GAP_MS = 350;

    var roleLine = document.getElementById('role');
    if (roleLine) roleLine.classList.add('is-typing');
    typed.textContent = '';

    function tick() {
      var word = roles[roleIdx];

      if (!deleting) {
        charIdx++;
        typed.textContent = word.slice(0, charIdx);

        if (charIdx === word.length) {
          deleting = true;
          return setTimeout(tick, HOLD_MS);
        }
        return setTimeout(tick, TYPE_MS);
      }

      charIdx--;
      typed.textContent = word.slice(0, charIdx);

      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        return setTimeout(tick, GAP_MS);
      }
      return setTimeout(tick, DELETE_MS);
    }

    setTimeout(tick, 700);
  }

  /* ---------- Email: invisible ink ----------
     The address is stored split + base64'd on #email-row and assembled only
     on demand, so it never appears in the page source for scrapers to lift.
     This is obfuscation, not encryption — it defeats source-scanning bots,
     not a determined human. */
  var emailRow = document.getElementById('email-row');

  function emailAddress() {
    if (!emailRow) return '';
    try {
      return atob(emailRow.getAttribute('data-u')) + '@' +
             atob(emailRow.getAttribute('data-d'));
    } catch (err) {
      return '';
    }
  }

  if (emailRow) {
    var ink = document.getElementById('email-ink');
    var inkText = document.getElementById('email-text');
    var maskedText = inkText.textContent;
    var pinned = false; // stays revealed once clicked or keyboard-focused

    function revealEmail() {
      var addr = emailAddress();
      if (!addr) return;
      inkText.textContent = addr;
      inkText.setAttribute('aria-hidden', 'false');
      ink.classList.add('revealed');
      ink.setAttribute('href', 'mailto:' + addr);
      ink.setAttribute('aria-label', 'Email ' + addr);
    }

    function concealEmail() {
      if (pinned) return;
      inkText.textContent = maskedText;
      inkText.setAttribute('aria-hidden', 'true');
      ink.classList.remove('revealed');
      ink.setAttribute('href', '#');
      ink.setAttribute('aria-label', 'Reveal email address');
    }

    ink.addEventListener('mouseenter', revealEmail);
    ink.addEventListener('mouseleave', concealEmail);

    ink.addEventListener('focus', function () { pinned = true; revealEmail(); });
    ink.addEventListener('blur', function () { pinned = false; concealEmail(); });

    ink.addEventListener('click', function (e) {
      // On touch there's no hover, so the first tap reveals rather than
      // firing the mailto.
      if (!ink.classList.contains('revealed')) {
        e.preventDefault();
        pinned = true;
        revealEmail();
      }
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById('copy-email');

  if (copyBtn) {
    var label = copyBtn.querySelector('.copy-label');
    var resetTimer;

    copyBtn.addEventListener('click', function () {
      var email = emailAddress();

      function done(ok) {
        clearTimeout(resetTimer);
        label.textContent = ok ? 'copied' : 'failed';
        copyBtn.classList.toggle('copied', ok);
        resetTimer = setTimeout(function () {
          label.textContent = 'copy';
          copyBtn.classList.remove('copied');
        }, 1800);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () { done(true); },
          function () { done(false); }
        );
        return;
      }

      // Fallback for non-secure contexts (e.g. plain-http local preview)
      var ta = document.createElement('textarea');
      ta.value = email;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    });
  }
})();
