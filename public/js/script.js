/* ═══════════════════════════════════════════════════════════════
   Business Standard — Main JavaScript
   NOTE: Subscribe modal logic is self-contained in header.blade.php
         Footer subscribe form is handled here.
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Footer Subscribe Form (AJAX) ─────────────────────────────
  var footerForm = document.getElementById('footerSubscribeForm');
  if (footerForm) {
    footerForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      var msgEl   = document.getElementById('footerSubscribeMsg');
      var btn     = document.getElementById('footerSubBtn');
      var btnText = document.getElementById('footerBtnText');
      var spinner = document.getElementById('footerBtnSpinner');

      // Loading state
      if (btnText) btnText.textContent = '';
      if (spinner) spinner.style.display = 'inline-block';
      if (btn)     btn.disabled = true;

      function showMsg(text, ok) {
        if (msgEl) {
          msgEl.textContent   = text;
          msgEl.style.display = 'block';
          msgEl.style.color   = ok ? '#bbf7d0' : '#fca5a5';
        }
      }

      try {
        var fd  = new FormData(footerForm);
        var res = await fetch(footerForm.action, {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
          body: fd,
        });
        var data = await res.json();

        if (res.ok) {
          // Replace strip with thank-you
          var strip = footerForm.closest('.bg-red-700');
          if (strip) {
            strip.innerHTML =
              '<div style="text-align:center; width:100%; padding:8px 0;">' +
              '<div style="display:inline-flex; align-items:center; gap:8px; color:#fff; font-size:16px; font-weight:600;">' +
              '<svg width="22" height="22" viewBox="0 0 22 22" fill="none">' +
              '<circle cx="11" cy="11" r="11" fill="rgba(255,255,255,.2)"/>' +
              '<path d="M6 11l3.5 3.5 6.5-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
              (data.message || 'Thank you for subscribing!') +
              '</div>' +
              '<p style="color:rgba(255,255,255,.7); font-size:13px; margin:4px 0 0;">Welcome to Business Standard. Check your inbox!</p>' +
              '</div>';
          }
        } else if (res.status === 409) {
          showMsg(data.message || 'This email is already subscribed.', false);
          if (spinner) spinner.style.display = 'none';
          if (btnText) btnText.textContent = btn.dataset.orig || 'Subscribe';
          if (btn)     btn.disabled = false;
        } else {
          showMsg(data.message || 'Something went wrong. Try again.', false);
          if (spinner) spinner.style.display = 'none';
          if (btnText) btnText.textContent = btn.dataset.orig || 'Subscribe';
          if (btn)     btn.disabled = false;
        }
      } catch (err) {
        showMsg('Connection error. Please try again.', false);
        if (spinner) spinner.style.display = 'none';
        if (btnText) btnText.textContent = btn.dataset.orig || 'Subscribe';
        if (btn)     btn.disabled = false;
      }
    });

    // Store original button text
    var fBtn = document.getElementById('footerSubBtn');
    var fTxt = document.getElementById('footerBtnText');
    if (fBtn && fTxt) fBtn.dataset.orig = fTxt.textContent.trim();
  }

  // ── Back to Top ──────────────────────────────────────────────
  var backTop = document.getElementById('backToTop');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
      backTop.style.opacity = window.scrollY > 400 ? '1' : '0.3';
    }, { passive: true });
  }

  // ── Lazy image loading fallback ──────────────────────────────
  if (!('loading' in HTMLImageElement.prototype)) {
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          io.unobserve(img);
        }
      });
    });
    imgs.forEach(function (img) { io.observe(img); });
  }

  // ── Share copy button ────────────────────────────────────────
  document.querySelectorAll('.share-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(function () { btn.innerHTML = orig; }, 1500);
    });
  });

  // ── Header scroll shadow ─────────────────────────────────────
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 30
        ? '0 2px 12px rgba(0,0,0,.15)'
        : '0 1px 4px rgba(0,0,0,.08)';
    }, { passive: true });
  }

  // ── Reading progress bar ─────────────────────────────────────
  if (document.querySelector('.det-body')) {
    var bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#b91c1c;z-index:9999;width:0;transition:width .1s;';
    document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var el  = document.documentElement;
      var pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

})();